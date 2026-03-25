import { describe, expect, it } from 'vitest'
import dedent from 'dedent'
import { LintHelper, SEVERITY, tsconfig } from '../helper'

const lintHelper = new LintHelper(tsconfig)

describe('no-deprecated', () => {
  it('should error on using deprecated function', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        /** @deprecated Use newFunction instead */
        function oldFunction() {}

        oldFunction();
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on using deprecated class', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        /** @deprecated Use NewClass instead */
        class OldClass {}

        const instance = new OldClass();
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on using deprecated method', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        class MyClass {
          /** @deprecated Use newMethod instead */
          oldMethod() {}
        }

        const obj = new MyClass();
        obj.oldMethod();
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on using deprecated property', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        class MyClass {
          /** @deprecated Use newProp instead */
          oldProp: string;
        }

        const obj = new MyClass();
        console.log(obj.oldProp);
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on using deprecated enum member', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        enum MyEnum {
          /** @deprecated Use NEW_VALUE instead */
          OLD_VALUE
        }

        const value = MyEnum.OLD_VALUE;
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on using deprecated type', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        /** @deprecated Use NewType instead */
        type OldType = string;

        const value: OldType = 'test';
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on using deprecated interface', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        /** @deprecated Use NewInterface instead */
        interface OldInterface {
          name: string;
        }

        const obj: OldInterface = { name: 'test' };
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should error on using deprecated function with deprecated parameter', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        /** @deprecated Use newFunction instead */
        function myFunction(
          /** @deprecated Use newParam instead */
          oldParam: string
        ) {}

        myFunction('test');
      `,
    )
    expect(result).toRuleCount(1, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow non-deprecated code', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        function myFunction() {}

        myFunction();
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })

  it('should allow using new replacement function', async () => {
    const result = await lintHelper.fromContent(
      dedent`
        /** @deprecated Use newFunction instead */
        function oldFunction() {}

        function newFunction() {}

        newFunction();
      `,
    )
    expect(result).toRuleCount(0, {
      rule: '@typescript-eslint/no-deprecated',
      severity: SEVERITY.ERROR,
    })
  })
})
