# Personal Eslint rules for Typescript

## Install

```
npm install @raidou/eslint-config-base
```

## Usage

eslint.config.mjs

```javascript
import { tsconfig } from '@raidou/eslint-config-base';
export default tsconfig;
```

custom rules

```javascript
import { tsconfig, tseslint } from '@raidou/eslint-config-base';
export default tseslint.config(tsconfig, {
  rules: {
    'no-var': 'off',
  },
});
```
