"""Builds data/raw/tickets_raw.csv: a deliberately messy help-desk export (SAMPLE data),
so the cleaning step in clean_data.py has real work to do.
Run from the project folder:  python analysis/make_raw_export.py"""
import csv, random
from datetime import datetime
random.seed(7)
cats = {r["id"]: r["name"] for r in csv.DictReader(open("data/categories.csv"))}
techs = {r["id"]: r["name"] for r in csv.DictReader(open("data/technicians.csv"))}
rows = list(csv.DictReader(open("data/tickets.csv")))
out = []
for i, r in enumerate(rows):
    c = cats[r["category_id"]]
    c = random.choice([c, c, c, c.lower(), c.upper(), " " + c + " "]) if i % 6 == 0 else c
    t = r["title"] + ("  " if i % 11 == 0 else "")
    ca = datetime.strptime(r["created_at"], "%Y-%m-%d %H:%M:%S")
    cl = datetime.strptime(r["closed_at"], "%Y-%m-%d %H:%M:%S")
    created = ca.strftime("%m/%d/%Y %I:%M %p") if i % 7 == 0 else r["created_at"]
    closed = cl.strftime("%m/%d/%Y %I:%M %p") if i % 7 == 0 else r["closed_at"]
    pr = r["priority"].lower() if i % 9 == 0 else r["priority"]
    out.append([r["ticket_id"], t, created, closed, c, pr, r["status"], r["department"], techs[r["technician_id"]]])
for i in (14, 52, 97):                      # exact duplicate rows
    out.append(out[i])
random.shuffle(out)
with open("data/raw/tickets_raw.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["ticket_id","title","created_at","closed_at","category","priority","status","department","technician"])
    w.writerows(out)
print(len(out), "raw rows written")
