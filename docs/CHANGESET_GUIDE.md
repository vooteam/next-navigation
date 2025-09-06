# Changeset Guide

This project uses [Changesets](https://github.com/changesets/changesets) for version management and changelog generation.

## What are Changesets?

Changesets are a way to manage versioning and changelogs with a focus on monorepos. They help you:

- **Track changes** that should trigger a version bump
- **Generate changelogs** automatically
- **Coordinate releases** across multiple packages
- **Manage semver** (semantic versioning) correctly

## When to Create a Changeset

Create a changeset when your changes should trigger a new release:

- ✅ **New features** (minor version bump)
- ✅ **Bug fixes** (patch version bump)  
- ✅ **Breaking changes** (major version bump)
- ❌ **Documentation updates** (usually no release needed)
- ❌ **Internal refactoring** (no public API changes)

## How to Create a Changeset

### Interactive Mode (Recommended)

```bash
pnpm run changeset
```

This will prompt you to:

1. **Select packages**: Choose which packages are affected
2. **Select bump type**: Choose patch, minor, or major
3. **Write summary**: Describe what changed

### Example Session

```
🦋  Which packages would you like to include?
◉ @vooteam/next-navigation

🦋  Which packages should have a major bump?
◯ @vooteam/next-navigation

🦋  Which packages should have a minor bump?
◉ @vooteam/next-navigation

🦋  Which packages should have a patch bump?
◯ @vooteam/next-navigation

🦋  Please enter a summary for this change:
Add support for custom authentication providers
```

### Manual Creation

You can also create changeset files manually in `.changeset/`:

```markdown
---
"@vooteam/next-navigation": minor
---

Add support for custom authentication providers

This change allows users to configure custom OAuth providers
through the AuthConfig interface.
```

## Changeset Commands

| Command | Description |
|---------|-------------|
| `pnpm run changeset` | Create a new changeset |
| `pnpm run changeset:status` | Check current changeset status |
| `pnpm run changeset:version` | Apply changesets and bump versions |
| `pnpm run changeset:publish` | Publish packages to npm |

## Release Process

### Automated (Recommended)

1. **Create changeset** when making changes:
   ```bash
   pnpm run changeset
   ```

2. **Commit and push** your changes:
   ```bash
   git add .changeset/
   git commit -m "feat: add new feature"
   git push
   ```

3. **Merge to main** - this triggers the release workflow

4. **Version PR created** - GitHub Actions creates a "Version Packages" PR

5. **Merge Version PR** - this publishes the packages to npm

### Manual

```bash
# Check what will be released
pnpm run changeset:status

# Update versions and generate changelog
pnpm run changeset:version

# Build and publish
pnpm run release
```

## Changeset Types

### Patch (0.0.X)
- Bug fixes
- Security patches
- Documentation fixes
- Internal refactoring (no API changes)

### Minor (0.X.0)
- New features
- New exports
- Deprecations (with backwards compatibility)
- Performance improvements

### Major (X.0.0)
- Breaking changes
- Removed features
- Changed public APIs
- Dependency updates that break compatibility

## Best Practices

1. **Write clear summaries** - they become your changelog
2. **Use conventional commits** for consistency
3. **Group related changes** in a single changeset when possible
4. **Test locally** before creating changesets
5. **Include migration guides** for breaking changes

## Troubleshooting

### "No changesets found" error
This means you have changes but no changeset. Either:
- Run `pnpm run changeset` to create one
- Run `pnpm run changeset --empty` if no release is needed

### Changeset not detecting package
Make sure your package is listed in the workspace and has the correct name in `package.json`.

### Version not updating
Check that the changeset file references the correct package name and is in the `.changeset/` directory.
