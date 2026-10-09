"""Draws the four analysis charts from results/*.csv into charts/*.png (SAMPLE data).
Run from the project folder:  python analysis/make_charts.py   (needs matplotlib)"""
import csv
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
OR, GREY = "#f26200", "#9a9a9a"
def load(n): return list(csv.DictReader(open(f"results/{n}.csv", encoding="utf-8")))
def style(ax, title, sub):
    ax.set_title(title, loc="left", fontsize=13, fontweight="bold", pad=22)
    ax.text(0, 1.04, sub, transform=ax.transAxes, fontsize=9, color="#555")
    for s in ("top", "right"): ax.spines[s].set_visible(False)
    ax.grid(axis="y", color="#e5e5e5"); ax.set_axisbelow(True)
def save(fig, name): fig.tight_layout(); fig.savefig(f"charts/{name}.png", dpi=150); plt.close(fig)
def bars(name, rows, lab, val, title, sub, ylabel, highlight=0):
    fig, ax = plt.subplots(figsize=(7, 4))
    x = [r[lab] for r in rows]; y = [float(r[val]) for r in rows]
    b = ax.bar(x, y, color=[OR if i == highlight else GREY for i in range(len(y))], width=.6)
    for r_, v in zip(b, y): ax.text(r_.get_x()+r_.get_width()/2, v, f"{v:g}", ha="center", va="bottom", fontsize=9)
    ax.set_ylabel(ylabel); style(ax, title, sub); save(fig, name)
c = load("tickets_per_category"); k = list(c[0])
bars("1-tickets-per-category", c, k[0], k[1], "Tickets per category", "Network is the biggest group (38 of 120 tickets)", "Tickets")
a = load("avg_hours_per_category"); k = list(a[0])
a.sort(key=lambda r: -float(r[k[1]]))
bars("2-avg-resolution-hours", a, k[0], k[1], "Average hours to resolve", "Hardware takes longest; Account is fastest (SAMPLE data)", "Hours")
w = load("tickets_per_weekday"); k = list(w[0]); print(k, [r[k[0]] for r in w])
bars("3-tickets-per-weekday", w, k[0], k[1], "Tickets per weekday", "Requests peak early in the week and drop at weekends", "Tickets")
d = load("tickets_per_day"); k = list(d[0])
fig, ax = plt.subplots(figsize=(7, 4))
y = [float(r[k[1]]) for r in d]; ax.plot(range(len(y)), y, color=OR, lw=2)
ticks = list(range(0, len(d), 10)); ax.set_xticks(ticks); ax.set_xticklabels([d[i][k[0]][5:] for i in ticks])
ax.set_ylabel("Tickets"); style(ax, "Tickets per day", "3 Aug to 27 Sep 2026 (SAMPLE data)"); save(fig, "4-tickets-per-day")
print("charts done")
