import { jsconfig, tsconfig } from '../src'
import { ejectRules } from '../src/eject-rules'

const main = async (): Promise<void> => {
  await Promise.all([
    ejectRules(jsconfig, 'rules/js-rules'),
    ejectRules(tsconfig, 'rules/ts-rules'),
  ])
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
