#!/usr/bin/env python3
"""
Generate an iCalendar (.ics) file for the 2026 FIFA World Cup (USA/Canada/Mexico).

- All kick-off times are entered in UK local time (BST, UTC+1 in Jun/Jul 2026)
  and written out in UTC so any calendar app shows the correct local time.
- UK broadcaster (BBC / ITV) is included per match where confirmed; otherwise
  marked "BBC / ITV (TBC)" since both share all 104 matches free-to-air.
- Group stage: real fixtures. Knockout stage: deterministic qualification slots
  (e.g. "Runner-up A vs Runner-up B") until teams are known.

Re-run this script to regenerate world-cup-2026-uk.ics.
"""

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

UK = ZoneInfo("Europe/London")
UTC = ZoneInfo("UTC")

# Stamp used for DTSTAMP / last generated time.
STAMP = "20260609T120000Z"

# Each match: (date "YYYY-MM-DD", "HH:MM" UK time, home, away, group/stage, city, channel)
# channel "" => defaults to "BBC / ITV (TBC)"
GROUP_MATCHES = [
    # June 11
    ("2026-06-11", "20:00", "Mexico", "South Africa", "Group A", "Mexico City", "ITV1"),
    # June 12
    ("2026-06-12", "03:00", "South Korea", "Czech Republic", "Group A", "Zapopan", ""),
    ("2026-06-12", "20:00", "Canada", "Bosnia & Herzegovina", "Group B", "Toronto", "BBC One"),
    # June 13
    ("2026-06-13", "02:00", "USA", "Paraguay", "Group D", "Los Angeles", ""),
    ("2026-06-13", "20:00", "Qatar", "Switzerland", "Group B", "Santa Clara", "ITV1"),
    ("2026-06-13", "23:00", "Brazil", "Morocco", "Group C", "New Jersey", "BBC"),
    # June 14
    ("2026-06-14", "02:00", "Haiti", "Scotland", "Group C", "Foxborough", "BBC"),
    ("2026-06-14", "05:00", "Australia", "Turkey", "Group D", "Vancouver", ""),
    ("2026-06-14", "18:00", "Germany", "Curacao", "Group E", "Houston", "ITV1"),
    ("2026-06-14", "21:00", "Netherlands", "Japan", "Group F", "Arlington", "ITV1"),
    # June 15
    ("2026-06-15", "00:00", "Ivory Coast", "Ecuador", "Group E", "Philadelphia", ""),
    ("2026-06-15", "03:00", "Sweden", "Tunisia", "Group F", "Guadalupe", ""),
    ("2026-06-15", "17:00", "Spain", "Cape Verde", "Group H", "Atlanta", ""),
    ("2026-06-15", "20:00", "Belgium", "Egypt", "Group G", "Seattle", "BBC One"),
    ("2026-06-15", "23:00", "Saudi Arabia", "Uruguay", "Group H", "Miami", ""),
    # June 16
    ("2026-06-16", "02:00", "Iran", "New Zealand", "Group G", "Los Angeles", ""),
    ("2026-06-16", "20:00", "France", "Senegal", "Group I", "New Jersey", "BBC One"),
    ("2026-06-16", "23:00", "Iraq", "Norway", "Group I", "Foxborough", ""),
    # June 17
    ("2026-06-17", "02:00", "Argentina", "Algeria", "Group J", "Kansas City", ""),
    ("2026-06-17", "05:00", "Austria", "Jordan", "Group J", "Santa Clara", ""),
    ("2026-06-17", "18:00", "Portugal", "DR Congo", "Group K", "Houston", ""),
    ("2026-06-17", "21:00", "England", "Croatia", "Group L", "Arlington", "ITV1"),
    # June 18
    ("2026-06-18", "00:00", "Ghana", "Panama", "Group L", "Toronto", ""),
    ("2026-06-18", "03:00", "Uzbekistan", "Colombia", "Group K", "Mexico City", ""),
    ("2026-06-18", "17:00", "Czech Republic", "South Africa", "Group A", "Atlanta", ""),
    ("2026-06-18", "20:00", "Switzerland", "Bosnia & Herzegovina", "Group B", "Los Angeles", ""),
    ("2026-06-18", "23:00", "Canada", "Qatar", "Group B", "Vancouver", ""),
    # June 19
    ("2026-06-19", "02:00", "Mexico", "South Korea", "Group A", "Zapopan", ""),
    ("2026-06-19", "20:00", "USA", "Australia", "Group D", "Seattle", "BBC One"),
    ("2026-06-19", "23:00", "Scotland", "Morocco", "Group C", "Foxborough", "ITV1"),
    # June 20
    ("2026-06-20", "01:30", "Brazil", "Haiti", "Group C", "Philadelphia", ""),
    ("2026-06-20", "04:00", "Turkey", "Paraguay", "Group D", "Santa Clara", ""),
    ("2026-06-20", "18:00", "Netherlands", "Sweden", "Group F", "Houston", "BBC One"),
    ("2026-06-20", "21:00", "Germany", "Ivory Coast", "Group E", "Toronto", "ITV1"),
    # June 21
    ("2026-06-21", "01:00", "Ecuador", "Curacao", "Group E", "Kansas City", ""),
    ("2026-06-21", "05:00", "Tunisia", "Japan", "Group F", "Guadalupe", ""),
    ("2026-06-21", "17:00", "Spain", "Saudi Arabia", "Group H", "Atlanta", ""),
    ("2026-06-21", "20:00", "Belgium", "Iran", "Group G", "Los Angeles", ""),
    ("2026-06-21", "23:00", "Uruguay", "Cape Verde", "Group H", "Miami", ""),
    # June 22
    ("2026-06-22", "02:00", "New Zealand", "Egypt", "Group G", "Vancouver", ""),
    ("2026-06-22", "18:00", "Argentina", "Austria", "Group J", "Arlington", ""),
    ("2026-06-22", "22:00", "France", "Iraq", "Group I", "Philadelphia", ""),
    # June 23
    ("2026-06-23", "01:00", "Norway", "Senegal", "Group I", "Toronto", ""),
    ("2026-06-23", "04:00", "Jordan", "Algeria", "Group J", "Santa Clara", ""),
    ("2026-06-23", "18:00", "Portugal", "Uzbekistan", "Group K", "Houston", ""),
    ("2026-06-23", "21:00", "England", "Ghana", "Group L", "Foxborough", "BBC One"),
    # June 24
    ("2026-06-24", "00:00", "Panama", "Croatia", "Group L", "Foxborough", ""),
    ("2026-06-24", "03:00", "Colombia", "DR Congo", "Group K", "Zapopan", ""),
    ("2026-06-24", "20:00", "Switzerland", "Canada", "Group B", "Vancouver", ""),
    ("2026-06-24", "20:00", "Bosnia & Herzegovina", "Qatar", "Group B", "Seattle", ""),
    ("2026-06-24", "23:00", "Morocco", "Haiti", "Group C", "Atlanta", ""),
    ("2026-06-24", "23:00", "Scotland", "Brazil", "Group C", "Miami", "BBC"),
    # June 25
    ("2026-06-25", "02:00", "South Africa", "South Korea", "Group A", "Guadalupe", ""),
    ("2026-06-25", "02:00", "Czech Republic", "Mexico", "Group A", "Mexico City", ""),
    ("2026-06-25", "21:00", "Curacao", "Ivory Coast", "Group E", "Philadelphia", ""),
    ("2026-06-25", "21:00", "Ecuador", "Germany", "Group E", "New Jersey", ""),
    # June 26
    ("2026-06-26", "00:00", "Tunisia", "Netherlands", "Group F", "Kansas City", ""),
    ("2026-06-26", "00:00", "Japan", "Sweden", "Group F", "Arlington", ""),
    ("2026-06-26", "03:00", "Turkey", "USA", "Group D", "Los Angeles", ""),
    ("2026-06-26", "03:00", "Paraguay", "Australia", "Group D", "Santa Clara", ""),
    ("2026-06-26", "20:00", "Norway", "France", "Group I", "Foxborough", ""),
    ("2026-06-26", "20:00", "Senegal", "Iraq", "Group I", "Toronto", ""),
    # June 27
    ("2026-06-27", "01:00", "Cape Verde", "Saudi Arabia", "Group H", "Houston", ""),
    ("2026-06-27", "01:00", "Uruguay", "Spain", "Group H", "Zapopan", ""),
    ("2026-06-27", "04:00", "New Zealand", "Belgium", "Group G", "Vancouver", ""),
    ("2026-06-27", "04:00", "Egypt", "Iran", "Group G", "Seattle", ""),
    ("2026-06-27", "22:00", "Panama", "England", "Group L", "New Jersey", "ITV1"),
    ("2026-06-27", "22:00", "Croatia", "Ghana", "Group L", "Philadelphia", ""),
    # June 28 (early hours UK) — Group J & K final round
    ("2026-06-28", "00:30", "Colombia", "Portugal", "Group K", "Miami", ""),
    ("2026-06-28", "00:30", "DR Congo", "Uzbekistan", "Group K", "Atlanta", ""),
    ("2026-06-28", "03:00", "Algeria", "Austria", "Group J", "Kansas City", ""),
    ("2026-06-28", "03:00", "Jordan", "Argentina", "Group J", "Arlington", ""),
]

# Knockout matches: (date, time, home_slot, away_slot, stage, city, match_no)
KNOCKOUT_MATCHES = [
    # Round of 32
    ("2026-06-28", "20:00", "Runner-up A", "Runner-up B", "Round of 32", "Los Angeles", 73),
    ("2026-06-29", "18:00", "Winner C", "Runner-up F", "Round of 32", "Houston", 76),
    ("2026-06-29", "21:30", "Winner E", "3rd A/B/C/D/F", "Round of 32", "Foxborough", 74),
    ("2026-06-30", "02:00", "Winner F", "Runner-up C", "Round of 32", "Guadalupe", 75),
    ("2026-06-30", "18:00", "Runner-up E", "Runner-up I", "Round of 32", "Arlington", 78),
    ("2026-06-30", "22:00", "Winner I", "3rd C/D/F/G/H", "Round of 32", "New Jersey", 77),
    ("2026-07-01", "02:00", "Winner A", "3rd C/E/F/H/I", "Round of 32", "Mexico City", 79),
    ("2026-07-01", "17:00", "Winner L", "3rd E/H/I/J/K", "Round of 32", "Atlanta", 80),
    ("2026-07-01", "21:00", "Winner G", "3rd A/E/H/I/J", "Round of 32", "Seattle", 82),
    ("2026-07-02", "01:00", "Winner D", "3rd B/E/F/I/J", "Round of 32", "Santa Clara", 81),
    ("2026-07-02", "20:00", "Winner H", "Runner-up J", "Round of 32", "Los Angeles", 84),
    ("2026-07-03", "00:00", "Runner-up K", "Runner-up L", "Round of 32", "Toronto", 83),
    ("2026-07-03", "04:00", "Winner B", "3rd E/F/G/I/J", "Round of 32", "Vancouver", 85),
    ("2026-07-03", "19:00", "Runner-up D", "Runner-up G", "Round of 32", "Arlington", 88),
    ("2026-07-03", "23:00", "Winner J", "Runner-up H", "Round of 32", "Miami", 86),
    ("2026-07-04", "02:30", "Winner K", "3rd D/E/I/J/L", "Round of 32", "Kansas City", 87),
    # Round of 16
    ("2026-07-04", "18:00", "Winner M73", "Winner M75", "Round of 16", "Houston", 90),
    ("2026-07-04", "22:00", "Winner M74", "Winner M77", "Round of 16", "Philadelphia", 89),
    ("2026-07-05", "21:00", "Winner M76", "Winner M78", "Round of 16", "New Jersey", 91),
    ("2026-07-06", "01:00", "Winner M79", "Winner M80", "Round of 16", "Mexico City", 92),
    ("2026-07-06", "20:00", "Winner M83", "Winner M84", "Round of 16", "Arlington", 93),
    ("2026-07-07", "01:00", "Winner M81", "Winner M82", "Round of 16", "Seattle", 94),
    ("2026-07-07", "17:00", "Winner M86", "Winner M88", "Round of 16", "Atlanta", 95),
    ("2026-07-07", "21:00", "Winner M85", "Winner M87", "Round of 16", "Vancouver", 96),
    # Quarter-finals
    ("2026-07-09", "21:00", "Winner M89", "Winner M90", "Quarter-final", "Foxborough", 97),
    ("2026-07-10", "20:00", "Winner M93", "Winner M94", "Quarter-final", "Los Angeles", 98),
    ("2026-07-11", "22:00", "Winner M91", "Winner M92", "Quarter-final", "Miami", 99),
    ("2026-07-12", "02:00", "Winner M95", "Winner M96", "Quarter-final", "Kansas City", 100),
    # Semi-finals
    ("2026-07-14", "20:00", "Winner M97", "Winner M99", "Semi-final", "Arlington", 101),
    ("2026-07-15", "20:00", "Winner M98", "Winner M100", "Semi-final", "Atlanta", 102),
    # Third place play-off
    ("2026-07-18", "22:00", "Loser M101", "Loser M102", "Third Place Play-off", "Miami", 103),
    # Final
    ("2026-07-19", "20:00", "Winner M101", "Winner M102", "Final", "New Jersey", 104),
]

MATCH_MINUTES = 120  # block out two hours per match


def uk_to_utc(date_str, time_str):
    dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    return dt.replace(tzinfo=UK).astimezone(UTC)


def fold(line):
    """Fold lines longer than 75 octets per RFC 5545."""
    out = []
    while len(line.encode("utf-8")) > 75:
        # find a safe cut <=75 bytes
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
    end_utc = start_utc + timedelta(minutes=MATCH_MINUTES)
    fmt = "%Y%m%dT%H%M%SZ"
    lines = [
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{STAMP}",
        f"DTSTART:{start_utc.strftime(fmt)}",
        f"DTEND:{end_utc.strftime(fmt)}",
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
    cal = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//claimease//World Cup 2026 UK//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:World Cup 2026 (UK TV)",
        "X-WR-TIMEZONE:Europe/London",
        "X-WR-CALDESC:2026 FIFA World Cup fixtures with UK kick-off times and BBC/ITV channels.",
    ]

    n = 0
    for date_str, time_str, home, away, group, city, channel in GROUP_MATCHES:
        n += 1
        ch = channel or "BBC / ITV (TBC)"
        start = uk_to_utc(date_str, time_str)
        summary = f"{home} v {away} ({ch})"
        desc = (f"{group} | {home} v {away}\n"
                f"Kick-off: {time_str} UK | Venue: {city}\n"
                f"UK TV: {ch}")
        cal.extend(event(f"wc2026-grp-{n:03d}@claimease", start, summary,
                         f"{city} | {group}", desc))

    for date_str, time_str, home, away, stage, city, mno in KNOCKOUT_MATCHES:
        ch = "BBC / ITV (TBC)"
        start = uk_to_utc(date_str, time_str)
        summary = f"{stage}: {home} v {away} ({ch})"
        desc = (f"{stage} (Match {mno}) | {home} v {away}\n"
                f"Kick-off: {time_str} UK | Venue: {city}\n"
                f"UK TV: {ch}\n"
                f"Teams confirmed once group/earlier results are known.")
        cal.extend(event(f"wc2026-ko-{mno:03d}@claimease", start, summary,
                         f"{city} | {stage}", desc))

    cal.append("END:VCALENDAR")
    return "\r\n".join(cal) + "\r\n"


if __name__ == "__main__":
    import os
    out_path = os.path.join(os.path.dirname(__file__), "world-cup-2026-uk.ics")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(build())
    total = len(GROUP_MATCHES) + len(KNOCKOUT_MATCHES)
    print(f"Wrote {out_path} with {total} matches "
          f"({len(GROUP_MATCHES)} group + {len(KNOCKOUT_MATCHES)} knockout).")
