#!/usr/bin/env python3
"""
Generate an iCalendar (.ics) for the 2026 FIFA World Cup with UK kick-off times
and UK TV channels, from the cached fixtures.json snapshot.

Why feed-driven: fixtures.json comes from a live source (see update_feed.py) that
swaps knockout placeholders for real team names as results come in. So if you
*subscribe* to the regenerated .ics (rather than importing it once), the
knockout fixtures auto-update with the actual teams.

- Times: the feed's DateUtc is already UTC, written straight into DTSTART (Z),
  so any calendar shows the correct UK/local time.
- Channels: BBC/ITV share all 104 matches free-to-air. Confirmed allocations are
  mapped by match number; the rest show "BBC / ITV (TBC)".
- Placeholders: round-of-32 codes (1A, 2B, 3ABCDF) and later "To be announced"
  slots are rendered as readable labels (e.g. "Winner Group E", "Winner M74")
  until the feed provides real teams.
"""

import json
import os
import re
from datetime import datetime, timedelta

HERE = os.path.dirname(__file__)
FIXTURES = os.path.join(HERE, "fixtures.json")
OUT = os.path.join(HERE, "world-cup-2026-uk.ics")

STAMP = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
MATCH_MINUTES = 120

# Confirmed UK broadcaster by match number (others -> "BBC / ITV (TBC)").
CHANNELS = {
    1: "ITV1",      # Mexico v South Africa
    3: "BBC One",   # Canada v Bosnia & Herzegovina
    8: "ITV1",      # Qatar v Switzerland
    7: "BBC",       # Brazil v Morocco
    5: "BBC",       # Haiti v Scotland
    10: "ITV1",     # Germany v Curacao
    11: "ITV1",     # Netherlands v Japan
    16: "BBC One",  # Belgium v Egypt
    17: "BBC One",  # France v Senegal
    22: "ITV1",     # England v Croatia
    32: "BBC One",  # USA v Australia
    30: "ITV1",     # Scotland v Morocco
    35: "BBC One",  # Netherlands v Sweden
    33: "ITV1",     # Germany v Ivory Coast
    45: "BBC One",  # England v Ghana
    49: "BBC",      # Scotland v Brazil
    67: "ITV1",     # Panama v England
}

ROUND_NAME = {
    4: "Round of 32",
    5: "Round of 16",
    6: "Quarter-final",
    7: "Semi-final",
}

# Flag emoji per team, keyed by the feed's exact team names.
FLAGS = {
    "Algeria": "🇩🇿", "Argentina": "🇦🇷", "Australia": "🇦🇺", "Austria": "🇦🇹",
    "Belgium": "🇧🇪", "Bosnia and Herzegovina": "🇧🇦", "Brazil": "🇧🇷",
    "Cabo Verde": "🇨🇻", "Canada": "🇨🇦", "Colombia": "🇨🇴", "Congo DR": "🇨🇩",
    "Croatia": "🇭🇷", "Curaçao": "🇨🇼", "Czechia": "🇨🇿", "Côte d'Ivoire": "🇨🇮",
    "Ecuador": "🇪🇨", "Egypt": "🇪🇬", "England": "🏴\U000e0067\U000e0062\U000e0065\U000e006e\U000e0067\U000e007f",
    "France": "🇫🇷", "Germany": "🇩🇪", "Ghana": "🇬🇭", "Haiti": "🇭🇹",
    "IR Iran": "🇮🇷", "Iraq": "🇮🇶", "Japan": "🇯🇵", "Jordan": "🇯🇴",
    "Korea Republic": "🇰🇷", "Mexico": "🇲🇽", "Morocco": "🇲🇦", "Netherlands": "🇳🇱",
    "New Zealand": "🇳🇿", "Norway": "🇳🇴", "Panama": "🇵🇦", "Paraguay": "🇵🇾",
    "Portugal": "🇵🇹", "Qatar": "🇶🇦", "Saudi Arabia": "🇸🇦",
    "Scotland": "🏴\U000e0067\U000e0062\U000e0073\U000e0063\U000e0074\U000e007f",
    "Senegal": "🇸🇳", "South Africa": "🇿🇦", "Spain": "🇪🇸", "Sweden": "🇸🇪",
    "Switzerland": "🇨🇭", "Tunisia": "🇹🇳", "Türkiye": "🇹🇷", "USA": "🇺🇸",
    "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿",
}


def with_flag(name):
    flag = FLAGS.get(name)
    return f"{flag} {name}" if flag else name

# Readable labels for slots the feed lists as "To be announced" (R16 onward).
# Sourced from the official bracket (which earlier match feeds which slot).
BRACKET_LABELS = {
    89: ("Winner M74", "Winner M77"), 90: ("Winner M73", "Winner M75"),
    91: ("Winner M76", "Winner M78"), 92: ("Winner M79", "Winner M80"),
    93: ("Winner M83", "Winner M84"), 94: ("Winner M81", "Winner M82"),
    95: ("Winner M86", "Winner M88"), 96: ("Winner M85", "Winner M87"),
    97: ("Winner M89", "Winner M90"), 98: ("Winner M93", "Winner M94"),
    99: ("Winner M91", "Winner M92"), 100: ("Winner M95", "Winner M96"),
    101: ("Winner M97", "Winner M99"), 102: ("Winner M98", "Winner M100"),
    103: ("Loser M101", "Loser M102"), 104: ("Winner M101", "Winner M102"),
}


def stage_name(m):
    r = m["RoundNumber"]
    if r in (1, 2, 3):
        return m.get("Group") or "Group Stage"
    if r == 8:
        return "Third Place Play-off" if m["MatchNumber"] == 103 else "Final"
    return ROUND_NAME.get(r, "Knockout")


def humanize(name, match_no, side):
    """Turn a placeholder slot into a readable label; pass real teams through."""
    if name and name != "To be announced":
        m1 = re.fullmatch(r"([12])([A-L])", name)
        if m1:
            pos = "Winner" if m1.group(1) == "1" else "Runner-up"
            return f"{pos} Group {m1.group(2)}"
        m3 = re.fullmatch(r"3([A-L]{2,})", name)
        if m3:
            return "3rd (" + "/".join(m3.group(1)) + ")"
        return with_flag(name)  # a real team name -> prefix flag
    label = BRACKET_LABELS.get(match_no)
    return label[side] if label else "TBC"


def is_real(name):
    if not name or name == "To be announced":
        return False
    return not re.fullmatch(r"([12][A-L]|3[A-L]{2,})", name)


def fold(line):
    out = []
    while len(line.encode("utf-8")) > 75:
        cut = 75
        while len(line[:cut].encode("utf-8")) > 75:
            cut -= 1
        out.append(line[:cut])
        line = " " + line[cut:]
    out.append(line)
    return out


def esc(text):
    return (text.replace("\\", "\\\\").replace(";", "\\;")
                .replace(",", "\\,").replace("\n", "\\n"))


def event(uid, start_utc, summary, location, description):
    end = start_utc + timedelta(minutes=MATCH_MINUTES)
    fmt = "%Y%m%dT%H%M%SZ"
    lines = [
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{STAMP}",
        f"DTSTART:{start_utc.strftime(fmt)}",
        f"DTEND:{end.strftime(fmt)}",
        f"SUMMARY:{esc(summary)}",
        f"LOCATION:{esc(location)}",
        f"DESCRIPTION:{esc(description)}",
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:Kick-off in 30 minutes",
        "TRIGGER:-PT30M",
        "END:VALARM",
        "END:VEVENT",
    ]
    folded = []
    for ln in lines:
        folded.extend(fold(ln))
    return folded


def build():
    with open(FIXTURES, encoding="utf-8") as f:
        matches = sorted(json.load(f), key=lambda m: m["MatchNumber"])

    cal = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//claimease//World Cup 2026 UK//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:World Cup 2026 (UK TV)",
        "X-WR-TIMEZONE:Europe/London",
        "X-WR-CALDESC:2026 FIFA World Cup fixtures with UK kick-off times and "
        "BBC/ITV channels. Knockout teams update automatically.",
    ]

    for m in matches:
        no = m["MatchNumber"]
        start = datetime.strptime(m["DateUtc"][:19], "%Y-%m-%d %H:%M:%S")
        home = humanize(m["HomeTeam"], no, 0)
        away = humanize(m["AwayTeam"], no, 1)
        stage = stage_name(m)
        ch = CHANNELS.get(no, "BBC / ITV (TBC)")
        venue = m.get("Location") or "TBC"

        summary = f"{home} v {away} ({ch})"
        if m["RoundNumber"] >= 4:
            summary = f"{stage}: {summary}"

        desc = (f"{stage} (Match {no}) | {home} v {away}\n"
                f"Venue: {venue}\n"
                f"UK TV: {ch}")
        if not (is_real(m["HomeTeam"]) and is_real(m["AwayTeam"])):
            desc += "\nTeams update automatically once results are known."

        cal.extend(event(f"wc2026-m{no:03d}@claimease", start, summary,
                         f"{venue} | {stage}", desc))

    cal.append("END:VCALENDAR")
    return "\r\n".join(cal) + "\r\n", len(matches)


if __name__ == "__main__":
    ics, n = build()
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(ics)
    print(f"Wrote {OUT} with {n} matches.")
