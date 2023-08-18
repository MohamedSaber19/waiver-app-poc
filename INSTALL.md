# Install

## Create Next.js app

To automatically create a new Next.js project:

```shell
pnpx create-next-app@latest
```

## Add editor configuration

### Create `.editorconfig` file

```shell
touch .editorconfig
```

#### Add the following config to the newly created `.editorconfig` file

```plaintext
# EditorConfig helps developers define and maintain consistent
# coding styles between different editors and IDEs
# editorconfig.org

root = true

[*]
# Change these settings to your own preference
indent_style = space
indent_size = 2

# We recommend you to keep these unchanged
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = false

[*.md]
trim_trailing_whitespace = false

```

## Add prettier integration

```shell
pnpm add --save-dev --save-exact prettier eslint-config-prettier eslint-plugin-prettier
```

### Create `.prettierrc.js` file

```shell
touch .prettierrc.json
```

### Add the following content in `.prettierrc.json` file

```json
{
  "semi": false,
  "useTabs": false,
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "es5",
  "parser": "typescript",
  "bracketSpacing": true,
  "arrowParens": "always",
  "bracketSameLine": false
}
```

### Add the following content in `.eslintrc.js` file

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"]
}
```

### Add prettier-plugin-tailwindcss

```shell
pnpm add -D prettier-plugin-tailwindcss
```

Then add the plugin & function names to your Prettier config:

1. Sorting classes in the class attribute as well as any framework-specific equivalents like class, className, :class,[ngClass] etc.
2. `tailwindFunctions` => Sorting classes in non-stander function calls

```json
{
  "tailwindFunctions": ["clsx", "cn"],
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### Created ignore files

```shell
touch .gitignore
touch .eslintignore
touch .prettierignore
```

#### Add the following config to the newly created `.gitignore` file & base your `.eslintignore` & `.prettierignore`

with `.gitignore` file

```plaintext
/node_modules
/coverage
/.next/
/build
/dist
.DS_Store
.vscode
.idea
*.patch
/.eslintcache
*.log*
.env*.local
.vercel
*.tsbuildinfo
next-env.d.ts
```

## Add Git Hook (**_not working in a monorepo_**)

Add the following to your package.json:

```json
{
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": ["pnpx eslint . --fix"]
  }
}
```

Install husky and lint-staged:

```shell
pnpm add --save-dev husky lint-staged
pnpm exec husky install
npm pkg set scripts.prepare="husky install"
pnpm exec husky add .husky/pre-commit "pnpm exec lint-staged"
```

For custom directories

```shell
pnpm add --save-dev husky lint-staged
cd ..
husky install web/.husky
cd web
npm pkg set scripts.prepare="cd .. && husky install web/.husky"
```

## Teller integration for environment variables

Add `.env.default` file

```shell
touch .env.default
```

Add `.teller.yml` file

```shell
touch .teller.yml
```

Add the following content to `.teller.yml` file

```yaml
project: { project-name }

# Set this if you want to carry over parent process' environment variables
# carry_env: true

#
# Variables
#
# Feel free to add options here to be used as a variable throughout
# paths.
#
opts:
  #region: env:AWS_REGION    # you can get env variables with the 'env:' prefix
  prefix: env:PREFIX

#
# Providers
#
providers:
  google_secretmanager:
    env:
      FIREBASE_CONFIG:
        path: { path to secret }
  dotenv:
    env_sync:
      path: ./.env.default
```

Install `cross-env`

```shell
pnpm add -D cross-env
```

Add the following npm scripts to `packag.json`

```json
{
  "scripts": {
    "setup": "cross-env PREFIX=dev teller env > .env.local"
  }
}
```

Setup env vars

```shell
pnpm run setup
```

## Install Shadcn UI

Run the shadcn-ui init command to set up your project:

```shell
pnpx shadcn-ui@latest init
```

Apply the following choices

```shell
✔ Would you like to use TypeScript (recommended)? … yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … styles/globals.css
✔ Would you like to use CSS variables for colors? … yes
✔ Where is your tailwind.config.js located? … tailwind.config.js
✔ Configure the import alias for components: … ~/components
✔ Configure the import alias for utils: … ~/lib/utils
✔ Are you using React Server Components? … yes
✔ Write configuration to components.json. Proceed? … yes
```

Start adding components to your project.

```shell
pnpx shadcn-ui@latest add
```

Apply the following choices

```shell
✔ Which components would you like to add? › button, checkbox, input, label, select, switch, toast
✔ Ready to install components and dependencies. Proceed? … yes
```

## Add Next-Auth Email Provider and firebase adapter

Install `nodemailer` & `firebase-admin` & `@next-auth/firebase-adapter`

```shell
pnpm add nodemailer firebase-admin @next-auth/firebase-adapter
```

Add the following environment variables to `.env.local` and configure secret once in teller

```dotenv
FIREBASE_CONFIG={secret}
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PORT=587
EMAIL_SERVER_PASSWORD={secret}
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_FROM=hello@bloowatch.com
```

Add `initFirebase` utility function to utils

```typescript
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, getApp } from "firebase-admin/app";

export function initializeFirebase() {
  const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG;
  const firebaseConfig = FIREBASE_CONFIG
    ? JSON.parse(atob(FIREBASE_CONFIG))
    : {};
  const firebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  return {
    firestore: getFirestore(firebaseApp),
  };
}
```

Add `@next-auth/firebase-adapter` database adapter integration and `MailProvider` in next auth options

```typescript
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";

import { initializeFirebase } from "@/libs/firebase/utils";

export function initializeServerFirebase() {
  const projectId = process.env.FIREBASE_PROJECT;
  let firebaseApp =
    getApps().length === 0
      ? initializeApp({
          projectId,
          credential:
            process.env.NODE_ENV !== "production"
              ? applicationDefault()
              : undefined,
        })
      : getApp();

  return {
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}
```
