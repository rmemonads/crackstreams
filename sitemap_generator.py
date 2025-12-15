import os
import json
import subprocess
from datetime import datetime

# --- CONFIGURATION ---
SETTINGS_FILE = '_cms/settings.json'
OUTPUT_FILE = 'sitemap.xml'
# Folders to exclude from the sitemap
EXCLUDE_DIRS = {'.git', '.github', '_cms', 'admin', 'assets', 'css', 'js', 'images'}
# Specific files to exclude
EXCLUDE_FILES = {'404.html', 'google', 'yandex'} # Fragments of filenames to ignore

def get_site_url():
    """Reads the site URL from the CMS settings file."""
    try:
        if os.path.exists(SETTINGS_FILE):
            with open(SETTINGS_FILE, 'r') as f:
                data = json.load(f)
                url = data.get('siteUrl', '')
                # Remove trailing slash if present
                if url.endswith('/'):
                    url = url[:-1]
                return url
    except Exception as e:
        print(f"Error reading settings: {e}")
    
    # Fallback if settings don't exist (Replace with your actual default if needed)
    return "https://example.com" 

def get_last_modified_date(filepath):
    """Gets the last commit date for a file from Git history."""
    try:
        # git log -1 --format=%cI returns ISO 8601 date (e.g., 2023-10-27T10:00:00+00:00)
        date_str = subprocess.check_output(
            ['git', 'log', '-1', '--format=%cI', filepath]
        ).decode('utf-8').strip()
        
        if not date_str:
            # Fallback for new files not yet committed (use current time)
            return datetime.now().strftime('%Y-%m-%dT%H:%M:%S+00:00')
        return date_str
    except Exception:
        return datetime.now().strftime('%Y-%m-%dT%H:%M:%S+00:00')

def generate_sitemap():
    base_url = get_site_url()
    print(f"Generating sitemap for: {base_url}")
    
    urls = []
    
    # Walk through the directory
    for root, dirs, files in os.walk('.'):
        # Modify dirs in-place to skip excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for file in files:
            if file == 'index.html':
                # Build the file path
                file_path = os.path.join(root, file)
                
                # relative path logic
                rel_path = os.path.relpath(root, '.')
                
                # Skip the admin panel or cms internal folders if missed by dir exclusion
                if rel_path.startswith('admin') or rel_path.startswith('_cms'):
                    continue

                # Construct the live URL
                if rel_path == '.':
                    # Homepage
                    loc = f"{base_url}/"
                    priority = "1.0"
                else:
                    # Pages and Posts (e.g., blog/my-post)
                    # Use forward slashes for URLs regardless of OS
                    path_slug = rel_path.replace(os.sep, '/')
                    loc = f"{base_url}/{path_slug}/"
                    priority = "0.8" if 'blog' in path_slug else "0.9"

                # Check specific file exclusions
                if any(x in loc for x in EXCLUDE_FILES):
                    continue

                # Get accurate Git modification date
                lastmod = get_last_modified_date(file_path)
                
                urls.append({
                    'loc': loc,
                    'lastmod': lastmod,
                    'priority': priority
                })

    # Generate XML Content
    xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    for entry in urls:
        xml_content.append('  <url>')
        xml_content.append(f'    <loc>{entry["loc"]}</loc>')
        xml_content.append(f'    <lastmod>{entry["lastmod"]}</lastmod>')
        xml_content.append(f'    <changefreq>weekly</changefreq>')
        xml_content.append(f'    <priority>{entry["priority"]}</priority>')
        xml_content.append('  </url>')
    
    xml_content.append('</urlset>')
    
    # Write to file
    with open(OUTPUT_FILE, 'w') as f:
        f.write('\n'.join(xml_content))
    
    print(f"Sitemap generated with {len(urls)} URLs.")

if __name__ == "__main__":
    generate_sitemap()
