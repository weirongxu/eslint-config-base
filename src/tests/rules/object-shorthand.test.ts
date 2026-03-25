import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper, SEVERITY } from '../helper'

describe('object-shorthand', () => {
  it('should error when not using shorthand', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        const obj = { name: name }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'object-shorthand',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow shorthand syntax', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        const obj = { name }
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'object-shorthand',
      severity: SEVERITY.ERROR,
    })
  })
})
