# WhoLeft App — Claude Code Guidelines

## Project Overview

**WhoLeft** is a React Native (Expo) app that helps users track Instagram followers and unfollowers by manually parsing their Instagram data export (ZIP file). The app calculates metrics like mutual followers, non-followers, unfollowers over time, and engagement insights — all processed locally on-device with no server-side data transfer.

---

## Tech Stack

- **Framework:** React Native + Expo SDK 54 (Expo Router v6)
- **Language:** TypeScript (strict mode)
- **Navigation:** Expo Router (file-based, `app/` directory)
- **State Management:** Zustand (all state — feature-local and cross-feature)
- **Styling:** StyleSheet API (no third-party styling libraries)
- **Charts:** react-native-gifted-charts
- **File Parsing:** JSZip + expo-document-picker + expo-file-system
- **Backend:** Firebase (optional, config lives in `config/`)

---

## Folder / File Structure

```
wholeft-app/
├── app/                          # Expo Router file-based navigation
│   ├── _layout.tsx               # Root layout (providers, fonts, splash)
│   ├── modal.tsx                 # Global modal screen
│   └── (tabs)/
│       ├── _layout.tsx           # Tab bar configuration
│       ├── index.tsx             # Home tab → renders HomepageUploadZip screen
│       ├── unfollowers.tsx       # Unfollowers tab screen
│       ├── analytics.tsx         # Analytics tab screen
│       └── settings.tsx          # Settings tab screen
│
├── src/
│   └── features/                 # Feature-based modules (one folder per domain)
│       └── homepage/             # Feature: data import & initial parsing
│           ├── index.ts          # Public barrel — only export what other features need
│           ├── homepageSlice.ts  # Redux slice for this feature (if cross-feature state needed)
│           ├── screen/           # Full screens owned by this feature
│           │   └── HomepageUploadZip.tsx
│           ├── components/       # Presentational components scoped to this feature
│           │   ├── GradientButton.tsx
│           │   ├── HomepageUploadCard.tsx
│           │   └── InstagramDataResults.tsx
│           ├── viewmodels/       # Business logic + UI state (MVVM pattern)
│           │   ├── index.ts
│           │   └── InstagramUploadViewModel.ts
│           ├── services/         # Data access, parsing, external calls
│           │   ├── index.ts
│           │   ├── InstagramDataService.ts
│           │   └── ZipParserService.ts
│           ├── store/            # Zustand store local to this feature
│           │   ├── index.ts
│           │   └── useInstagramDataStore.ts
│           └── entities/         # Plain TypeScript types/interfaces (no logic)
│               ├── index.ts
│               ├── Follower.ts
│               ├── Following.ts
│               └── InstagramData.ts
│
├── components/                   # Shared/global UI components (not feature-specific)
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── parallax-scroll-view.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── external-link.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.tsx
│       └── icon-symbol.ios.tsx
│
├── hooks/                        # Shared custom React hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── constants/                    # App-wide constants (theme tokens, magic values)
│   └── theme.ts
│
├── config/                       # Environment-specific config (never commit secrets)
│   ├── firebase.ts
│   ├── firebase.dev.json
│   └── firebase.prod.json
│
├── lib/                          # Third-party client initialisation (Firebase, etc.)
│   └── firebase.ts
│
├── assets/
│   └── images/
│
├── scripts/                      # Dev scripts (not shipped in the app bundle)
│   ├── reset-project.js
│   └── firebase-setup.sh
│
├── docs/                         # Project documentation and sample data
│   ├── app_structure.md
│   ├── homepage_instruction.md
│   ├── instagram_export_full_structure.md
│   └── insta_sample_export/      # Sample Instagram export for local dev/testing
│
├── app.json
├── tsconfig.json
├── eslint.config.js
├── package.json
└── CLAUDE.md                     # ← you are here
```

---

## Architecture: Feature-Based + Clean Architecture

Each feature under `src/features/<name>/` is self-contained and follows a layered structure. Dependencies only flow inward:

```
Screen / Component
      ↓
  ViewModel          (orchestrates UI state and calls services)
      ↓
   Service           (pure data logic — parsing, transformation)
      ↓
   Entity            (plain types, no logic)
```

### Layer responsibilities

| Layer | Responsibility | May import |
|---|---|---|
| `entities/` | TypeScript interfaces/types only. No logic, no React. | Nothing |
| `services/` | Data parsing, file I/O, API calls. Pure functions preferred. | `entities/` |
| `store/` | Zustand store holding UI and domain state for this feature. | `entities/` |
| `viewmodels/` | Bridges services and store; contains business logic. | `services/`, `store/`, `entities/` |
| `components/` | Presentational React Native components. Props-driven, no direct store access. | `entities/` (for prop types) |
| `screen/` | Composes components, subscribes to the store, calls the viewmodel. | Everything inside the feature |
| `index.ts` | Public API barrel. Only export what other features or `app/` need. | Feature internals |

### Cross-feature rules

- `app/` screens are thin wrappers — they import from a feature's `index.ts` barrel.
- Features must **never** import directly from another feature's internals. Use the barrel or lift shared code to `src/store/`, `components/`, or `hooks/`.
- For state that genuinely spans multiple features, lift it into a shared Zustand store under `src/features/<shared>/store/` or into the most relevant feature's store and export the selector.

---

## TypeScript Standards

- **Enable strict mode** — `"strict": true` in `tsconfig.json`. No exceptions.
- **No `any`** — use `unknown` + type guards or define proper types in `entities/`.
- **Explicit return types** on all public functions and class methods.
- **Interfaces for data shapes** (`interface Follower { ... }`); `type` aliases for unions/intersections.
- **Avoid type assertions** (`as Foo`) except at system boundaries (JSON parsing, library types). Always narrow with a type guard instead.
- **No non-null assertions** (`!`) — handle `null`/`undefined` explicitly.
- One type/interface per file inside `entities/`.

---

## React Native / Expo Best Practices

- **Functional components only** — no class components.
- **Custom hooks** for reusable stateful logic; never duplicate hook logic inline.
- **No inline styles** in JSX — always use `StyleSheet.create({})` defined at the bottom of the file.
- **Platform-specific files** use the `.ios.tsx` / `.web.ts` suffix pattern (see `icon-symbol.ios.tsx`).
- **Memoisation only when measured** — use `React.memo`, `useMemo`, `useCallback` only when a profiler shows a real perf problem.
- **Expo Router conventions** — all navigation happens via `router.push/replace` or `<Link>`. Never manage navigation state manually.
- **Avoid `useEffect` for derived state** — compute values inline or in the viewmodel.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files (components/screens) | PascalCase | `HomepageUploadCard.tsx` |
| Files (hooks) | kebab-case with `use-` prefix | `use-color-scheme.ts` |
| Files (services/stores/utils) | PascalCase | `ZipParserService.ts` |
| React components | PascalCase | `HomepageUploadCard` |
| Custom hooks | camelCase with `use` prefix | `useInstagramDataStore` |
| Variables / functions | camelCase | `parseFollowers` |
| TypeScript interfaces | PascalCase | `InstagramData` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE_MB` |
| Feature folders | lowercase | `homepage/`, `analytics/` |

---

## State Management Rules

- **Zustand only** — no Redux. One store per feature, located in `features/<name>/store/`.
- Selectors are plain functions: `(state: StoreState) => state.field`.
- Never call store setters inside `render` — only in event handlers or viewmodel methods.
- Avoid storing derived data in state; compute it with selectors or in-render memos.

---

## Code Style Rules

- **No default exports** except for Expo Router screens (required by the framework).
- **Barrel files (`index.ts`)** export only the public surface of a feature or layer.
- **No magic strings/numbers** — define them as typed constants.
- **Error handling** — always type caught errors as `unknown`, narrow before use:
  ```ts
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
  }
  ```
- **No `console.log` in committed code** — use a structured logger wrapper or remove before committing.
- **Short files** — if a file exceeds ~200 lines, consider splitting responsibilities.

---

## Adding a New Feature

1. Create `src/features/<feature-name>/` with the layer sub-folders.
2. Define entities first (`entities/`), then services, then the store, then the viewmodel, then components/screen.
3. Add the public barrel `index.ts` — export only what `app/` or other features need.
4. If the feature needs a tab, add it under `app/(tabs)/` as a thin screen that imports from the barrel.
5. If cross-feature state is needed, export its selector from the owning feature's store barrel.

---

## What to Avoid

- Do not put business logic in screen or component files.
- Do not import from a feature's internals from outside that feature.
- Do not use Firebase for local-only operations — the app must work fully offline.
- Do not store sensitive user data in Firebase without explicit consent flow.
- Do not add new `dependencies` without checking if an existing Expo SDK package covers the need.
