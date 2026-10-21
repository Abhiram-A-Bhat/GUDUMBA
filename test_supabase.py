import urllib.request
import json

url = 'https://cizgoweprznlgpnxxrpl.supabase.co/rest/v1/categories?select=*'
headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpemdvd2VwcnpubGdwbnh4cnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MDEzMDksImV4cCI6MjEwODE3NzMwOX0.naj1Fzz_9kEn4JH47stZrD-JfwaAIvsKfxWqtbBY4ik',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpemdvd2VwcnpubGdwbnh4cnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MDEzMDksImV4cCI6MjEwODE3NzMwOX0.naj1Fzz_9kEn4JH47stZrD-JfwaAIvsKfxWqtbBY4ik'
}

req = urllib.request.Request(url, headers=headers)
try:
    res = urllib.request.urlopen(req)
    data = json.loads(res.read().decode())
    print('Supabase connection verified! Categories count in DB:', len(data))
    for c in data:
        print(f"- {c['name']} ({c['slug']})")
except Exception as e:
    print('Error connecting to Supabase:', e)
