# Requirements and System Analysis: Ticket Analytics Dashboard

## 1. Problem Statement
IT teams receive many support tickets but rarely study the pattern. Without analysis, repeat problems stay unfixed and staff are not scheduled for the busiest days.

## 2. Existing System
| Weakness | Effect |
|---|---|
| Tickets are only read one by one | Nobody sees which problems repeat |
| No summary of resolution time | Slow categories are not noticed |
| No view of busy days | Staffing is not planned |

## 3. Proposed System
A set of cleaned ticket data, SQL queries and an Excel dashboard that answers four questions: what happens most, how long it takes to fix, when requests peak, and who handles them. It ends with written findings and recommendations.

## 4. Actors
| Actor | Description |
|---|---|
| Analyst (me) | Cleans the data, runs the queries, builds the dashboard |
| IT manager | Reads the dashboard and decides on actions |
| Help desk technician | Uses the repeat-problem results to prevent future tickets |

## 5. Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The project shall load ticket data from CSV files into database tables. | High |
| FR-02 | The data shall be cleaned: no duplicates, consistent categories, valid dates. | High |
| FR-03 | SQL queries shall return tickets per category, average resolution time, tickets per weekday, tickets per day, repeat problems and technician workload. | High |
| FR-04 | Each query result shall be shown as a chart or table. | High |
| FR-05 | The dashboard shall show key numbers: total tickets, top category, average resolution time and busiest weekday. | Medium |
| FR-06 | The project shall include written findings and recommendations. | High |
| FR-07 | The steps to reproduce the analysis shall be documented in the README. | Medium |
| FR-08 | The raw export shall be kept unchanged in `data/raw/`, and a script shall turn it into the cleaned file. | Medium |
| FR-09 | Chart images shall be produced from the SQL results. | Medium |

## 6. Non-Functional Requirements
| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Accuracy | SQL totals match Excel dashboard totals. |
| NFR-02 | Privacy | No names, employee IDs or confidential company details appear in any public file. |
| NFR-03 | Reproducibility | Another person can repeat the analysis from the README. |
| NFR-04 | Usability | Charts have titles, labeled axes and units, and are readable on screen. |
| NFR-05 | Performance | Each query runs in under 5 seconds on the project dataset. |

## 7. Use Cases
| ID | Name | Actor | Main steps | Alternative / error |
|---|---|---|---|---|
| UC-01 | Load and clean data | Analyst | 1. Import CSV 2. Remove duplicates 3. Fix categories 4. Check dates | Invalid dates are corrected or removed |
| UC-02 | Run analysis | Analyst | 1. Run each query 2. Export results | Query error: fix and rerun |
| UC-03 | View dashboard | IT manager | 1. Open dashboard 2. Read key numbers and charts | Data missing: show a note |
| UC-04 | Update with new data | Analyst | 1. Add new rows 2. Rerun queries 3. Refresh charts | Totals differ: recheck the cleaning steps |

## 8. Constraints and Assumptions
- Real ticket data is used only with permission and with all personal details removed. Otherwise sample data is used and labeled as sample.
- Tools: MySQL or SQLite, Python and Excel.

## 9. Design Artifacts
- Database design (ERD): `docs/erd.png`
- Dashboard screenshot: `docs/dashboard.png`
- Chart images: `charts/`
- Excel dashboard: `dashboard/dashboard.xlsx`
- SQL files: `sql/schema.sql`, `sql/queries.sql`
