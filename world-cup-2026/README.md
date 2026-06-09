# World Cup 2026 — UK Calendar (iCal)

An auto-updating iCalendar of every 2026 FIFA World Cup match (USA / Canada /
Mexico, 11 Jun – 19 Jul 2026) with **UK kick-off times** and the **UK TV
channel** for each game.

- **File:** [`world-cup-2026-uk.ics`](./world-cup-2026-uk.ics) — 104 matches
  (72 group + 32 knockout).
- **Times:** stored as UTC, so any calendar app shows the correct UK/local time.
- **Channels:** BBC / ITV share all 104 matches free-to-air. All 72 group-stage
  games have a confirmed channel (BBC One/Two, ITV1/ITV4); knockout games show
  `BBC / ITV (TBC)` and **auto-fill** once the broadcasters announce their picks
  (scraped from a UK TV guide — see `update_channels.py`).
- **Reminders:** 30-minute pop-up alarm on each match.
- **Knockouts auto-update:** placeholders (`Winner Group E`, `Winner M74`) are
  replaced with the real teams as results come in — **if you subscribe** (below).

## Subscribe

**Easiest — share this page** (one-tap subscribe + per-app instructions):

```
https://mrtomkeddie.github.io/WorldCupCalendar/
```

The page (in [`docs/`](../docs/)) is the friendly, public-shareable link. It's
served by GitHub Pages as proper `text/calendar`, which avoids the "Insecure
Connection" failure some apps (including Apple Calendar's in-app *Add
Subscription* box) hit with the raw GitHub URL.

**One-time setup:** repo **Settings → Pages → Source: Deploy from a branch →
`master` / `/docs`**. After it builds, the page and the feed below go live.

**Direct subscription URLs** (both auto-update):

```
https://mrtomkeddie.github.io/WorldCupCalendar/world-cup-2026-uk.ics   (Pages — preferred)
https://raw.githubusercontent.com/mrtomkeddie/WorldCupCalendar/master/world-cup-2026/world-cup-2026-uk.ics   (raw fallback)
```

- **iPhone/iPad:** Settings → Calendar → Accounts → Add Account → Other → Add
  Subscribed Calendar → paste the URL. (This path is more reliable than the
  Calendar app's own *Add Subscription Calendar* box.)
- **Google Calendar:** Other calendars → **+** → From URL → paste the URL.
  (Refreshes roughly daily.)
- **Outlook:** Add calendar → Subscribe from web → paste the URL.

> Tip: swapping `https://` for `webcal://` opens the subscribe dialog directly
> on iPhone/Mac — this is what the landing page's button does.

## Import instead (one-off snapshot — will NOT update)

If you just want today's snapshot and don't care about live knockout names,
import the file: Apple Calendar / Google Calendar / Outlook → Import → choose
`world-cup-2026-uk.ics`.

## How the auto-update works

1. [`update_feed.py`](./update_feed.py) fetches the live fixtures/results feed
   (fixturedownload.com — free, no auth, UTC times, keyed by match number) and
   caches it as [`fixtures.json`](./fixtures.json). The feed swaps knockout
   placeholders for real teams as the tournament progresses.
2. [`update_channels.py`](./update_channels.py) scrapes a UK TV guide for
   knockout broadcaster announcements and caches them in
   [`channels.json`](./channels.json). Best-effort and additive: it only fills
   knockout matches it can match unambiguously, and never overrides the verified
   group-stage map.
3. [`generate_ics.py`](./generate_ics.py) builds the `.ics` from those snapshots,
   adding UK channels (knockout from `channels.json`, group from its built-in
   map), flags, kick-off times, live scores and readable bracket labels.
4. [`.github/workflows/world-cup-2026-ical.yml`](../.github/workflows/world-cup-2026-ical.yml)
   runs all three every 3 hours and commits the refreshed files, so the
   subscribed URL always serves the latest.

Rebuild locally any time:

```bash
python3 update_feed.py      # refresh fixtures.json from the live feed
python3 update_channels.py  # refresh knockout channels into channels.json
python3 generate_ics.py     # rebuild world-cup-2026-uk.ics
```

Sources: fixturedownload.com (fixtures/results), BBC/ITV broadcast info, and
Wikipedia for the knockout bracket structure.
