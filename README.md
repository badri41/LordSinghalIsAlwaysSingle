# AQI Monitoring Portal

**DBMS Project**

---

## 👥 Team Members

* Badri Bishal Das (240150006) - Backend
* Pratham Saluja (240150045) - Frontend and Data
* Kushagra Singhal (240150046) - Machine Learning
* Sudipto Ghosh (240150042) - SQL Queries and Data Collection
* Sujal Patnaik (240150041) - SQL Queries and Database Management

**Date:** 19 March 2026

---

## 📌 1. Introduction

This project aims to develop a web portal for exploring historical Air Quality Index (AQI) and pollution data across major Indian cities (2021–2026). The platform enables users to visualize trends, analyze pollution levels, and compare air quality across cities.

The system uses historical data and focuses on visualization and analytical insights. Future enhancements include AQI prediction using machine learning models.

---

## 🧩 2. System Overview

### Frontend

* Built using React.js for dynamic UI
* Interactive charts and visualizations
* Responsive design

### Backend

* Node.js and Express.js for API handling
* Data processing and request management

### Database

* MariaDB for structured storage
* Optimized queries for efficient data retrieval

---

## 🌆 3. Cities Covered (Subject to Change)

Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Ahmedabad, Pune, Jaipur, Lucknow, Chandigarh, Bhopal, Indore, Noida, Guwahati

---

## 📚 4. Resources

* CPCB AQI India Portal
* CPCB AQI Repository

---

## 🤖 5. Enhancements Using Machine Learning

* AQI prediction using LSTM models
* Pollution trend analysis (long-term patterns)
* Anomaly detection for sudden spikes
* City clustering based on AQI patterns
* Health risk estimation (rule-based)

---

## 📊 6. Sample Analytical Queries

* Longest duration of "Severe" AQI in a city
* State-wise improvement in AQI over time
* Dates of extreme AQI spikes (Anomaly Detection)
* Monthly average PM2.5 levels
* Yearly AQI growth/decline rate
* Dominant pollutant (PM2.5 vs PM10)
* Worst month for air quality
* AQI patterns (weekdays vs weekends)
* Impact of rainfall on AQI
* Cities with highly volatile AQI

---

## 🗄️ 7. Database Setup (MariaDB)

### Prerequisites

* MariaDB Server installed
* CSV files available in `/data` folder

---

### Step 1: Open Command Prompt and navigate to project

cd project-root

---

### Step 2: Start MariaDB Client

Run the following command:

"C:\Program Files\MariaDB 12.2\bin\mysql.exe" -u root -p

Enter your password when prompted.

---

### Step 3: Enable local infile (Required for CSV loading)

Inside MariaDB terminal:

SET GLOBAL local_infile = 1;

---

### Step 4: Run Schema File

SOURCE database/schema.sql;

---

### Step 5: Run Seed File

SOURCE database/seed.sql;

---

### Notes

* Ensure CSV paths in `seed.sql` are correct (relative to project root)
* `local_infile` must be enabled for `LOAD DATA LOCAL INFILE` to work
* Use forward slashes `/` in file paths if facing issues on Windows

---
