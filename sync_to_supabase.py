import sqlite3
import urllib.request
import json

SUPABASE_URL = "https://cizgoweprznlgpnxxrpl.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpemdvd2VwcnpubGdwbnh4cnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2MDEzMDksImV4cCI6MjEwODE3NzMwOX0.naj1Fzz_9kEn4JH47stZrD-JfwaAIvsKfxWqtbBY4ik"

headers = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def post_supabase(endpoint, payload):
    req = urllib.request.Request(
        f"{SUPABASE_URL}/{endpoint}",
        data=json.dumps(payload).encode(),
        headers=headers,
        method="POST"
    )
    return urllib.request.urlopen(req)

# Read from local SQLite
conn = sqlite3.connect("gudumba.db")
c = conn.cursor()

# 1. Sync Products
products = c.execute("SELECT id, slug, name, subtitle, tagline, description, price, compare_at_price, category_id, is_featured, is_archived, details FROM products").fetchall()
product_payload = []
for p in products:
    product_payload.append({
        "id": p[0],
        "slug": p[1],
        "name": p[2],
        "subtitle": p[3],
        "tagline": p[4],
        "description": p[5],
        "price": p[6],
        "compare_at_price": p[7],
        "category_id": p[8],
        "is_featured": bool(p[9]),
        "is_archived": bool(p[10]),
        "details": json.loads(p[11]) if p[11] else []
    })

post_supabase("products", product_payload)
print(f"Synced {len(product_payload)} products to Supabase!")

# 2. Sync Images
images = c.execute("SELECT id, product_id, url, alt, display_order FROM product_images").fetchall()
img_payload = [{ "id": img[0], "product_id": img[1], "url": img[2], "alt": img[3], "display_order": img[4] } for img in images]
post_supabase("product_images", img_payload)
print(f"Synced {len(img_payload)} images to Supabase!")

# 3. Sync Variants
variants = c.execute("SELECT id, product_id, size, color, sku, inventory_count FROM product_variants").fetchall()
var_payload = [{ "id": v[0], "product_id": v[1], "size": v[2], "color": v[3], "sku": v[4], "inventory_count": v[5] } for v in variants]
post_supabase("product_variants", var_payload)
print(f"Synced {len(var_payload)} variants to Supabase!")

conn.close()
