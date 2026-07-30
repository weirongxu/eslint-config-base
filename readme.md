# Personal Eslint rules for Typescript

## Install

```
npm install @raidou/eslint-config-base
```

## Usage

eslint.config.mjs

```javascript
import { tsconfig } from '@raidou/eslint-config-base'
import { defineConfig, globalIgnores } from 'eslint/config'
export default defineConfig([
  globalIgnores(['**/node_modules/', '**/.vitest/', '**/dist/', '**/.venv/']),
  tsconfig,
  {
    rules: {
      // ...
    },
  },
])
```
