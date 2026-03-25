import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper'

describe('object-shorthand', () => {
  it('should error when not using shorthand', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        const obj = { name: name }
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'object-shorthand',
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
    })
  })
})
