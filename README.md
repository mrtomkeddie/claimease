# World Cup 2026 — UK Calendar 🏆⚽

A free, auto-updating calendar of every **2026 FIFA World Cup** match (USA /
Canada / Mexico, 11 Jun – 19 Jul 2026) with **UK kick-off times** and the
**BBC/ITV channel** for each game.

## ⭐ Subscribe

**Share / open this page** for one-tap subscribe + instructions:

```
https://mrtomkeddie.github.io/WorldCupCalendar/
```

**Or subscribe directly to the feed** (auto-updates):

```
https://mrtomkeddie.github.io/WorldCupCalendar/world-cup-2026-uk.ics
```

> On iPhone/iPad, the most reliable way to add it is **Settings → Calendar →
> Accounts → Add Account → Other → Add Subscribed Calendar**, then paste the
> link. (The Calendar app's own "Add Subscription" box can fail with an
> "Insecure Connection" error — the landing page's button avoids that.)

## What's in it

- 📅 All **104 matches**, with **UK kick-off times** (shown in your local zone).
- 📺 **BBC One/Two, ITV1/ITV4** per match — all 72 group games confirmed;
  knockout fills in automatically once the broadcasters announce.
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Country **flags** next to every team.
- 🔄 Knockout **teams and final scores update automatically** as the tournament
  unfolds (for subscribers — re-poll, don't import).
- ⏰ A **30-minute reminder** before each kick-off.
- Clean titles (just the teams); group, kick-off, channel, venue and result in
  the notes.

## How it stays up to date

Everything lives in [`world-cup-2026/`](./world-cup-2026/) and is rebuilt every
3 hours by a GitHub Action ([`.github/workflows/world-cup-2026-ical.yml`](./.github/workflows/world-cup-2026-ical.yml)):

1. `update_feed.py` — pulls live fixtures/results (UTC, keyed by match number).
2. `update_channels.py` — scrapes knockout BBC/ITV channels once announced.
3. `generate_ics.py` — builds `world-cup-2026-uk.ics` (also copied into
   [`docs/`](./docs/) for the GitHub Pages site).

See [`world-cup-2026/README.md`](./world-cup-2026/README.md) for the full
details and local rebuild steps.

## Hosting

The landing page and feed are served by **GitHub Pages** from the `/docs` folder
on the default branch (Settings → Pages → Deploy from a branch → `/docs`).
