# CLAUDE.md

Custom Lovelace cards for Home Assistant. Each one packs several entities of a single
device (or a single meaning) into one tile.

## The main rule

**Reuse Home Assistant's own components instead of reimplementing their markup.** A tile
is built out of `ha-tile-container`, `ha-tile-icon`, `ha-tile-info`, `hui-card-features`,
`ha-ripple`, `state-display`; the editors out of `ha-form`, `hui-card-features-editor`,
`ha-expansion-panel`. Write only what Home Assistant genuinely does not have.

A private copy of someone else's markup falls behind the original and loses what the
components already carry: ripple, gesture recognition, the focus ring, stock features.
Rewriting one card onto HA components deleted ~175 lines of our own code together with a
whole class of bugs that had settled in them.

Those components are not exported, but they do get registered once HA loads the stock
tile's bundle. That is what `core/ha-internals.ts` triggers: `window.loadCardHelpers()` →
`createCardElement({type: "tile"})` for the import side effect, then
`customElements.whenDefined`.

The second rule: **a card is not a generic builder**. The config says which entity plays
which role (`temperature`, `battery`, `cartridges`), and the card picks the layout
itself. No guessing entities by name or device_class — a human assigns the roles.

The one bounded exception is `core/suggest.ts`: what a card offers in HA's "Add card →
By entity" dialog. That is a draft the user sees rendered and edits before adding, and
it is built only from objective facts — domain, `device_class`, entity attributes,
membership of one device. Never from names. A card suggests itself only when it would
say more than the stock tile.

## Commands

```sh
cd cards
npm run dev     # http://<this-host>:5188, for editing against a live HA
npm test        # vitest, logic in node + markup in happy-dom
npm run build   # tsc --noEmit && vite build → ../dist/ha-plugins-cards.js
../script/publish.py   # build + upload to the HA host + update the dashboard resource
```

## Layout

- `cards/src/cards/*-tile.ts` — the cards, one per file; each extends `BaseTileCard`,
  declares its own `*Config` and ends with a `registerCard` call.
- `cards/src/editors/*-tile-editor.ts` — the visual editors, all built on
  `FormCardEditor`/`BaseCardEditor` from `base-editor.ts`.
- `cards/src/core/` — the shared parts: tile assembly (`base-tile-card.ts`), level rows
  (`levels.ts`), role formatting (`format.ts`), state colours (`state-color.ts`), actions
  (`actions.ts`), dictionaries (`i18n.ts`), registration (`register.ts`).
- `cards/src/main.ts` — the entry point, imports everything.
- `dist/ha-plugins-cards.js` — **committed on purpose**: HACS installs the plugin straight
  from the repository. Rebuild and commit it after changes.
- `docs/images/` — screenshots for the README.
- `docs/superpowers/specs/2026-09-04-ha-tile-cards-design.md` — the spec: decisions, why
  they were made, and what is missing compared to the stock tile.
- `frontend/` — a clone of home-assistant/frontend, kept purely as a reference for markup
  and design tokens. Not part of the project, not committed.

## Conventions

- Comments are in English and explain **why**, not what. Interface strings go through
  `t()` from `i18n.ts`, and both locales (en/ru) are filled in at once, plural forms
  included.
- Colours and sizes only through HA design tokens with a fallback:
  `var(--ha-font-size-m, 14px)`. Don't invent pixel numbers.
- A new card means card + editor + a row in the README + a screenshot, plus a
  `suggest` rule when the entity it starts from can be recognised objectively.
- The shared config fields (`name`, `icon`, `state_content`, `features`, the six actions)
  live in `TileBaseConfig`; a subclass's `setConfig` must put them into `this.base`.

## Checking the result

Look at your own work before calling it done: run `npm run dev`, open the dashboard and
take a screenshot over CDP. Markup changes without a screenshot don't count as verified —
that is how nearly every defect in this project was caught (unreadable levels, ink
invisible on a dark theme, a grey ripple, a tap target missed by a few pixels).

Rakes already stepped on:

- A dashboard served from the dev server has to be opened over **http**, otherwise the
  browser blocks the http module as mixed content.
- Reloading means F5 only: a registered custom element cannot be redefined, which is why
  HMR is disabled in `vite.config.ts`.
- The resource URL in the dashboard must carry a version (`?v=<hash>`), otherwise HA keeps
  serving the cached old bundle and the update passes unnoticed.
- Scripts that touch the dashboard config must **merge** into it, never overwrite: it
  contains edits made by hand in the GUI.
- The build must run with `NODE_ENV=production` (the npm script sets it): the user's shell
  exports `development`, and Lit then ships its dev build — the bundle silently grows by a
  third.
- README screenshots are shot from the `cards-lab` dashboard, which is in English: labels
  come from its config, not from overrides in the shooting script. Overrides that lived
  only inside a script drifted from what was committed once already — `light.png` stayed
  Russian for a whole release.
- README screenshots must not contain addresses, faces or names of real people — the
  person card is anonymised before the shot (`show_entity_picture: false`, no `location`),
  the media title is replaced, and the computer card drops `current_users`. Those four are
  the only runtime overrides left.
- The picture at the top of the README comes from the lab's own `Hero` section: nine
  cards, half a section wide each, in a known order, so the shot can be repeated.
