import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { LintHelper, SEVERITY, tsconfig } from '../helper'

const lintHelper = new LintHelper(tsconfig)

describe('require-await', () => {
  it('should allow async function without await (rule disabled)', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        async function foo() {
          return Promise.resolve('value')
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'no-async-promise-executor',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow async arrow function without await (rule disabled)', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        async () => {
          return 'value'
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'no-async-promise-executor',
      severity: SEVERITY.ERROR,
    })
  })
})
