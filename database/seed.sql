USE aqi_db;

INSERT INTO cities (city_name, state, region) VALUES
('Delhi', 'Delhi', 'North'),
('Mumbai', 'Maharashtra', 'West'),
('Kolkata', 'West Bengal', 'East'),
('Chennai', 'Tamil Nadu', 'South'),
('Bangalore', 'Karnataka', 'South'),
('Hyderabad', 'Telangana', 'South'),
('Ahmedabad', 'Gujarat', 'West'),
('Pune', 'Maharashtra', 'West'),
('Jaipur', 'Rajasthan', 'North'),
('Lucknow', 'Uttar Pradesh', 'North'),
('Chandigarh', 'Chandigarh', 'North'),
('Bhopal', 'Madhya Pradesh', 'Central'),
('Indore', 'Madhya Pradesh', 'Central'),
('Noida', 'Uttar Pradesh', 'North'),
('Guwahati', 'Assam', 'Northeast');

LOAD DATA LOCAL INFILE 'data/csv/merged/merged_aqi_data_2021_2026.csv'
INTO TABLE aqi_data
FIELDS TERMINATED BY ','
IGNORE 1 ROWS
(city, date, co, no2, o3, pm10, pm25, aqi_daily, @aqi_monthly);

UPDATE aqi_data a
JOIN cities c
ON LOWER(TRIM(a.city_name)) = LOWER(TRIM(c.city_name))
SET a.city_id = c.city_id;

ALTER TABLE aqi_data DROP COLUMN city;

ALTER TABLE aqi_data DROP PRIMARY KEY;

ALTER TABLE aqi_data DROP COLUMN id;

ALTER TABLE aqi_data
ADD PRIMARY KEY (city_id, date);

ALTER TABLE aqi_data
ADD CONSTRAINT fk_city
FOREIGN KEY (city_id) REFERENCES cities(city_id);

CREATE INDEX idx_city_date ON aqi_data(city_id, date);
