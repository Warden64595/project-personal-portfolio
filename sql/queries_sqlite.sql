-- Ticket Analytics Dashboard: the same six queries written for SQLite
-- (SQLite uses strftime and julianday instead of DAYNAME and TIMESTAMPDIFF)

-- 1. Tickets per category
SELECT c.name AS category, COUNT(*) AS total
FROM tickets t JOIN categories c ON t.category_id = c.id
GROUP BY c.name ORDER BY total DESC;

-- 2. Average hours to resolve, per category
SELECT c.name AS category,
       ROUND(AVG((julianday(t.closed_at) - julianday(t.created_at)) * 24), 1) AS avg_hours
FROM tickets t JOIN categories c ON t.category_id = c.id
WHERE t.closed_at IS NOT NULL
GROUP BY c.name ORDER BY avg_hours DESC;

-- 3. Tickets per weekday
SELECT CASE strftime('%w', created_at)
         WHEN '0' THEN 'Sunday' WHEN '1' THEN 'Monday' WHEN '2' THEN 'Tuesday'
         WHEN '3' THEN 'Wednesday' WHEN '4' THEN 'Thursday' WHEN '5' THEN 'Friday'
         ELSE 'Saturday' END AS weekday,
       COUNT(*) AS total
FROM tickets GROUP BY weekday ORDER BY total DESC;

-- 4. Tickets per day
SELECT DATE(created_at) AS day, COUNT(*) AS total
FROM tickets GROUP BY day ORDER BY day;

-- 5. Repeat problems
SELECT title, COUNT(*) AS times
FROM tickets GROUP BY title HAVING COUNT(*) > 1 ORDER BY times DESC;

-- 6. Technician workload
SELECT te.name AS technician, COUNT(*) AS tickets
FROM tickets t JOIN technicians te ON t.technician_id = te.id
GROUP BY te.name ORDER BY tickets DESC;
