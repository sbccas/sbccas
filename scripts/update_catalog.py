#!/usr/bin/env python3
"""
SBCCAS Automated Repository Catalog Updater
Discovers all public repositories from the GitHub API, merges with existing
academic course mappings, and updates data/repositories.json and website/data/repositories.json.
"""

import json
import os
import sys
import urllib.request
import urllib.error

USER_AGENT = "SBCCAS-Catalog-Updater/1.0"
API_URL = "https://api.github.com/users/sbccas/repos?per_page=100&page="

def fetch_all_repos():
    repos = []
    page = 1
    has_more = True

    while has_more and page <= 10:
        url = f"{API_URL}{page}"
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/vnd.github.v3+json"})
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if not data or not isinstance(data, list):
                    has_more = False
                else:
                    repos.extend(data)
                    if len(data) < 100:
                        has_more = False
                    else:
                        page += 1
        except urllib.error.HTTPError as e:
            print(f"GitHub API Error: {e.code} - {e.reason}", file=sys.stderr)
            break
        except Exception as e:
            print(f"Error fetching page {page}: {e}", file=sys.stderr)
            break

    return repos

def load_existing_catalog(filepath):
    if not os.path.exists(filepath):
        return {}
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            return {item["name"].lower(): item for item in data if isinstance(item, dict) and "name" in item}
    except Exception as e:
        print(f"Error loading {filepath}: {e}", file=sys.stderr)
        return {}

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_paths = [
        os.path.join(base_dir, "data", "repositories.json"),
        os.path.join(base_dir, "website", "data", "repositories.json")
    ]

    existing_catalog = load_existing_catalog(target_paths[0])
    raw_repos = fetch_all_repos()

    if not raw_repos:
        print("No repositories retrieved from API. Skipping update.")
        sys.exit(0)

    print(f"Discovered {len(raw_repos)} repositories from GitHub API.")

    updated_catalog = []
    for r in raw_repos:
        name = r.get("name", "")
        if not name:
            continue
        key = name.lower()
        existing = existing_catalog.get(key, {})

        # Merge technologies without duplicates
        tech_set = set(existing.get("technologies", []))
        if r.get("language"):
            tech_set.add(r["language"])
        for topic in r.get("topics", []):
            tech_set.add(topic)

        entry = {
            "name": name,
            "url": r.get("html_url") or existing.get("url") or f"https://github.com/sbccas/{name}",
            "description": r.get("description") or existing.get("description") or "Verified academic repository in the SBCCAS ecosystem.",
            "category": existing.get("category") or "General",
            "courses": existing.get("courses") or ["BCA", "BCA - AI", "B.Sc. Data Science & Analytics", "B.Sc. IT"],
            "technologies": sorted(list(tech_set)),
            "featured": existing.get("featured", False),
            "level": existing.get("level") or "All Levels",
            "status": "archived" if r.get("archived") else "active"
        }
        updated_catalog.append(entry)

    # Sort catalog alphabetically
    updated_catalog.sort(key=lambda x: x["name"].lower())
    new_json_str = json.dumps(updated_catalog, indent=2, ensure_ascii=False) + "\n"

    changed = False
    for p in target_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        old_content = ""
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                old_content = f.read()

        if old_content != new_json_str:
            with open(p, "w", encoding="utf-8") as f:
                f.write(new_json_str)
            changed = True
            print(f"Updated {p}")

    if changed:
        print("Catalog files updated successfully.")
    else:
        print("Catalog is already up to date.")

if __name__ == "__main__":
    main()
