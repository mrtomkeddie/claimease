#!/usr/bin/env python3
"""
Fetch the live 2026 World Cup fixtures/results feed and cache it as fixtures.json.

Source: fixturedownload.com (free, no auth). It returns all 104 matches keyed by
MatchNumber with UTC kick-off times, and progressively replaces knockout
placeholders (e.g. "2A", "To be announced") with real team names + scores as the
tournament unfolds.

Best-effort: if the fetch fails, the existing fixtures.json is left untouched so
the calendar can still be regenerated from the last good snapshot.
"""

import json
import os
import sys
import urllib.request

FEED_URL = "https://fixturedownload.com/feed/json/fifa-world-cup-2026"
OUT = os.path.join(os.path.dirname(__file__), "fixtures.json")


def main():
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:  # noqa: BLE001 - best effort, keep old snapshot
        print(f"WARN: feed fetch failed ({exc}); keeping existing fixtures.json",
              file=sys.stderr)
        return 0

    if not isinstance(data, list) or len(data) != 104:
        print(f"WARN: unexpected feed shape ({type(data).__name__}, "
              f"{len(data) if isinstance(data, list) else 'n/a'} items); "
              f"keeping existing fixtures.json", file=sys.stderr)
        return 0

    data.sort(key=lambda m: m["MatchNumber"])
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
    print(f"Wrote {OUT} ({len(data)} matches).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
