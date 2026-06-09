# World Cup 2026 — UK Calendar (iCal)

An iCalendar (`.ics`) file of every 2026 FIFA World Cup match (USA / Canada /
Mexico, 11 Jun – 19 Jul 2026) with **UK kick-off times** and the **UK TV
channel** for each game.

- **File:** [`world-cup-2026-uk.ics`](./world-cup-2026-uk.ics)
- **104 matches:** 72 group-stage + 32 knockout.
- **Times:** entered in UK time (BST) and stored as UTC, so any calendar app
  shows the correct local time automatically.
- **Channels:** BBC / ITV share all 104 matches free-to-air. Confirmed
  allocations (e.g. England v Croatia → ITV1, England v Ghana → BBC One) are
  named; the rest show `BBC / ITV (TBC)` until each broadcaster picks its games.
- **Reminders:** each match has a 30-minute pop-up alarm.

## How to add it to your calendar

**Import (one-off snapshot):**
- **Apple Calendar:** File → Import → choose the `.ics`.
- **Google Calendar:** Settings → Import & export → Import → choose the `.ics`.
- **Outlook:** File → Open & Export → Import → iCalendar file.

## Knockout stage & team names

Group-stage events list the real teams. Knockout events use the official
bracket's qualification slots until results are in, e.g.:

- `Round of 32: Runner-up A v Runner-up B`
- `Round of 16: Winner M73 v Winner M75`
- `Final: Winner M101 v Winner M102`

An **imported** `.ics` is a static snapshot — it will **not** fill in real team
names by itself. To get auto-updating names you must **subscribe** to a hosted
feed URL that is regenerated as results come in (see below).

## Regenerating / auto-updating

The bracket logic (which match's winner feeds which later slot) is already
encoded in [`generate_ics.py`](./generate_ics.py). To rebuild the file:

```bash
python3 generate_ics.py
```

To make knockout names update automatically you need two things:
1. **Host the `.ics` at a stable URL** and subscribe to it (webcal/https), so
   calendars re-poll it (apps refresh every few hours to daily).
2. **A results data source** to feed the generator results, which the encoded
   bracket then resolves into real team names — run on a schedule (e.g. a
   GitHub Action) that commits the refreshed file.

Data sources used to build the fixtures: BBC/ITV broadcast info, Sky Sports
fixture breakdown, and Wikipedia group/knockout pages.
