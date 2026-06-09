#!/usr/bin/env python3
"""
Best-effort auto-update of UK TV channels for the knockout stage.

Channels are not in the fixtures feed, so this scrapes a UK TV-guide page
(live-footballontv.com) and fills in the broadcaster for each knockout match
once it's announced (the page shows "TBC" until then). Results are written to
channels.json keyed by match number; generate_ics.py prefers that over its
built-in (hand-verified) group-stage map.

Safety:
- Only knockout matches (round >= 4) are touched; the verified group-stage map
  in generate_ics.py is never overridden.
- A scraped channel is only used when it matches a known TV channel and maps to
  exactly one knockout match by UK kick-off date+time (no ambiguity).
- On any fetch/parse problem the existing channels.json is left untouched.
"""

import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

URL = "https://www.live-footballontv.com/live-world-cup-football-on-tv.html"
HERE = os.path.dirname(__file__)
FIXTURES = os.path.join(HERE, "fixtures.json")
OUT = os.path.join(HERE, "channels.json")
UK = ZoneInfo("Europe/London")

VALID = {"BBC One", "BBC Two", "BBC Three", "BBC Four", "ITV1", "ITV4"}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", "replace")


def parse_date(text):
    # "Thursday 11th June 2026" -> date
    cleaned = re.sub(r"(\d+)(st|nd|rd|th)", r"\1", text).strip()
    return datetime.strptime(cleaned, "%A %d %B %Y").date()


def parse_channels(html):
    """Return {(iso_date, 'HH:MM'): channel}; ambiguous slots map to None."""
    blocks = re.split(r'<div class="fixture-date">(.*?)</div>', html)
    slots = {}
    fixture_re = re.compile(
        r'<div class="fixture__time">(.*?)</div>.*?'
        r'<div class="fixture__channel">(.*?)</div>', re.S)
    pill_re = re.compile(r'channel-pill[^>]*>([^<]+)<')
    # blocks = [pre, date1, body1, date2, body2, ...]
    for i in range(1, len(blocks) - 1, 2):
        try:
            d = parse_date(blocks[i])
        except ValueError:
            continue
        for time_txt, chan_html in fixture_re.findall(blocks[i + 1]):
            time = time_txt.strip()
            if not re.fullmatch(r"\d{2}:\d{2}", time):
                continue
            pills = pill_re.findall(chan_html)
            channel = next((p.strip() for p in pills if p.strip() in VALID), None)
            key = (d.isoformat(), time)
            if key in slots and slots[key] != channel:
                slots[key] = None  # ambiguous (e.g. simultaneous games)
            else:
                slots[key] = channel
    return slots


def main():
    try:
        with open(FIXTURES, encoding="utf-8") as f:
            fixtures = json.load(f)
    except OSError as exc:
        print(f"WARN: cannot read fixtures.json ({exc})", file=sys.stderr)
        return 0

    try:
        slots = parse_channels(fetch(URL))
    except Exception as exc:  # noqa: BLE001 - best effort
        print(f"WARN: channel scrape failed ({exc}); keeping channels.json",
              file=sys.stderr)
        return 0

    existing = {}
    if os.path.exists(OUT):
        with open(OUT, encoding="utf-8") as f:
            existing = json.load(f)

    found = {}
    for m in fixtures:
        if m["RoundNumber"] < 4:
            continue  # knockout only
        ko = datetime.strptime(m["DateUtc"][:19], "%Y-%m-%d %H:%M:%S").replace(
            tzinfo=timezone.utc).astimezone(UK)
        ch = slots.get((ko.date().isoformat(), ko.strftime("%H:%M")))
        if ch in VALID:
            found[str(m["MatchNumber"])] = ch

    merged = {**existing, **found}
    if merged != existing:
        with open(OUT, "w", encoding="utf-8") as f:
            json.dump(merged, f, indent=1, sort_keys=True)
        print(f"Wrote {OUT}: {len(found)} knockout channel(s) resolved.")
    else:
        print(f"No knockout channel changes ({len(found)} resolved).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
