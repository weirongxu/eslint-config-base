import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { LintResult, SEVERITY } from '../helper'

describe('@typescript-eslint/only-throw-error', () => {
  it('should error on throwing string', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw 'error message'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on throwing number', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw 404
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on throwing boolean', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw true
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on throwing object', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw { code: 404, message: 'Not Found' }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on throwing null', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw null
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on throwing undefined', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw undefined
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow throwing Error', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw new Error('error message')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow throwing TypeError', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw new TypeError('type error')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow throwing RangeError', async () => {
    const result = await LintResult.fromContent(
      dedent`
        throw new RangeError('range error')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow throwing custom Error class', async () => {
    const result = await LintResult.fromContent(
      dedent`
        class CustomError extends Error {
          constructor(message: string) {
            super(message)
            this.name = 'CustomError'
          }
        }
        throw new CustomError('custom error')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on throwing re-thrown non-Error', async () => {
    const result = await LintResult.fromContent(
      dedent`
        try {
          // something
        } catch (e) {
          throw 'caught'
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/only-throw-error',
      severity: SEVERITY.ERROR,
    })
  })
})
