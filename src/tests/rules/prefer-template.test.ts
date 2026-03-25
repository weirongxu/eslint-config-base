import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { lintHelper } from '../helper'

describe('prefer-template', () => {
  it('should error on string concatenation', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        const name = 'World'
        const message = 'Hello ' + name + '!'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'prefer-template',
    })
  })

  it('should allow template literals', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        const name = 'World'
        const message = \`Hello \${name}!\`
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'prefer-template',
    })
  })
})
