import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import db from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pending = db.prepare(
      "SELECT id FROM data_deletion_requests WHERE user_id = ? AND status = 'PENDING' LIMIT 1"
    ).get(auth.user.userId);
    if (pending) return NextResponse.json({ ok: true, alreadyPending: true });

    db.prepare(`
      INSERT INTO data_deletion_requests (id, user_id, email, status)
      VALUES (?, ?, ?, 'PENDING')
    `).run(randomUUID(), auth.user.userId, auth.user.email);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to record the request." }, { status: 500 });
  }
}
