import json
import time
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "data" / "destinations.json"
OUTPUT_PATH = Path(__file__).resolve().parent / "coordinates_review.json"
USER_AGENT = "TravelSphereStudentProject"


def fetch_match(query: str) -> dict | None:
    request = Request(
        "https://nominatim.openstreetmap.org/search"
        f"?q={quote(query)}&format=jsonv2&limit=1",
        headers={"User-Agent": USER_AGENT},
    )
    with urlopen(request, timeout=20) as response:
        matches = json.load(response)
    if not matches:
        return None
    match = matches[0]
    return {
        "matched_name": match.get("display_name"),
        "lat": float(match["lat"]),
        "lon": float(match["lon"]),
    }


def main() -> None:
    catalog = json.loads(INPUT_PATH.read_text(encoding="utf-8"))
    review = []
    for destination in catalog:
        destination_match = fetch_match(f'{destination["name"]}, {destination["state"]}')
        review.append(
            {
                "type": "destination",
                "slug": destination["slug"],
                "query": f'{destination["name"]}, {destination["state"]}',
                "match": destination_match,
            }
        )
        time.sleep(1)
        for place in destination.get("places", []):
            place_match = fetch_match(f'{place["name"]}, {destination["name"]}, India')
            review.append(
                {
                    "type": "place",
                    "destination": destination["slug"],
                    "name": place["name"],
                    "query": f'{place["name"]}, {destination["name"]}, India',
                    "match": place_match,
                }
            )
            time.sleep(1)
    OUTPUT_PATH.write_text(json.dumps(review, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
