CREATE DATABASE IF NOT EXISTS aqi_db;
USE aqi_db;

CREATE TABLE cities (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(50) UNIQUE,
    state VARCHAR(50),
    region VARCHAR(50)
);

CREATE TABLE aqi_data (
    id INT AUTO_INCREMENT PRIMARY KEY,   -- temporary PK
    city_id INT,
    city_name VARCHAR(50),                    -- temporary (for CSV load)
    date DATE,
    co FLOAT,
    no2 FLOAT,
    o3 FLOAT,
    pm10 FLOAT,
    pm25 FLOAT,
    aqi_daily FLOAT  
);
