import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper, SEVERITY } from '../helper'

describe('no-floating-promises', () => {
  it('should error on floating promise without handling', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        Promise.resolve('value')
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-floating-promises',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow handled promise with await', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        async function test() {
          await Promise.resolve('value')
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-floating-promises',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow handled promise with catch', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        Promise.resolve('value').catch(console.error)
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-floating-promises',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow returned promise', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        function test() {
          return Promise.resolve('value')
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-floating-promises',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on floating promise in function', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        function test() {
          Promise.resolve('value')
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-floating-promises',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow void expression with promise', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        void Promise.resolve('value')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-floating-promises',
      severity: SEVERITY.ERROR,
    })
  })
})
