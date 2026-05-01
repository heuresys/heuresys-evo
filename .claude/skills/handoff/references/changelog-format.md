# CHANGELOG.md format reference (`.evo` edition)

The `CHANGELOG.md` file is **append-only** and **user-facing**. Follows [Keep a Changelog v1.1.0](https://keepachangelog.com/en/1.1.0/).

Distinct from `PROJECT-LOG.md`:
- `PROJECT-LOG.md` = dev-facing, **all** sessions (even pure refactor / docs / WIP)
- `CHANGELOG.md` = user-facing, **only** sessions that ship features / fixes / breaking changes

If session was pure docs / refactor / planning / WIP scaffolding: **skip CHANGELOG.md entirely**.

## File structure

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [1.0.0] — 2026-04-26

### Added
- ...

### Fixed
- ...

[Unreleased]: <git-compare-url-or-empty>
[1.0.0]: <git-tag-link-or-empty>
```

## Rules per change type

- **Added**: new features visible to user. NOT internal scaffolding.
- **Changed**: existing-feature behavior change. Mention if backwards-incompatible.
- **Deprecated**: soon-to-be-removed features. Include sunset date if known.
- **Removed**: features removed. **Always pair with Changed/Removed in major version.**
- **Fixed**: bug fixes that affect user experience.
- **Security**: vulnerabilities patched. Use `CVE-...` or `GHSA-...` if available.

## Workflow during session close

1. Open `CHANGELOG.md`.
2. Find `## [Unreleased]` block. Create at top after header if missing.
3. Under relevant subsection, append a line for each shipped change.
4. If session releases a version: rename `[Unreleased]` to `[X.Y.Z] — YYYY-MM-DD`, add fresh `[Unreleased]` block above it.
5. Update link references at bottom.

## Entry style

- Use imperative tense: "Add vault selector", not "Added vault selector"
- One change per bullet
- Reference issue/PR numbers if available: `Add vault selector (#42)`
- Be terse but specific: "Fix HTTP 500 on /sources under concurrent load"
- Don't repeat section heading: write `Add X`, not `Add: add X`
- **English** is the default for `CHANGELOG.md` (user-facing on GitHub)

## Sample fragment

```markdown
## [Unreleased]

### Added
- Vault Selector route with multi-vault grid and per-vault colorway
- ⌘K command palette with keyboard sequences (`g h`, `g s`, `g p`, …)
- Lint engine streaming SSE — 9 checks with health score

### Changed
- Replace 3D Vault Pulse Orb with static W-Sigil ideogram for performance

### Removed
- `@react-three/fiber`, `@react-three/drei`, `three`, `@paper-design/shaders-react` (~70MB)

### Fixed
- _(none yet — see HANDOFF.md for P0 backlog)_
```

## When to bump the version

The skill does NOT auto-bump. Decisions on version numbers are user choices:
- **patch** (X.Y.**Z**): only Fixed entries since last release
- **minor** (X.**Y**.0): Added or Changed entries (backwards-compatible)
- **major** (**X**.0.0): Removed entries or Changed with breaking notes

If user signals release ("tag v1.0", "publish 1.2.3"):
1. Rename `[Unreleased]` → `[X.Y.Z] — YYYY-MM-DD`
2. Update link references at bottom
3. Suggest `git tag -a vX.Y.Z -m "..."` (do not execute without confirmation)
