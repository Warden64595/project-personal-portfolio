"""Cleans data/raw/tickets_raw.csv -> data/tickets.csv and prints a cleaning report.
Steps: trim spaces, unify category/priority spelling, one date format, remove duplicate
ticket ids, check closed time is after created time, map names to ids.
Run from the project folder:  python analysis/clean_data.py   (Python 3, no packages)"""
import csv
from datetime import datetime
cats = {r["name"]: r["id"] for r in csv.DictReader(open("data/categories.csv"))}
techs = {r["name"]: r["id"] for r in csv.DictReader(open("data/technicians.csv"))}
def parse(s):
    s = s.strip()
    for f in ("%Y-%m-%d %H:%M:%S", "%m/%d/%Y %I:%M %p"):
        try: return datetime.strptime(s, f)
        except ValueError: pass
    raise ValueError("bad date: " + s)
raw = list(csv.DictReader(open("data/raw/tickets_raw.csv", encoding="utf-8")))
seen, clean, dup, fixed_text, fixed_date, bad = set(), [], 0, 0, 0, 0
for r in raw:
    tid = int(r["ticket_id"])
    if tid in seen: dup += 1; continue
    seen.add(tid)
    cat = r["category"].strip().title(); pri = r["priority"].strip().title()
    if cat != r["category"] or pri != r["priority"] or r["title"] != r["title"].strip(): fixed_text += 1
    ca, cl = parse(r["created_at"]), parse(r["closed_at"])
    if "/" in r["created_at"]: fixed_date += 1
    if cl < ca: bad += 1; continue
    clean.append([tid, r["title"].strip(), ca.strftime("%Y-%m-%d %H:%M:%S"), cl.strftime("%Y-%m-%d %H:%M:%S"),
                  cats[cat], pri, r["status"].strip(), r["department"].strip(), techs[r["technician"].strip()]])
clean.sort()
with open("data/tickets.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["ticket_id","title","created_at","closed_at","category_id","priority","status","department","technician_id"])
    w.writerows(clean)
print("Raw rows:", len(raw)); print("Duplicate rows removed:", dup)
print("Rows with spacing/spelling fixed:", fixed_text); print("Rows with dates converted:", fixed_date)
print("Closed-before-created rows dropped:", bad); print("Clean rows saved:", len(clean))
