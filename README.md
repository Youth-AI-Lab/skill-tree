# YouthAI Lab — Skill Tree POC

Interactive AI Skill Tree prototype for the YouthAI Lab program.

## Live site
**https://youth-ai-lab.github.io/skill-tree/** (deployed via GitHub Pages)

## How to use
Just open the live URL above. To preview locally with live progress data, run
a small static server from this folder (because `fetch('progress.json')` does
not work over `file://`):

```
python3 -m http.server 8000
```

then open http://localhost:8000. Opening `index.html` directly still works, but
falls back to the inline snapshot of lab progress baked into the page.

## Updating lab progress (the part that matters)

Each lab's real progress is stored in **`progress.json`**, keyed by a slug
derived from the English skill title. The page fetches this file at boot and
overrides the inline defaults.

Edit `progress.json`, commit, push — GitHub Pages re-deploys in about a minute.

Status values per lab:
- `"done"` — skill validated
- `"in-progress"` — currently being explored
- `null` — not started yet

Lab IDs:
- `"1"` — France
- `"2"` — Belgium
- `"3"` — Catalonia
- `"4"` — Italy

Example: mark the Catalonia lab as having validated "Master the Prompt":

```json
"master-the-prompt": { "1": null, "2": null, "3": "done", "4": null }
```

And bump `lastUpdated` to the date of your edit so the header badge stays
accurate:

```json
"lastUpdated": "2026-05-28"
```

Each lab's percentage and "currently at bench" line are computed automatically
from the `done` statuses — there is nothing to edit by hand for those.

### Lab journal (recent activity)

The sidebar "Recent activity" feed is driven by the `journal` array in
`progress.json`, most recent first. Each entry:

```json
{ "team": 4, "skill": "bias-hunters", "status": "done", "note": "BIAS: Genre Matters" }
```

- `team` — lab id (1-4)
- `skill` — the skill slug (same keys as in `skills`)
- `status` — `"done"` ("validated") or `"in-progress"` ("started")
- `note` — free text shown under the entry (session name and/or date)

Add a line at the top after each session. There is no need to remove old ones:
the sidebar journal is capped to the height of the card next to it and scrolls,
and the whole log stays reachable through the "Open the full journal" button.

## What's inside
- **`index.html`** — the prototype (single self-contained HTML/JS/CSS file)
- **`progress.json`** — live status of each lab against each of the 68 skills
- **`source/AI-Skill-Tree-source.md`** — original DigComp 3.0 source from which the 68 skills are drawn
- **`cornicello.svg`** — the lucky-charm icon, kept as a standalone file and referenced by the page
- **`eu_co-funded.png`** + **`eu_co-funded_fr.png`** — EU funding logo, English and French versions

The printable French lab-bench sheets that used to live here have moved to the
deliverables repository, under `Paillasses/FR/`.

## Features
- 6 worlds mapped to the YouthAI Lab 6-phase approach (Observe → Hypothesize → Build → Deploy → Reflect → Share)
- 68 DigComp 3.0 competencies as quests
- 4 teams (France, Belgium, Catalonia, Italy)
- 5 languages: EN, FR, NL, IT, CA
