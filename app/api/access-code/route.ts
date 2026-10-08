import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "notsan_code_access";
const SESSION_MARKER = "notsan-code-session-v1";

function toBase64Url(bytes: ArrayBuffer) {
  return Buffer.from(bytes).toString("base64url");
}

async function digest(value: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
}

async function sessionValue(secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(SESSION_MARKER)));
}

function equalBytes(left: ArrayBuffer, right: ArrayBuffer) {
  const a = new Uint8Array(left);
  const b = new Uint8Array(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

export async function GET(request: NextRequest) {
  const secret = process.env.ACCESS_CODE;
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!secret || !cookie || cookie !== await sessionValue(secret)) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const secret = process.env.ACCESS_CODE;
  if (!secret) return NextResponse.json({ error: "Zugangscode ist nicht konfiguriert." }, { status: 503 });
  const body = await request.json().catch(() => null) as { code?: unknown } | null;
  const submitted = typeof body?.code === "string" ? body.code.trim() : "";
  if (!equalBytes(await digest(submitted), await digest(secret))) return NextResponse.json({ error: "Der Zugangscode ist nicht korrekt." }, { status: 401 });

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(COOKIE_NAME, await sessionValue(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
