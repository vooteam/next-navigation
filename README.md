# Vooteam Next Navigation

[![CI/CD Pipeline](https://github.com/vooteam/next-navigation/actions/workflows/ci.yml/badge.svg)](https://github.com/vooteam/next-navigation/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/%40vooteam%2Fnext-navigation.svg)](https://www.npmjs.com/package/@vooteam/next-navigation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Next.js navigation and authentication library for Vooteam projects, built with [Nx](https://nx.dev).

## 📦 Packages

- **[@vooteam/next-navigation](./packages/next-navigation)** - Main navigation and authentication library
- **[test-app](./apps/test-app)** - Next.js test application for development

## 🚀 Quick Start

### Installation

```bash
npm install @vooteam/next-navigation
# or
pnpm add @vooteam/next-navigation
# or
yarn add @vooteam/next-navigation
```

### Usage

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
```

## 🛠️ Development

### Prerequisites

- Node.js 18.x or 20.x
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/vooteam/next-navigation.git
cd next-navigation

# Install dependencies
pnpm install

# Build the library
pnpm run build

# Run tests
pnpm run test
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start the Next.js test app for development |
| `pnpm run dev:lib` | Build the library in watch mode for development |
| `pnpm run build` | Build the @vooteam/next-navigation package |
| `pnpm run build:app` | Build the Next.js test app |
| `pnpm run test` | Run tests for the package |
| `pnpm run test:watch` | Run tests in watch mode for development |
| `pnpm run lint` | Run ESLint on the package |
| `pnpm run build:all` | Build all projects in the workspace |
| `pnpm run test:all` | Run tests for all projects |
| `pnpm run lint:all` | Run ESLint on all projects |
| `pnpm run changeset` | Add a new changeset for version management |
| `pnpm run changeset:version` | Apply changesets and update package versions |
| `pnpm run changeset:publish` | Publish packages to NPM |
| `pnpm run changeset:status` | Check the status of changesets |
| `pnpm run release` | Build, test, and publish packages |

### Development Workflow

1. **Start the development server** with `pnpm run dev`
2. **Make changes** to the library in `packages/next-navigation/`
3. **Add a changeset** with `pnpm run changeset` (describe your changes)
4. **Run tests** with `pnpm run test` or `pnpm run test:watch`
4. **Build the package** with `pnpm run build`
5. **Test changes** in the running Next.js app at `http://localhost:3000`

## 🚀 CI/CD & Publishing

### Automated CI/CD

This project uses GitHub Actions and Changesets for continuous integration and deployment:

- **CI Pipeline** (`.github/workflows/ci.yml`): Runs on every push and PR
  - Tests on Node.js 18.x and 20.x
  - Runs linting, testing, and building
  - Uploads test coverage

- **Changeset Release** (`.github/workflows/changeset-release.yml`): Automated releases
  - Triggered on pushes to main branch
  - Uses changesets for version management
  - Automatically creates release PRs
  - Publishes to NPM when changesets are merged

- **Manual Publish** (`.github/workflows/manual-publish.yml`): For testing
  - Supports dry-run mode
  - Allows custom NPM tags (latest, beta, alpha)

### Publishing a New Version with Changesets

#### Step 1: Create a Changeset

When you make changes that should trigger a release, create a changeset:

```bash
pnpm run changeset
```

This will prompt you to:
- Select which packages changed
- Choose the type of change (patch, minor, major)
- Write a summary of the changes

#### Step 2: Commit and Push

```bash
git add .changeset/
git commit -m "feat: add new feature"
git push origin your-branch
```

#### Step 3: Merge to Main

When your PR is merged to main, the changeset release workflow will:
- Create a "Version Packages" PR with updated versions and changelog
- When you merge this PR, it automatically publishes to NPM

### Manual Release (Alternative)

1. Update the version in `packages/next-navigation/package.json`
2. Update `CHANGELOG.md` with the new version
3. Create and push a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. The release workflow will automatically publish to NPM

#### Option 2: Manual Release

1. Go to **Actions** → **Manual Publish** in GitHub
2. Click **Run workflow**
3. Choose dry-run mode for testing, or disable for actual publish
4. Select the NPM tag (latest, beta, alpha)

### NPM Setup

To publish to NPM, you need to set up the `NPM_TOKEN` secret in your repository:

1. Generate an NPM token at [npmjs.com](https://www.npmjs.com/settings/tokens)
2. Add it as `NPM_TOKEN` in your repository secrets
3. Ensure your NPM account has access to publish `@vooteam` scoped packages

## 📁 Project Structure

```
next-navigation/
├── packages/
│   └── next-navigation/          # Main library package
│       ├── src/
│       │   ├── lib/
│       │   │   ├── next-navigation.ts     # Core library code
│       │   │   └── next-navigation.spec.ts # Tests
│       │   └── index.ts          # Package exports
│       ├── package.json          # Package configuration
│       ├── README.md            # Package documentation
│       └── dist/                # Build output
├── apps/
│   └── test-app/                # Next.js test application
├── .github/
│   ├── workflows/               # GitHub Actions workflows
│   └── ISSUE_TEMPLATE/         # Issue templates
├── CHANGELOG.md                 # Version history
└── nx.json                     # Nx workspace configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `pnpm run test:all`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Package Documentation](./packages/next-navigation/README.md)
- [Changeset Guide](./docs/CHANGESET_GUIDE.md)
- [Changelog](./CHANGELOG.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Nx Documentation](https://nx.dev)
- [NPM Package](https://www.npmjs.com/package/@vooteam/next-navigation)
