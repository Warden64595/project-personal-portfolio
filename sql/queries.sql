-- Ticket Analytics Dashboard: analysis queries (MySQL)
USE ticket_analytics;

-- 1. Tickets per category  (bar chart)
SELECT c.name AS category, COUNT(*) AS total
FROM tickets t JOIN categories c ON t.category_id = c.id
GROUP BY c.name ORDER BY total DESC;

-- 2. Average hours to resolve, per category  (bar chart)
SELECT c.name AS category,
       ROUND(AVG(TIMESTAMPDIFF(HOUR, t.created_at, t.closed_at)), 1) AS avg_hours
FROM tickets t JOIN categories c ON t.category_id = c.id
WHERE t.closed_at IS NOT NULL
GROUP BY c.name ORDER BY avg_hours DESC;

-- 3. Tickets per weekday  (bar chart)
SELECT DAYNAME(created_at) AS weekday, COUNT(*) AS total
FROM tickets GROUP BY weekday ORDER BY total DESC;

-- 4. Tickets per day  (line chart)
SELECT DATE(created_at) AS day, COUNT(*) AS total
FROM tickets GROUP BY day ORDER BY day;

-- 5. Repeat problems  (findings)
SELECT title, COUNT(*) AS times
FROM tickets GROUP BY title HAVING COUNT(*) > 1 ORDER BY times DESC;

-- 6. Technician workload  (findings)
SELECT te.name AS technician, COUNT(*) AS tickets
FROM tickets t JOIN technicians te ON t.technician_id = te.id
GROUP BY te.name ORDER BY tickets DESC;

-- DATA QUALITY CHECKS (each should return no rows)
-- Duplicate ticket numbers:
SELECT ticket_id, COUNT(*) FROM tickets GROUP BY ticket_id HAVING COUNT(*) > 1;
-- Tickets closed before they were created:
SELECT * FROM tickets WHERE closed_at < created_at;
