# Test Cases: Ticket Analytics Dashboard
Tester: Edward S. Vidal | Date: [date] | Tools: MySQL, Excel or Google Sheets

## Summary
Total: [y] | Passed: [x] | Failed: [z]
Only write a result after you have really run the test.

## Data tests
| ID | What is tested | Steps | Expected result | Actual result | Pass / Fail |
|---|---|---|---|---|---|
| TC-01 | Row count | Count rows in the source file and in the `tickets` table | Both counts are equal | [ ] | [ ] |
| TC-02 | Duplicate tickets | Group by `ticket_id` and look for counts above 1 | No duplicates | [ ] | [ ] |
| TC-03 | Date logic | Select rows where `closed_at` is before `created_at` | No rows returned | [ ] | [ ] |
| TC-04 | Category names | List the distinct values in `categories.name` | Only the agreed names appear | [ ] | [ ] |
| TC-05 | Missing values | Count empty `created_at` and `category_id` values | None are empty | [ ] | [ ] |

## Query tests
| ID | What is tested | Steps | Expected result | Actual result | Pass / Fail |
|---|---|---|---|---|---|
| TC-06 | Tickets per category | Add up all category totals | Sum equals the total ticket count | [ ] | [ ] |
| TC-07 | Average resolution time | Calculate one category's average by hand in Excel | Matches the SQL result | [ ] | [ ] |
| TC-08 | Tickets per weekday | Add up all weekday totals | Sum equals the total ticket count | [ ] | [ ] |
| TC-09 | Tickets per day | Add up all daily totals | Sum equals the total ticket count | [ ] | [ ] |
| TC-10 | Repeat problems | Check three repeated titles by hand | Counts match the query | [ ] | [ ] |
| TC-11 | Technician workload | Add up all technician totals | Sum equals tickets with a technician | [ ] | [ ] |

## Dashboard tests
| ID | What is tested | Steps | Expected result | Actual result | Pass / Fail |
|---|---|---|---|---|---|
| TC-12 | Chart values | Compare each chart with its query result | Values are identical | [ ] | [ ] |
| TC-13 | Chart labels | Check titles, axis labels and units | All present and correct | [ ] | [ ] |
| TC-14 | Key numbers | Compare the key numbers with the queries | Values are identical | [ ] | [ ] |
| TC-15 | Update with new data | Add 5 sample rows and rerun | Totals increase by 5 and charts refresh | [ ] | [ ] |

## Privacy test
| ID | What is tested | Steps | Expected result | Actual result | Pass / Fail |
|---|---|---|---|---|---|
| TC-16 | No personal data | Search every file in the repository for names and IDs | None found | [ ] | [ ] |

## Bug log
| Bug ID | Found in | What happened | Cause | Fix | Retest result |
|---|---|---|---|---|---|
| BUG-01 | [TC-xx] | [describe] | [root cause] | [what you changed] | [Pass] |

## Notes
Add screenshots of any failed test and of the fixed result.
