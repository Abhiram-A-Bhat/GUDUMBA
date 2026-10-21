import sqlite3
import json

conn = sqlite3.connect('gudumba.db')
c = conn.cursor()

with open('seed_products.sql', 'w', encoding='utf-8') as out:
    out.write('-- ==========================================\n')
    out.write('-- GUDUMBA® PRODUCTS SEED FOR SUPABASE\n')
    out.write('-- ==========================================\n\n')
    
    products = c.execute('SELECT id, slug, name, subtitle, tagline, description, price, compare_at_price, category_id, is_featured, is_archived, details FROM products').fetchall()
    for p in products:
        details_str = p[11].replace("'", "''") if p[11] else '[]'
        desc = p[5].replace("'", "''") if p[5] else ''
        name = p[2].replace("'", "''")
        sub = p[3].replace("'", "''") if p[3] else ''
        tag = p[4].replace("'", "''") if p[4] else ''
        comp = p[7] if p[7] else 'NULL'
        out.write(f"INSERT INTO public.products (id, slug, name, subtitle, tagline, description, price, compare_at_price, category_id, is_featured, is_archived, details) VALUES ('{p[0]}', '{p[1]}', '{name}', '{sub}', '{tag}', '{desc}', {p[6]}, {comp}, '{p[8]}', {str(bool(p[9])).lower()}, {str(bool(p[10])).lower()}, '{details_str}'::jsonb) ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price;\n")
    
    out.write('\n-- PRODUCT IMAGES\n')
    images = c.execute('SELECT id, product_id, url, alt, display_order FROM product_images').fetchall()
    for img in images:
        alt = img[3].replace("'", "''") if img[3] else ''
        out.write(f"INSERT INTO public.product_images (id, product_id, url, alt, display_order) VALUES ('{img[0]}', '{img[1]}', '{img[2]}', '{alt}', {img[4]}) ON CONFLICT (id) DO NOTHING;\n")
        
    out.write('\n-- PRODUCT VARIANTS\n')
    variants = c.execute('SELECT id, product_id, size, color, sku, inventory_count FROM product_variants').fetchall()
    for v in variants:
        out.write(f"INSERT INTO public.product_variants (id, product_id, size, color, sku, inventory_count) VALUES ('{v[0]}', '{v[1]}', '{v[2]}', '{v[3]}', '{v[4]}', {v[5]}) ON CONFLICT (id) DO NOTHING;\n")

conn.close()
print("seed_products.sql generated successfully!")
