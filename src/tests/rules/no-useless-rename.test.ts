import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper, SEVERITY } from '../helper'

describe('no-useless-rename', () => {
  it('should error on useless destructuring rename', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        const { foo: foo } = obj
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'no-useless-rename',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow meaningful destructuring rename', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        const { foo: bar } = obj
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'no-useless-rename',
      severity: SEVERITY.ERROR,
    })
  })
})
