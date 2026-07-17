import dedent from 'dedent'
import { describe, expect, it } from 'vitest'

import { lintHelper } from '../helper'

describe('@typescript-eslint/no-import-type-side-effects', () => {
  it('should error on inline type only import', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { type A } from './types';
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })

  it('should error on multiple inline type imports', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { type A, type B } from './types';
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })

  it('should allow top-level type import', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import type { A } from './types';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })

  it('should allow top-level type import with multiple types', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import type { A, B } from './types';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })

  it('should allow mixed value and type import', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { A, type B } from './module';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })

  it('should allow value-only import', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import { A } from './module';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })

  it('should allow default import', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import A from './module';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })

  it('should allow default type import', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import type A from './types';
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })

  it('should allow type import with side-effect import', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        import './side-effect';
        import { type A } from './types';
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-import-type-side-effects',
    })
  })
})
