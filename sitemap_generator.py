import os
import json
import subprocess
import sys
from datetime import datetime
from urllib.parse import quote  # Added for fixing spaces in URLs

# --- CONFIGURATION ---
SETTINGS_FILE = '_cms/settings.json'
OUTPUT_FILE = 'sitemap.xml'
EXCLUDE_DIRS = {'.git', '.github', '_cms', 'admin', 'assets', 'css', 'js', 'images'}
EXCLUDE_FILES = {'404.html', 'google', 'yandex', 'CNAME'} 

def get_site_url():
    default_url = "https://example.com"
    if not os.path.exists(SETTINGS_FILE):
        return default_url
    try:
        with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            url = data.get('siteUrl', default_url)
            return url.rstrip('/')
    except:
        return default_url

def get_last_modified_date(filepath):
    try:
        # Get ISO date from git
        cmd = ['git', 'log', '-1', '--format=%cI', filepath]
        date_str = subprocess.check_output(cmd, stderr=subprocess.STDOUT).decode('utf-8').strip()
        
        if not date_str:
            return datetime.now().strftime('%Y-%m-%d')
            
        # Parse the ISO string and convert to YYYY-MM-DD
        # Handling the timezone part explicitly to be safe
        dt = datetime.fromisoformat(date_str)
        return dt.strftime('%Y-%m-%d')
    except Exception:
        return datetime.now().strftime('%Y-%m-%d')

def generate_sitemap():
    base_url = get_site_url()
    print(f"Generating sitemap for: {base_url}")
    
    urls = []
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if file == 'index.html':
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(root, '.')
                
                if rel_path.startswith('admin') or rel_path.startswith('_cms'):
                    continue

                if rel_path == '.':
                    loc = f"{base_url}/"
                    priority = "1.0"
                else:
                    # FIX: Replace OS separator with slash AND Encode special chars/spaces
                    # 'La Liga' becomes 'La%20Liga'
                    raw_slug = rel_path.replace(os.sep, '/')
                    safe_slug = quote(raw_slug) 
                    loc = f"{base_url}/{safe_slug}/"
                    priority = "0.8" if 'blog' in safe_slug else "0.9"

                if any(x in loc for x in EXCLUDE_FILES):
                    continue

                lastmod = get_last_modified_date(file_path)
                
                urls.append({
                    'loc': loc,
                    'lastmod': lastmod,
                    'priority': priority
                })

    # XML Construction
    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    for entry in urls:
        xml.append('  <url>')
        xml.append(f'    <loc>{entry["loc"]}</loc>')
        xml.append(f'    <lastmod>{entry["lastmod"]}</lastmod>')
        xml.append('    <changefreq>weekly</changefreq>')
        xml.append(f'    <priority>{entry["priority"]}</priority>')
        xml.append('  </url>')
    
    xml.append('</urlset>')
    
    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write('\n'.join(xml))
        print(f"SUCCESS: Generated {OUTPUT_FILE} with {len(urls)} URLs.")
    except Exception as e:
        print(f"FATAL: Could not write sitemap ({e})")
        sys.exit(1)

if __name__ == "__main__":
    generate_sitemap()
