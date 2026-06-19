#!/usr/bin/env python3
"""
download-thread-attachments.py

Downloads all attachments from a Discord forum channel thread to a local folder.
Authenticates using your Discord token (same session as the web app).

Usage:
    python3 tools/download-thread-attachments.py <channel_id> <output_dir>

Example:
    python3 tools/download-thread-attachments.py 1512120652897718372 assessments/screenshots/spot-a-typo

Token:
    Set DISCORD_TOKEN env var, or paste when prompted.
    To get your token: open Discord in Chrome, open DevTools console, run:
        (()=>{const i=document.createElement('iframe');document.body.appendChild(i);const t=i.contentWindow.localStorage.getItem('token');document.body.removeChild(i);return t.replace(/"/g,'')})()
"""

import os, sys, re, time, json, urllib.request, urllib.error

API = "https://discord.com/api/v9"

def get_token():
    t = os.environ.get("DISCORD_TOKEN", "").strip()
    if not t:
        t = input("Discord token: ").strip().strip('"')
    return t

def api_get(path, token):
    req = urllib.request.Request(f"{API}{path}", headers={"Authorization": token, "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def fetch_all_messages(channel_id, token):
    messages, before = [], None
    while True:
        qs = f"limit=100{'&before='+before if before else ''}"
        batch = api_get(f"/channels/{channel_id}/messages?{qs}", token)
        if not batch:
            break
        messages.extend(batch)
        if len(batch) < 100:
            break
        before = batch[-1]["id"]
        time.sleep(0.3)
    return messages

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")

def download(url, dest, token):
    req = urllib.request.Request(url, headers={"Authorization": token, "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as r, open(dest, "wb") as f:
        f.write(r.read())

def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    channel_id = sys.argv[1]
    out_dir = sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    token = get_token()
    print(f"Fetching messages from channel {channel_id}...")
    messages = fetch_all_messages(channel_id, token)
    with_atts = [m for m in messages if m.get("attachments")]
    print(f"Found {len(messages)} messages, {len(with_atts)} with attachments")

    counters = {}
    results = []
    for m in with_atts:
        author = m["author"]["username"]
        date = m["timestamp"][:10]
        for att in m["attachments"]:
            ext = att["filename"].rsplit(".", 1)[-1].lower() if "." in att["filename"] else "bin"
            key = f"{author}_{date}"
            counters[key] = counters.get(key, 0) + 1
            filename = f"{slugify(author)}_{date}_{counters[key]}.{ext}"
            dest = os.path.join(out_dir, filename)
            try:
                download(att["url"], dest, token)
                print(f"  ✓ {filename}")
                results.append({"author": author, "date": date, "original": att["filename"], "saved_as": filename})
            except urllib.error.HTTPError as e:
                print(f"  ✗ {att['filename']}: HTTP {e.code}")
            except Exception as e:
                print(f"  ✗ {att['filename']}: {e}")
            time.sleep(0.2)

    # Write a manifest for reference
    manifest_path = os.path.join(out_dir, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nDone. {len(results)} files saved to {out_dir}/")
    print(f"Manifest written to {manifest_path}")

if __name__ == "__main__":
    main()
