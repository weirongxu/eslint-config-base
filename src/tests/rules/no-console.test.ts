import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper'

describe('no-console', () => {
  it('should warn on console.log', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        console.log('test')
        console.debug('test')
      `,
    )
    expect(result).toRuleCount(2, {
      rule: 'no-console',
    })
  })

  it('should allow console.error', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        console.error('test')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'no-console',
    })
  })

  it('should allow console.warn', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        console.warn('test')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'no-console',
    })
  })

  it('should warn on console.info', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        console.info('test')
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'no-console',
    })
  })

  it('should allow console.assert', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        console.assert(true, 'test')
        console.assert(false, 'error message')
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'no-console',
    })
  })
})
