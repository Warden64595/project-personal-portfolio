-- Ticket Analytics Dashboard: database schema (MySQL)
CREATE DATABASE IF NOT EXISTS ticket_analytics;
USE ticket_analytics;

CREATE TABLE IF NOT EXISTS categories (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS technicians (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
  ticket_id     INT PRIMARY KEY,
  title         VARCHAR(120) NOT NULL,
  created_at    DATETIME NOT NULL,
  closed_at     DATETIME NULL,
  category_id   INT NOT NULL,
  priority      ENUM('Low','Medium','High') NOT NULL,
  status        ENUM('Open','In progress','Closed') NOT NULL,
  department    VARCHAR(60),
  technician_id INT,
  FOREIGN KEY (category_id)   REFERENCES categories(id),
  FOREIGN KEY (technician_id) REFERENCES technicians(id)
);

-- IMPORT THE CSV FILES (load categories and technicians first, then tickets)
-- Option 1 (easiest): in MySQL Workbench, right-click each table, choose
--   "Table Data Import Wizard", and select the matching file from the data folder.
-- Option 2: use LOAD DATA (change the file path to where your files are saved;
--   your server must allow local_infile):
-- LOAD DATA LOCAL INFILE 'data/categories.csv'  INTO TABLE categories
--   FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES (id, name);
-- LOAD DATA LOCAL INFILE 'data/technicians.csv' INTO TABLE technicians
--   FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES (id, name);
-- LOAD DATA LOCAL INFILE 'data/tickets.csv'     INTO TABLE tickets
--   FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES
--   (ticket_id, title, created_at, closed_at, category_id, priority, status, department, technician_id);
