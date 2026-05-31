# ASCII Aquarium

A live animated ASCII aquarium rendered in a VS Code webview panel and Explorer sidebar. Fish swim, bubbles rise, seaweed sways, and random creatures visit — click anywhere to drop food and watch the fish chase it.

> **Based on [asciiquarium](https://robobunny.com/projects/asciiquarium/) by Kirk Baucom** — the original Perl/Term::Animation program. This is a TypeScript port for VS Code, faithful to the original's spirit (sprites, transparency, the random-event scheduler) while adding interactive click-to-feed. Original asciiquarium is licensed GPL-2.0; this port keeps the same license.

---

## Features

- **Fish** — 12 species with randomized ANSI colors, swimming left and right.
- **Bubbles** — rise from the sea floor in columns.
- **Seaweed** — sways persistently on the tank bottom, respawning so the tank never goes bare.
- **Castle** — a decorative landmark on the sea floor.
- **Random creatures** — five special visitors appear on random intervals: shark, whale, ship, big fish, and a deep-lurking monster.
- **Click-to-feed** — click in the tank to drop food; nearby fish chase and eat it.
- **Toolbar controls** — pause/resume, speed up/slow down, restart.
- **Status bar toggle** — a persistent **🐟 Aquarium** item opens or closes the panel with one click.
- **Sidebar view** — also docks as a WebviewView in the Explorer.

---

## Running from Source

### Prerequisites

- Node.js 18+
- VS Code 1.85+

### Install & build

```bash
cd vscode-extension
npm install
npm run build          # compile extension host (tsc) + bundle webview (esbuild)
```

### Launch in the Extension Development Host

1. Open the `vscode-extension` folder in VS Code.
2. Press **F5** (or *Run and Debug* → **Run Extension**).
3. In the new window, click **🐟 Aquarium** in the status bar, or run **ASCII Aquarium: Toggle** from the Command Palette.

---

## Build & Test

```bash
npm run build          # build:ext (tsc → out/) + build:web (esbuild → media/main.js)
npm test               # vitest
npx tsc -p ./ --noEmit # type-check only
```

---

## Configuration

All settings live under the `asciiAquarium` namespace.

| Key | Default | Description |
|-----|---------|-------------|
| `asciiAquarium.targetFps` | `16` | Target render frames per second (4–60). |
| `asciiAquarium.enabledEvents` | `["shark","whale","ship","bigFish","monster"]` | Which random-event creatures can appear. Remove entries to disable specific creatures. |
| `asciiAquarium.feedEnabled` | `true` | Enable click-to-feed. When `false`, clicks have no effect. |

---

## Architecture

- **`src/engine/`** — generic Term::Animation-style engine: entity model, grid buffer, blit renderer, animation world, color utilities, and the random-event scheduler. No aquarium-specific knowledge.
- **`src/aquarium/`** — content on top of the engine: fish, seaweed, bubbles, castle, food, and the five random-event modules.
- **`src/webview/`** — webview entry point, bundled by [esbuild](https://esbuild.github.io/) into `media/main.js`.
- **`src/extension.ts`, `src/panel.ts`, `src/view.ts`** — VS Code host: command registration, status bar item, panel and sidebar webview lifecycle.

---

## License

GPL-2.0-only — see [LICENSE](LICENSE).

Original [asciiquarium](https://robobunny.com/projects/asciiquarium/) © Kirk Baucom, licensed under GPL-2.0. This VS Code port is a derivative work distributed under the same terms.
