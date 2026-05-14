#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.error

COOLIFY_URL = os.environ.get("COOLIFY_URL", "").rstrip("/")
COOLIFY_TOKEN = os.environ.get("COOLIFY_TOKEN", "")


def list_projects():
    if not COOLIFY_URL or not COOLIFY_TOKEN:
        print("Erreur: COOLIFY_URL et COOLIFY_TOKEN doivent être définis.")
        return

    url = f"{COOLIFY_URL}/api/v1/projects"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {COOLIFY_TOKEN}"})

    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Erreur HTTP {e.code}: {e.reason}")
        return
    except urllib.error.URLError as e:
        print(f"Erreur de connexion: {e.reason}")
        return

    if not data:
        print("Aucun projet trouvé.")
        return

    print(f"{'ID':<10} {'Nom':<30} {'Description'}")
    print("-" * 70)
    for project in data:
        pid = project.get("id", "")
        name = project.get("name", "")
        description = project.get("description", "") or ""
        print(f"{str(pid):<10} {name:<30} {description}")


if __name__ == "__main__":
    list_projects()
