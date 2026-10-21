import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'gudumba.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance and concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      name TEXT,
      password_hash TEXT,
      role TEXT DEFAULT 'customer', -- 'customer' | 'admin'
      is_phone_verified INTEGER DEFAULT 0,
      avatar_url TEXT,
      marketing_consent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE,
      name TEXT NOT NULL,
      subtitle TEXT,
      tagline TEXT,
      description TEXT,
      price REAL NOT NULL,
      compare_at_price REAL,
      category_id TEXT,
      is_featured INTEGER DEFAULT 0,
      is_archived INTEGER DEFAULT 0,
      details TEXT, -- JSON string of bullet points / features
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      url TEXT NOT NULL,
      alt TEXT,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      size TEXT NOT NULL, -- S, M, L, XL, XXL, OVERSIZED
      color TEXT DEFAULT 'Midnight Noir',
      sku TEXT UNIQUE,
      inventory_count INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL, -- JSON formatted shipping details
      subtotal REAL NOT NULL,
      shipping_fee REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_method TEXT DEFAULT 'PAYTM',
      payment_status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
      fulfillment_status TEXT DEFAULT 'UNFULFILLED', -- UNFULFILLED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
      paytm_txnid TEXT,
      paytm_order_id TEXT,
      refund_status TEXT DEFAULT 'NONE', -- NONE, REQUESTED, APPROVED, REJECTED, REFUNDED
      cancellation_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      product_name TEXT NOT NULL,
      size TEXT,
      color TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS marketing_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      source TEXT DEFAULT 'website_footer',
      consent_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1,
      unsubscribed_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cookie_consents (
      id TEXT PRIMARY KEY,
      visitor_id TEXT NOT NULL,
      necessary INTEGER DEFAULT 1,
      analytics INTEGER DEFAULT 0,
      marketing INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS data_deletion_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSED, REJECTED
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      processed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS auth_rate_limits (
      rate_key TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL,
      window_started_at INTEGER NOT NULL
    );
  `);

  seedInitialData();
}

export function consumeRateLimit(rateKey: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  return db.transaction(() => {
    const row = db.prepare("SELECT attempts, window_started_at FROM auth_rate_limits WHERE rate_key = ?")
      .get(rateKey) as { attempts: number; window_started_at: number } | undefined;
    if (!row || now - row.window_started_at >= windowMs) {
      db.prepare(`INSERT INTO auth_rate_limits (rate_key, attempts, window_started_at) VALUES (?, 1, ?)
        ON CONFLICT(rate_key) DO UPDATE SET attempts = 1, window_started_at = excluded.window_started_at`)
        .run(rateKey, now);
      return true;
    }
    if (row.attempts >= limit) return false;
    db.prepare("UPDATE auth_rate_limits SET attempts = attempts + 1 WHERE rate_key = ?").run(rateKey);
    return true;
  })();
}

function seedInitialData() {
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count > 0) return;

  console.log('Seeding unverified sample catalogue. Confirm product copy, pricing, and stock before launch.');

  // Categories
  const insertCat = db.prepare('INSERT OR IGNORE INTO categories (id, slug, name, description, image_url) VALUES (?, ?, ?, ?, ?)');
  insertCat.run('cat-drop1', 'drop-01-chaos', 'Drop 01: Chaos & Character', 'Raw silhouettes, heavyweight cotton, unapologetic attitude.', '/brand/brand_asset_3.jpeg');
  insertCat.run('cat-tees', 'tees', 'Heavyweight Graphic Tees', 'Custom cut-and-sew heavyweight drop-shoulder streetwear tees.', '/brand/brand_asset_4.jpeg');
  insertCat.run('cat-hoodies', 'hoodies', 'Oversized Outerwear', 'Uncompromised fleece hoodies engineered for chilly streets and late nights.', '/brand/brand_asset_7.jpeg');

  // Products from uploaded assets
  const products = [
    {
      id: 'prod-01',
      slug: 'gudumba-chaos-drop-tee-black',
      name: 'GUDUMBA® Chaos & Character Heavyweight Tee',
      subtitle: 'Limited Drop 01 • Midnight Noir',
      tagline: 'A little chaos. A lot of character. Everyday streetwear.',
      description: 'Engineered with 280 GSM premium French terry combed cotton. Features the signature Gudumba insignia emblazoned in high-density puff print across the spine and minimalist chest emblem. Cut in an oversized, relaxed silhouette tailored for those who refuse to blend in.',
      price: 1899,
      compare_at_price: 2499,
      category_id: 'cat-tees',
      is_featured: 1,
      details: JSON.stringify([
        '280 GSM 100% Combed Compact Cotton',
        'High-density screen + puff screen print',
        'Drop-shoulder boxy oversized cut',
        'Ribbed crewneck collar with reinforced tape',
        'Pre-shrunk fabric to prevent post-wash deformation',
        'Custom woven Gudumba interior label'
      ]),
      images: [
        '/brand/brand_asset_3.jpeg',
        '/brand/brand_asset_8.jpeg',
        '/brand/brand_asset_0.jpeg'
      ],
      variants: [
        { id: 'var-1-s', size: 'S', inventory: 15 },
        { id: 'var-1-m', size: 'M', inventory: 25 },
        { id: 'var-1-l', size: 'L', inventory: 40 },
        { id: 'var-1-xl', size: 'XL', inventory: 20 },
        { id: 'var-1-xxl', size: 'XXL', inventory: 10 }
      ]
    },
    {
      id: 'prod-02',
      slug: 'gudumba-stay-strange-oversized-tee-white',
      name: 'GUDUMBA® Stay Strange Streetwear Tee',
      subtitle: 'Editorial White • Raw Cut',
      tagline: 'For the ones who don\'t blend in. Stay strange. Stay iconic.',
      description: 'Cut from premium 260 GSM organic milk cotton, this piece showcases the distinctive Gudumba industrial emblem. Built to make statements from Mumbai to London.',
      price: 1799,
      compare_at_price: 2299,
      category_id: 'cat-tees',
      is_featured: 1,
      details: JSON.stringify([
        '260 GSM Organic Milk Cotton',
        'Distressed typography graphic backprint',
        'Oversized drop-shoulder aesthetic',
        'Double-needle stitching throughout',
        'Anti-pilling wash finish'
      ]),
      images: [
        '/brand/brand_asset_7.jpeg',
        '/brand/brand_asset_9.jpeg'
      ],
      variants: [
        { id: 'var-2-s', size: 'S', inventory: 12 },
        { id: 'var-2-m', size: 'M', inventory: 30 },
        { id: 'var-2-l', size: 'L', inventory: 35 },
        { id: 'var-2-xl', size: 'XL', inventory: 18 }
      ]
    },
    {
      id: 'prod-03',
      slug: 'gudumba-unapologetic-terry-hoodie-rust',
      name: 'GUDUMBA® Unapologetic Heavy Hoodie',
      subtitle: 'Earth & Rust Series',
      tagline: 'Born Different. Stay Unapologetic.',
      description: '450 GSM ultra-heavyweight brushed French terry cotton. Heavy metal hardware, double-lined deep hood, and seamless kangaroo pocket with concealed headphone port.',
      price: 3499,
      compare_at_price: 4299,
      category_id: 'cat-hoodies',
      is_featured: 1,
      details: JSON.stringify([
        '450 GSM Heavy French Terry Cotton',
        'Double-layered structured hood (no drawstrings for clean silhouette)',
        'Raglan sleeves with raw seam accents',
        'Ribbed cuffs and waistband with 5% elastane memory retention'
      ]),
      images: [
        '/brand/brand_asset_4.jpeg',
        '/brand/brand_asset_5.jpeg'
      ],
      variants: [
        { id: 'var-3-m', size: 'M', inventory: 15 },
        { id: 'var-3-l', size: 'L', inventory: 25 },
        { id: 'var-3-xl', size: 'XL', inventory: 20 }
      ]
    },
    {
      id: 'prod-04',
      slug: 'gudumba-editorial-campaign-bomber',
      name: 'GUDUMBA® No Rules Reversible Bomber Jacket',
      subtitle: 'Exclusive Runway Edition',
      tagline: 'No rules. No repeats. Just pure attitude.',
      description: 'Structured tactical nylon shell with custom quilted inner orange lining. Features heavy-gauge gunmetal zippers, utility arm sleeve pocket, and custom embroidered back crest.',
      price: 5299,
      compare_at_price: 6999,
      category_id: 'cat-drop1',
      is_featured: 1,
      details: JSON.stringify([
        'High-density water-resistant technical flight nylon',
        'Reversible safety-orange insulated diamond-quilted lining',
        'Heavy-duty YKK matte black zippers',
        'Custom woven Gudumba flight tag puller'
      ]),
      images: [
        '/brand/brand_asset_2.jpeg',
        '/brand/brand_asset_6.jpeg'
      ],
      variants: [
        { id: 'var-4-s', size: 'S', inventory: 5 },
        { id: 'var-4-m', size: 'M', inventory: 14 },
        { id: 'var-4-l', size: 'L', inventory: 16 },
        { id: 'var-4-xl', size: 'XL', inventory: 8 }
      ]
    }
  ];

  const insertProd = db.prepare(`
    INSERT INTO products (id, slug, name, subtitle, tagline, description, price, compare_at_price, category_id, is_featured, details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertImg = db.prepare(`
    INSERT INTO product_images (id, product_id, url, alt, display_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertVar = db.prepare(`
    INSERT INTO product_variants (id, product_id, size, sku, inventory_count)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const prod of products) {
    insertProd.run(
      prod.id,
      prod.slug,
      prod.name,
      prod.subtitle,
      prod.tagline,
      prod.description,
      prod.price,
      prod.compare_at_price,
      prod.category_id,
      prod.is_featured,
      prod.details
    );

    prod.images.forEach((imgUrl, i) => {
      insertImg.run(`img-${prod.id}-${i}`, prod.id, imgUrl, prod.name, i);
    });

    prod.variants.forEach((v) => {
      insertVar.run(v.id, prod.id, v.size, `${prod.slug}-${v.size}`, v.inventory);
    });
  }

  console.log('Sample catalogue initialized. No administrator account is created by default.');
}

// Auto-run init on import
initDb();

export default db;
