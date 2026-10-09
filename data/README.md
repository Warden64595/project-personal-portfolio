# Sample data

**These CSV files are SAMPLE data created for this project. They are not real company tickets and contain no personal information.**

| File | Rows | Columns |
|---|---|---|
| `raw/tickets_raw.csv` | 123 (3 duplicates, mixed spelling and date formats) | ticket_id, title, created_at, closed_at, category, priority, status, department, technician |
| `categories.csv` | 5 | id, name |
| `technicians.csv` | 3 (named Technician A, B, C) | id, name |
| `tickets.csv` (cleaned from the raw file) | 120 tickets, 3 August to 27 September 2026 | ticket_id, title, created_at, closed_at, category_id, priority, status, department, technician_id |

Run `python analysis/clean_data.py` to rebuild `tickets.csv` from the raw file.
Load `categories.csv` and `technicians.csv` first, then `tickets.csv` (see `sql/schema.sql`).
If you replace this with real data, remove all names and confidential details first, and get permission.
