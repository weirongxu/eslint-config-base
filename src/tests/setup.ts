import { expect } from 'vitest'
import { LintResult, SEVERITY } from './helper'

type CustomMatchers = {
  toRuleCount: (
    count: number,
    options: {
      rule: string
      severity: (typeof SEVERITY)[keyof typeof SEVERITY]
      includeMessage?: string
    },
  ) => void
}

declare module 'vitest' {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toRuleCount(
    received: LintResult,
    count: number,
    options: {
      rule: string
      severity: (typeof SEVERITY)[keyof typeof SEVERITY]
      includeMessage?: string
    },
  ) {
    const actualCount = received.ruleCount(options)
    const pass = actualCount === count

    return {
      pass,
      message: () => {
        const severityText =
          options.severity === SEVERITY.WARN ? 'warn' : 'error'
        const ruleText = `rule "${options.rule}"`
        return `Expected ${ruleText} to have ${count} ${severityText} violation${count === 1 ? '' : 's'}, but got ${actualCount}`
      },
    }
  },
})
