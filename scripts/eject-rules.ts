import { RulesConfig } from '@eslint/core'
import { Linter } from 'eslint'
import { mkdir, writeFile } from 'node:fs/promises'
import { jsconfig, tsconfig } from '../src'

type RuleUrlConfig = {
  baseUrl: string
  suffix?: string
  fixed?: boolean
}

const RULE_URL_MAPPING: Record<`${string}/`, RuleUrlConfig> = {
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

const getRuleUrl = (ruleName: string): string => {
  for (const [prefix, config] of Object.entries(RULE_URL_MAPPING)) {
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

const rulesToJsonc = (rules: Partial<RulesConfig>): string => {
  const sortedRules = Object.entries(sortRules(rules))

  const lines = ['{']

  for (const [ruleName, ruleValue] of sortedRules) {
    const url = getRuleUrl(ruleName)
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

const writeFiles = async (
  name: string,
  rules: Partial<RulesConfig>,
): Promise<void> => {
  const sortedRules = sortRules(rules)
  await Promise.all([
    writeFile(`rules/${name}-rules.jsonc`, rulesToJsonc(rules)),
    writeFile(`rules/${name}-rules.json`, JSON.stringify(sortedRules, null, 2)),
  ])
}

const main = async (): Promise<void> => {
  const jsrules = flatRules(jsconfig)
  const tsrules = flatRules(tsconfig)

  await mkdir('rules', { recursive: true })
  await Promise.all([writeFiles('js', jsrules), writeFiles('ts', tsrules)])
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
