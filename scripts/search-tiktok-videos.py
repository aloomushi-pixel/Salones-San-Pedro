import urllib.request
import re
import urllib.parse

# Search queries
query = "site:tiktok.com wedding decor video"
url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)

req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
)

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        # Find all tiktok video urls like: https://www.tiktok.com/@username/video/1234567890123456789
        # Or encoded equivalents in DuckDuckGo hrefs
        # DuckDuckGo HTML search results contain links like: //duckduckgo.com/l/?uddg=https%3A%2F%2Fwww.tiktok.com%2F%40username%2Fvideo%2F1234567890123456789
        decoded_html = urllib.parse.unquote(html)
        
        # Regex to find video IDs: /video/(\d{15,22})
        video_ids = re.findall(r'/video/(\d{15,22})', decoded_html)
        print("Found video IDs:", list(set(video_ids)))
        
        # Also find username-video combos to make sure they are real
        combos = re.findall(r'tiktok\.com/@[a-zA-Z0-9_\.]+/video/(\d{15,22})', decoded_html)
        print("Found combinations:", list(set(combos)))
except Exception as e:
    print("Error:", str(e))
