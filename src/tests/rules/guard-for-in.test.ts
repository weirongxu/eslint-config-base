import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper, SEVERITY } from '../helper'

describe('guard-for-in', () => {
  it('should error on for...in without if guard', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        for (const key in obj) {
          console.log(key);
        }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'guard-for-in',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow for...in with if guard', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        for (const key in obj) {
          if (Object.hasOwn(obj, key)) {
            console.log(key);
          }
        }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'guard-for-in',
      severity: SEVERITY.ERROR,
    })
  })
})
