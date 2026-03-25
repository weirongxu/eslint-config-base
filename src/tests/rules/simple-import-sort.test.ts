import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper'

describe('simple-import-sort', () => {
  it('should error when imports are not sorted', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { b } from 'beta'
        import { a } from 'alpha'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'simple-import-sort/imports',
    })
  })

  it('should allow sorted imports', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { a } from 'alpha'
        import { b } from 'beta'
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'simple-import-sort/imports',
    })
  })

  it('should error when named imports are not sorted alphabetically', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { z, a, m } from 'module'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'simple-import-sort/imports',
    })
  })

  it('should allow alphabetically sorted named imports', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { a, m, z } from 'module'
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'simple-import-sort/imports',
    })
  })

  it('should error when type imports are not properly sorted with regular imports', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { b } from 'beta'
        import type { C } from 'charlie'
        import { a } from 'alpha'
      `,
    )
    expect(result).toRuleCount(1, {
      rule: 'simple-import-sort/imports',
    })
  })

  it('should allow properly sorted type and regular imports', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { a } from 'alpha'
        import { b } from 'beta'
        import type { C } from 'charlie'
      `,
    )
    expect(result).toRuleCount(0, {
      rule: 'simple-import-sort/imports',
    })
  })
})
