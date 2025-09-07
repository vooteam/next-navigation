# Changelog

All notable changes to `@vooteam/next-navigation` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-07

### Added

- 🚀 Initial release of @vooteam/next-navigation
- ✨ Async navigation with `useNavigation` hook
- 📊 Built-in progress bar with `ProgressProvider`
- 🎯 Type-safe route navigation with `createNextNavigation`
- ⚡ React 18 `useTransition` integration for optimal UX
- 🎨 Highly customizable progress bar configurations
- 📦 Zero external dependencies (only peer dependencies)
- 🧪 100% test coverage
- 📚 Comprehensive TypeScript support
- 🔧 Next.js 13+ App Router compatibility

### Features

- **Navigation Methods**: `push()`, `replace()`, `back()` with Promise support
- **Loading States**: Built-in `isPending` state management
- **Progress Indicators**: Customizable progress bars with animations
- **Type Safety**: Full TypeScript integration with route type checking
- **Configurable**: Extensive customization options for progress bars
- **Performance**: Optimized bundle size (~2KB gzipped)
- **Testing**: Comprehensive test suite with React Testing Library

### Technical Details

- Minimum Next.js version: 13.0.0
- Minimum React version: 18.0.0
- TypeScript support: 5.0.0+
- Bundle size: ~2KB gzipped
- Test coverage: 100% (statements, branches, functions, lines)
