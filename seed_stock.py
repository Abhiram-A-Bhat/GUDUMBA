import sqlite3
import json

conn = sqlite3.connect('gudumba.db')
c = conn.cursor()

c.execute("""
INSERT OR IGNORE INTO categories (id, slug, name, description, image_url)
VALUES ('cat-bottoms', 'bottoms', 'Heavyweight Cargo & Bottoms', 'Structured Japanese tactical twill and French terry sweats.', '/stock/prod_tactical_cargo_1.jpg')
""")

new_products = [
    {
        'id': 'prod-05',
        'slug': 'gudumba-acid-wash-vintage-oversized-tee',
        'name': 'GUDUMBA® Acid Wash Vintage Heavy Tee',
        'subtitle': 'Distressed Charcoal // Drop 01',
        'tagline': 'Washed by fire. Worn with attitude.',
        'description': '300 GSM vintage enzyme stone-washed cotton. Individual dye characteristics make each garment completely unique. Cut in our signature boxy oversized silhouette with ribbed neckline reinforcement.',
        'price': 2199,
        'compare_at_price': 2899,
        'category_id': 'cat-tees',
        'is_featured': 1,
        'images': ['/stock/prod_vintage_acid_tee_1.jpg', '/stock/prod_vintage_acid_tee_2.jpg'],
        'details': ['300 GSM Enzyme Stone-Washed Cotton', 'Vintage mineral distressed effect', 'Pre-shrunk boxy cut', 'Reinforced collar band'],
        'variants': [('var-5-s', 'S', 12), ('var-5-m', 'M', 20), ('var-5-l', 'L', 35), ('var-5-xl', 'XL', 15)]
    },
    {
        'id': 'prod-06',
        'slug': 'gudumba-tactical-wide-leg-cargo-pant',
        'name': 'GUDUMBA® Japanese Twill Wide-Leg Cargo',
        'subtitle': 'Tactical Noir // Technical Series',
        'tagline': 'Structured geometry for the streets.',
        'description': 'Constructed from 340 GSM heavy Japanese cotton twill. Features 6 deep gusseted 3D utility cargo pockets, articulated knee darts, and adjustable bungee toggles at hem for versatile sneaker draping.',
        'price': 4499,
        'compare_at_price': 5499,
        'category_id': 'cat-bottoms',
        'is_featured': 1,
        'images': ['/stock/prod_tactical_cargo_1.jpg', '/stock/prod_tactical_cargo_2.jpg'],
        'details': ['340 GSM Japanese Cotton Twill', '6 Gusseted 3D Cargo Compartments', 'Articulated knee tailoring', 'Hem bungee cinch cord'],
        'variants': [('var-6-s', '30', 8), ('var-6-m', '32', 18), ('var-6-l', '34', 24), ('var-6-xl', '36', 10)]
    },
    {
        'id': 'prod-07',
        'slug': 'gudumba-monochrome-drop-shoulder-fleece',
        'name': 'GUDUMBA® Core Minimalist Black Fleece',
        'subtitle': 'Obsidian // Essential Heavy',
        'tagline': 'Understated luxury. Maximum presence.',
        'description': '500 GSM heavyweight brushed loopback French terry. Clean seam construction, double-ply structured hood with no drawstrings, and tonal embroidered micro-monogram on forearm.',
        'price': 3899,
        'compare_at_price': 4699,
        'category_id': 'cat-hoodies',
        'is_featured': 1,
        'images': ['/stock/prod_monochrome_hoodie_1.jpg', '/stock/prod_monochrome_hoodie_2.jpg'],
        'details': ['500 GSM Heavyweight Loopback Terry', 'Tonal Gudumba forearm monogram', 'Double-ply structured hood', 'Hidden kangaroo pocket seams'],
        'variants': [('var-7-s', 'S', 10), ('var-7-m', 'M', 25), ('var-7-l', 'L', 30), ('var-7-xl', 'XL', 15)]
    },
    {
        'id': 'prod-08',
        'slug': 'gudumba-utilitarian-tactical-vest',
        'name': 'GUDUMBA® Modular Tactical Combat Vest',
        'subtitle': 'Armour Series // Runway Edition',
        'tagline': 'Utility redefined. Pure attitude.',
        'description': 'Heavy Cordura nylon canvas with waterproof taped inner seams. Features modular molle webbing, gunmetal carabiners, and dual front chest rig pockets.',
        'price': 3999,
        'compare_at_price': 4999,
        'category_id': 'cat-drop1',
        'is_featured': 1,
        'images': ['/stock/prod_cyber_vest_1.jpg', '/stock/prod_cyber_vest_2.jpg'],
        'details': ['Cordura Nylon Canvas', 'Molle modular webbing system', 'Gunmetal industrial hardware', 'Adjustable side compression straps'],
        'variants': [('var-8-s', 'S/M', 14), ('var-8-l', 'L/XL', 20)]
    }
]

for p in new_products:
    c.execute("""
    INSERT OR REPLACE INTO products (id, slug, name, subtitle, tagline, description, price, compare_at_price, category_id, is_featured, is_archived, details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    """, (p['id'], p['slug'], p['name'], p['subtitle'], p['tagline'], p['description'], p['price'], p['compare_at_price'], p['category_id'], p['is_featured'], json.dumps(p['details'])))
    
    for i, img in enumerate(p['images']):
        c.execute("""
        INSERT OR REPLACE INTO product_images (id, product_id, url, alt, display_order)
        VALUES (?, ?, ?, ?, ?)
        """, (f"img-{p['id']}-{i}", p['id'], img, p['name'], i))
        
    for v in p['variants']:
        c.execute("""
        INSERT OR REPLACE INTO product_variants (id, product_id, size, sku, inventory_count)
        VALUES (?, ?, ?, ?, ?)
        """, (v[0], p['id'], v[1], f"{p['slug']}-{v[1]}", v[2]))

conn.commit()
total = c.execute("SELECT COUNT(*) FROM products WHERE is_archived = 0").fetchone()[0]
print(f"Successfully seeded database! Total active products: {total}")
conn.close()
