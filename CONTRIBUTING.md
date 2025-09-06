# Contributing to @vooteam/next-navigation

Thank you for your interest in contributing to @vooteam/next-navigation! This guide will help you get started.

## 🚀 Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/next-navigation.git
   cd next-navigation
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run tests to ensure everything works**
   ```bash
   pnpm run test:all
   ```

## 🛠️ Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Edit files in `packages/next-navigation/src/`
   - Add or update tests in `*.spec.ts` files
   - Update documentation if needed

3. **Run the development commands**

   ```bash
   # Run tests
   pnpm run test

   # Build the package
   pnpm run build

   # Run linting
   pnpm run lint
   ```

4. **Test your changes**

   ```bash
   # Start the development server
   pnpm run dev

   # The app will run at http://localhost:3000 (or 3001 if 3000 is busy)
   # Make changes to the library and test them in the running app
   ```

## 📝 Code Standards

- **TypeScript**: All code should be written in TypeScript
- **Testing**: Add tests for new features and bug fixes
- **Linting**: Follow ESLint rules (run `pnpm run lint`)
- **Formatting**: Code is automatically formatted with Prettier

## 🧪 Testing

- Write unit tests for all new functionality
- Ensure all existing tests pass
- Aim for good test coverage
- Use descriptive test names

```typescript
// Good test example
describe('AuthSession', () => {
  it('should create auth session with valid config', () => {
    const config = createAuthConfig({ baseUrl: 'http://localhost:3000' });
    const session = new AuthSession(config);
    expect(session).toBeInstanceOf(AuthSession);
  });
});
```

## 📚 Documentation

- Update README.md if you add new features
- Add JSDoc comments for public APIs
- Update CHANGELOG.md for notable changes
- Include code examples for new functionality

## 🔄 Pull Request Process

1. **Update the branch**

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Add a changeset** (if your changes should trigger a release)
   ```bash
   pnpm run changeset
   ```
   Follow the prompts to describe your changes and select the appropriate version bump type.

3. **Run all checks locally**

   ```bash
   pnpm run test:all
   pnpm run lint:all
   pnpm run build:all
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

5. **Push and create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use a descriptive title
   - Fill out the PR template
   - Link any related issues
   - Add screenshots if applicable

## 🏷️ Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semi colons, etc
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` updating build tasks, package manager configs, etc

Examples:

```
feat: add support for OAuth providers
fix: resolve token refresh issue
docs: update installation guide
test: add tests for AuthSession class
```

## 🐛 Reporting Issues

When creating an issue, please include:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, package version)
- Code examples or error messages

## 📦 Release Process

Releases are handled automatically via GitHub Actions:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create and push a version tag: `git tag v1.0.0 && git push origin v1.0.0`
4. GitHub Actions will handle the NPM publish

## ❓ Questions

If you have questions, feel free to:

- Open a GitHub Discussion
- Create an issue with the "question" label
- Reach out to the maintainers

## 🙏 Thank You

Every contribution helps make @vooteam/next-navigation better. Thank you for taking the time to contribute!
