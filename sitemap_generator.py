import os
import json
import subprocess
import sys
from datetime import datetime

# --- CONFIGURATION ---
SETTINGS_FILE = '_cms/settings.json'
OUTPUT_FILE = 'sitemap.xml'
EXCLUDE_DIRS = {'.git', '.github', '_cms', 'admin', 'assets', 'css', 'js', 'images'}
EXCLUDE_FILES = {'404.html', 'google', 'yandex'} 

def get_site_url():
    """Reads the site URL from the CMS settings file."""
    default_url = "https://example.com"
    if not os.path.exists(SETTINGS_FILE):
        print(f"DEBUG: {SETTINGS_FILE} not found. Using default URL.")
        return default_url
    
    try:
        with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            url = data.get('siteUrl', default_url)
            return url.rstrip('/')
    except Exception as e:
        print(f"DEBUG: Error reading settings ({e}). Using default URL.")
        return default_url

def get_last_modified_date(filepath):
    """Gets the last commit date. Returns formatted date or fallback."""
    try:
        # Run git log command
        cmd = ['git', 'log', '-1', '--format=%cI', filepath]
        date_str = subprocess.check_output(cmd, stderr=subprocess.STDOUT).decode('utf-8').strip()
        
        # If file is new and staged but not committed, git log returns empty
        if not date_str:
            return datetime.now().strftime('%Y-%m-%dT%H:%M:%S+00:00')
        return date_str
    except Exception as e:
        # Fallback to current time if git fails
        # This prevents the script from crashing on new files
        return datetime.now().strftime('%Y-%m-%dT%H:%M:%S+00:00')

def generate_sitemap():
    base_url = get_site_url()
    print(f"Generating sitemap for: {base_url}")
    
    urls = []
    
    for root, dirs, files in os.walk('.'):
        # Prevent walking into excluded dirs
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if file == 'index.html':
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(root, '.')
                
                # Double check exclusions
                if rel_path.startswith('admin') or rel_path.startswith('_cms'):
                    continue

                # Build URL
                if rel_path == '.':
                    loc = f"{base_url}/"
                    priority = "1.0"
                else:
                    path_slug = rel_path.replace(os.sep, '/')
                    loc = f"{base_url}/{path_slug}/"
                    priority = "0.8" if 'blog' in path_slug else "0.9"

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
