import requests
import json
import argparse

def fetch_data(city_slug, sensor, year, token):
    url = "https://apiserver.aqi.in/aqi/v2/getAqiCalender"
    
    params = {
        "slug": city_slug,
        "slugType": "cityId",
        "sensorname": sensor,
        "year": str(year),
        "source": "web"
    }

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json, text/plain, */*",
        "Origin": "https://www.aqi.in",
        "Referer": "https://www.aqi.in/",
        "Authorization": f"bearer {token}"
    }

    try:
        resp = requests.get(url, params=params, headers=headers, timeout=30)

        print(f"\nStatus Code: {resp.status_code}")

        data = resp.json()

        print(f"Response Keys: {list(data.keys())}")

        print("\nFull response (first 3000 chars):\n")
        print(json.dumps(data, indent=2)[:3000])

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch AQI API Debug Data")

    parser.add_argument("--slug", required=True, help="City slug (e.g., india/gujarat/ahmedabad)")
    parser.add_argument("--sensor", default="aqi", help="Sensor name (aqi, pm25, pm10, co, no2, o3)")
    parser.add_argument("--year", default=2025, type=int, help="Year (e.g., 2025)")
    parser.add_argument("--token", required=True, help="API Bearer Token")

    args = parser.parse_args()

    fetch_data(args.slug, args.sensor, args.year, args.token)