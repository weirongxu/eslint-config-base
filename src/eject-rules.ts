import { RulesConfig } from '@eslint/core'
import { Linter } from 'eslint'
import { mkdir, writeFile } from 'node:fs/promises'

export type RuleUrlConfig = {
  baseUrl: string
  suffix?: string
  fixed?: boolean
}

export type RuleUrlMapping = Record<`${string}/`, RuleUrlConfig>

const RULE_URL_MAPPING: RuleUrlMapping = {
  '@typescript-eslint/': {
    baseUrl: 'https://typescript-eslint.io/rules/',
  },
  '@stylistic/': {
    baseUrl: 'https://eslint.style/rules/',
  },
  'vue/': {
    baseUrl: 'https://eslint.vuejs.org/rules/',
  },
  'unicorn/': {
    baseUrl:
      'https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/',
    suffix: '.md',
  },
  'react/': {
    baseUrl:
      'https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/',
    suffix: '.md',
  },
  'flowtype/': {
    baseUrl:
      'https://github.com/gajus/eslint-plugin-flowtype#eslint-plugin-flowtype-rules-',
  },
  '@babel/': {
    baseUrl: 'https://www.npmjs.com/package/@babel/eslint-plugin',
    fixed: true,
  },
  'babel/': {
    baseUrl: 'https://www.npmjs.com/package/@babel/eslint-plugin',
    fixed: true,
  },
  'prettier/': {
    baseUrl: 'https://github.com/prettier/eslint-plugin-prettier',
    fixed: true,
  },
  'standard/': {
    baseUrl: 'https://standardjs.com/rules',
    fixed: true,
  },
}

const flatRules = (config: Linter.Config[]): Partial<RulesConfig> => {
  return config.reduce<Partial<RulesConfig>>(
    (acc, c) => ({ ...acc, ...c.rules }),
    {},
  )
}

const sortRules = (rules: Partial<RulesConfig>): Partial<RulesConfig> => {
  return Object.fromEntries(
    Object.entries(rules).sort(([a], [b]) => a.localeCompare(b)),
  )
}

const getRuleUrl = (
  ruleName: string,
  mergedMapping: RuleUrlMapping,
): string => {
  for (const [prefix, config] of Object.entries(mergedMapping)) {
    if (ruleName.startsWith(prefix)) {
      if (config.fixed) return config.baseUrl
      const ruleId = ruleName.replace(prefix, '')
      return `${config.baseUrl}${ruleId}${config.suffix ?? ''}`
    }
  }
  if (ruleName.includes('/'))
    throw new Error(`Not matching rule name: ${ruleName}`)
  return `https://eslint.org/docs/latest/rules/${ruleName}`
}

const rulesToJsonc = (
  sortedRules: Partial<RulesConfig>,
  mergedMapping: RuleUrlMapping,
): string => {
  const ruleEntries = Object.entries(sortedRules)
  const lines = ['{']

  for (const [ruleName, ruleValue] of ruleEntries) {
    const url = getRuleUrl(ruleName, mergedMapping)
    const valueJson = JSON.stringify(ruleValue)

    lines.push(`  // ${url}`)
    lines.push(`  "${ruleName}": ${valueJson},`)
  }

  // Remove trailing comma from last line
  const lastLine = lines[lines.length - 1]
  if (lastLine) {
    lines[lines.length - 1] = lastLine.replace(/,$/, '')
  }

  lines.push('}')
  return lines.join('\n')
}

export type EjectRulesOptions = {
  /**
   * Custom rule URL mapping to extend or override default RULE_URL_MAPPING
   */
  customRuleUrlMapping?: Partial<RuleUrlMapping>
}

export const ejectRules = async (
  config: Linter.Config[],
  outputPath: string,
  options?: EjectRulesOptions,
): Promise<void> => {
  const { customRuleUrlMapping = {} } = options ?? {}
  const rules = flatRules(config)
  const sortedRules = sortRules(rules)

  // Merge mappings once using object spread
  const mergedMapping = {
    ...RULE_URL_MAPPING,
    ...customRuleUrlMapping,
  } as RuleUrlMapping

  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'))

  await Promise.all([
    mkdir(dir, { recursive: true }),
    writeFile(`${outputPath}.jsonc`, rulesToJsonc(sortedRules, mergedMapping)),
    writeFile(`${outputPath}.json`, JSON.stringify(sortedRules, null, 2)),
  ])
}
