# @vooteam/next-navigation

A Next.js navigation and authentication library for Vooteam projects.

This library was generated with [Nx](https://nx.dev).

## Installation

```bash
npm install @vooteam/next-navigation
# or
pnpm add @vooteam/next-navigation
# or
yarn add @vooteam/next-navigation
```

## Usage

```typescript
import { AuthSession, createAuthConfig } from '@vooteam/next-navigation';

// Create auth configuration
const config = createAuthConfig({
  baseUrl: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
});

// Create auth session
const authSession = new AuthSession(config);

// Sign in user
const user = await authSession.signIn({
  email: 'user@example.com',
  password: 'password',
});

// Get current session
const currentUser = await authSession.getSession();

// Sign out
await authSession.signOut();
```

## Building

Run `nx build @vooteam/next-navigation` to build the library.

## Running unit tests

Run `nx test @vooteam/next-navigation` to execute the unit tests via [Vitest](https://vitest.dev/).
