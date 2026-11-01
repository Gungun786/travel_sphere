import json, re, time, urllib.parse, urllib.request
from pathlib import Path

UA = "TravelSphereStudentProject/1.0 (student project; contact: YOUR_EMAIL@example.com)"
OUT = Path("public/destinations")
OUT.mkdir(parents=True, exist_ok=True)

PAGES = {
    "goa": "Goa", "manali": "Manali, Himachal Pradesh", "kerala": "Kerala",
    "jaipur": "Jaipur", "rishikesh": "Rishikesh", "meghalaya": "Meghalaya",
    "udaipur": "Udaipur", "jaisalmer": "Jaisalmer", "agra": "Agra",
    "varanasi": "Varanasi", "shimla": "Shimla", "leh-ladakh": "Ladakh",
    "mussoorie": "Mussoorie", "darjeeling": "Darjeeling", "gangtok": "Gangtok",
    "munnar": "Munnar", "hampi": "Hampi", "pondicherry": "Pondicherry",
    "ooty": "Ooty", "delhi": "Delhi", "amritsar": "Amritsar",
    "andaman": "Andaman and Nicobar Islands",
}

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def lead_image(title):
    q = urllib.parse.urlencode({
        "action": "query", "format": "json", "prop": "pageimages",
        "piprop": "thumbnail|name", "pithumbsize": 1200, "redirects": 1, "titles": title,
    })
    data = get_json("https://en.wikipedia.org/w/api.php?" + q)
    for page in data.get("query", {}).get("pages", {}).values():
        thumb = page.get("thumbnail", {}).get("source")
        name = page.get("pageimage")
        if thumb and name:
            return thumb, name
    return None, None

def credit(file_name):
    q = urllib.parse.urlencode({
        "action": "query", "format": "json", "prop": "imageinfo",
        "iiprop": "extmetadata", "titles": "File:" + file_name,
    })
    data = get_json("https://commons.wikimedia.org/w/api.php?" + q)
    for page in data.get("query", {}).get("pages", {}).values():
        info = (page.get("imageinfo") or [{}])[0].get("extmetadata", {})
        artist = re.sub(r"<[^>]+>", "", info.get("Artist", {}).get("value", "")).strip()
        lic = info.get("LicenseShortName", {}).get("value", "")
        return artist or "Unknown", lic or "Unknown"
    return "Unknown", "Unknown"

def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        path.write_bytes(r.read())

cj = OUT / "credits.json"
credits = json.loads(cj.read_text(encoding="utf-8")) if cj.exists() else {}

for slug, title in PAGES.items():
    target = OUT / f"{slug}.jpg"
    if target.exists():
        print(slug, "exists, skipped")
        continue
    try:
        url, name = lead_image(title)
        if not url:
            print(slug, "NO IMAGE for", title)
            continue
        if not url.lower().split("?")[0].endswith((".jpg", ".jpeg")):
            print(slug, "SKIP not a jpg:", name)
            continue
        download(url, target)
        author, lic = credit(name)
        credits[slug] = {"file": name, "author": author, "license": lic,
                         "source": "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(name)}
        print(slug, "OK", name, "|", lic)
    except Exception as e:
        print(slug, "ERROR", str(e)[:120])
    time.sleep(1.5)

cj.write_text(json.dumps(credits, indent=2, ensure_ascii=False), encoding="utf-8")
lines = ["# Photo credits", "", "Photos from Wikipedia/Wikimedia Commons. Check each licence.", ""]
for slug, c in sorted(credits.items()):
    lines.append(f"- **{slug}**: {c['author']} ({c['license']}), {c['source']}")
(OUT / "CREDITS.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("done:", len(credits), "credits")
