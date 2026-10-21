import Database from "better-sqlite3";
import path from "node:path";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run admin:promote -- customer@example.com");
  process.exit(2);
}

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "gudumba.db");
const db = new Database(dbPath);
try {
  const result = db.prepare("UPDATE users SET role = 'admin', updated_at = CURRENT_TIMESTAMP WHERE email = ?").run(email);
  if (result.changes !== 1) {
    console.error("No account matched that email. Create the account first, then run this command again.");
    process.exitCode = 1;
  } else {
    console.log(`Administrator role assigned to ${email}.`);
  }
} finally {
  db.close();
}
