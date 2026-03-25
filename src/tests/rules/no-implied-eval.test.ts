import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { LintHelper, SEVERITY, tsconfig } from '../helper'

const lintHelper = new LintHelper(tsconfig)

describe('@typescript-eslint/no-implied-eval', () => {
  it('should error on setTimeout with string', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        setTimeout('console.log("test")', 1000)
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-implied-eval',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on setInterval with string', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        setInterval('console.log("test")', 1000)
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-implied-eval',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on setImmediate with string', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        setImmediate('console.log("test")')
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-implied-eval',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow setTimeout with function', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        setTimeout(() => console.log('test'), 1000)
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-implied-eval',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow setInterval with function', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        setInterval(() => console.log('test'), 1000)
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-implied-eval',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow setImmediate with function', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        setImmediate(() => console.log('test'))
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-implied-eval',
      severity: SEVERITY.ERROR,
    })
  })
})
