# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A live animated ASCII aquarium rendered in a VS Code webview — a TypeScript port of [asciiquarium](https://robobunny.com/projects/asciiquarium/) (Perl, Term::Animation) by Kirk Baucom. GPL-2.0-only.

## Commands

```bash
npm install              # deps
npm run build            # build:ext (tsc → out/) + build:web (esbuild → media/main.js)
npm run build:ext        # extension host only: tsc -p ./  → out/
npm run build:web        # webview bundle only: esbuild  → media/main.js
npm run watch            # tsc -watch for the extension host
npm test                 # vitest run (all tests in test/)
npx vitest run test/aquarium.test.ts          # single test file
npx vitest run -t "name of test"              # single test by name
npx tsc -p ./ --noEmit   # type-check without emitting
```

Run the extension: open this folder in VS Code, press **F5** (Run Extension) → Extension Development Host. Toggle via the **🐟 Aquarium** status-bar item or the `ASCII Aquarium: Toggle` command.

## Architecture

Two compile targets, two `tsconfig`-free build paths. **Do not import `vscode` outside `src/extension.ts`, `src/panel.ts`, `src/view.ts`, `src/webviewHtml.ts`** — the engine/aquarium/webview code must stay bundleable for the browser.

- **`src/engine/`** — generic Term::Animation-style engine, zero aquarium knowledge. `Animation` (the `World`) holds entities, runs `tick(dt)` then `paint(grid)`. `Grid` is a char+colorcode buffer with a `blit()` that honors transparency. `EntitySpec`/`Entity` in `types.ts` are the core model: each entity has frames, an optional per-tick `callback` returning `{dx,dy,frame}`, and death conditions (`dieTime`, `dieFrame`, `dieOffscreen`). `color.ts` maps single-char mask codes → CSS.
- **`src/aquarium/`** — content on top of the engine. `Aquarium` (`aquarium.ts`) builds the world (waterline, castle, seaweed, fish) and owns the **event scheduler**: a countdown `gap`; when it hits zero *and no `type==="event"` entity is alive*, it spawns one random creature. `events/index.ts` holds `EVENT_FACTORIES` (shark, whale, ship, bigFish, monster) — register new events there; `enabledEvents` config filters which can spawn.
- **`src/webview/main.ts`** — the browser entry, bundled by esbuild into `media/main.js`. Runs the rAF loop with a **fixed timestep accumulator** (`step = 1/fps`), renders the Grid into `<pre>` HTML by run-length-grouping color spans, and handles click-to-feed + toolbar buttons.
- **Extension host** — `extension.ts` registers the status bar item, the toggle command, and the sidebar `WebviewViewProvider`. `panel.ts` (`AquariumPanel`) and `view.ts` (`AquariumViewProvider`) are the two webview hosts; both share `webviewHtml.ts` for HTML assembly (`media/index.html` with `__SCRIPT__`/`__STYLE__`/`__CSPSOURCE__` placeholders) and `postConfig()`.

### Entity rendering model

- A frame is a multi-line string; `frameDims` derives width/height. A `mask` (same layout) colors it; blank mask cell → entity's `defaultColor`.
- Z-order: `paint()` sorts **descending z, lower z = nearer front** (drawn last).
- Transparency: `transparentChar` (default `"?"`, matching the Perl original) plus `autoTrans` (leading whitespace on each line is transparent). Spaces *inside* a sprite are opaque only if `autoTrans` already saw a non-space on that line.
- `physical` entities get O(n²) pairwise overlap checks each tick → `collisionCb`.

### Config message protocol

Host → webview is one `{cmd:"config", fps, feedEnabled, enabledEvents}` message (`postConfig`); the webview also accepts `pause`/`speed`/`restart`. Config keys live under the `asciiAquarium.*` namespace in `package.json` (`targetFps`, `enabledEvents`, `feedEnabled`).

## Resilience constraints (don't regress these)

The animation runs in a rAF loop — an uncaught throw kills it permanently and freezes the whole aquarium. Two guards exist for this reason and prior bugs were caused by their absence:

- `main.ts` `loop()` wraps `aq.update()`/`render()` in try/catch and clamps `dt` to `0.25s` (a backgrounded tab must not dump a catch-up burst into the accumulator).
- `entity.ts` mask size mismatches **warn, never throw** — an oversized color mask is harmless at blit time, so it must not crash the loop.

When porting sprites from the Perl original, preserve `?` as the transparent char and keep mask/frame line counts aligned.
