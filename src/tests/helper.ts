import { Linter } from 'eslint'
import { tsconfig } from '../index'

export const SEVERITY = {
  ERROR: 2,
  WARN: 1,
} as const

export class LintResult {
  public readonly messages: Linter.LintMessage[]

  private constructor(messages: Linter.LintMessage[]) {
    this.messages = messages
  }

  static async fromContent(
    content: string,
    options?: { filename?: string },
  ): Promise<LintResult> {
    const linter = new Linter()

    const messages = linter.verify(
      content.endsWith('\n') ? content : `${content}\n`,
      tsconfig,
      {
        filename: options?.filename || 'test.ts',
      },
    )
    return new LintResult(messages)
  }

  ruleCount(
    options: {
      rule?: string
      message?: string
      severity?: 1 | 2
    } = {},
  ): number {
    const { rule, message, severity } = options
    return this.messages.filter(
      (m) =>
        (rule === undefined || m.ruleId === rule) &&
        (severity === undefined || m.severity === severity) &&
        (message === undefined || m.message.includes(message)),
    ).length
  }
}
