"""Reads ticket_analytics.db, runs the six analysis queries, prints the results
and saves each one as a CSV file in the results folder.
Run:  python export_results.py   (Python 3, no extra packages needed)"""
import csv, os, sqlite3

HERE = os.path.dirname(os.path.abspath(__file__))
SQL_FILE = os.path.join(HERE, "..", "sql", "queries_sqlite.sql")
OUT_DIR = os.path.join(HERE, "..", "results")
NAMES = ["tickets_per_category", "avg_hours_per_category", "tickets_per_weekday",
         "tickets_per_day", "repeat_problems", "technician_workload"]

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    con = sqlite3.connect(os.path.join(HERE, "ticket_analytics.db"))
    # split the SQL file into its six queries (each one ends with a semicolon)
    queries = [q.strip() for q in open(SQL_FILE, encoding="utf-8").read().split(";") if "SELECT" in q]
    for name, query in zip(NAMES, queries):
        cur = con.execute(query)
        header = [d[0] for d in cur.description]
        rows = cur.fetchall()
        print("\n" + name + " (" + str(len(rows)) + " rows)")
        print(" | ".join(header))
        for r in rows[:8]:
            print(" | ".join(str(v) for v in r))
        with open(os.path.join(OUT_DIR, name + ".csv"), "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f); w.writerow(header); w.writerows(rows)
    con.close()
    print("\nSaved CSV files in:", os.path.abspath(OUT_DIR))

if __name__ == "__main__":
    main()
