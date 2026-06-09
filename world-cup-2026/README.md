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

## Subscribe (recommended — knockout teams fill in automatically)

Subscribe to this URL so your calendar re-polls it and picks up team names /
channel updates:

```
https://raw.githubusercontent.com/mrtomkeddie/claimease/master/world-cup-2026/world-cup-2026-uk.ics
```

- **Apple Calendar:** File → New Calendar Subscription → paste the URL. Set
  "Auto-refresh" to Every day (or hourly).
- **Google Calendar:** Other calendars → **+** → From URL → paste the URL.
  (Google refreshes subscribed URLs roughly daily.)
- **Outlook:** Add calendar → Subscribe from web → paste the URL.

> Tip: on iPhone/Mac you can swap `https://` for `webcal://` to open the
> subscription dialog directly.

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
