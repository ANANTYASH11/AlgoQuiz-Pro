import { NextResponse } from "next/server";
import { DsaDbServer } from "@/lib/db/DsaDbServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Missing username parameter" }, { status: 400 });
    }

    const db = DsaDbServer.getInstance();
    const attempts = db.getAttempts(username);

    return NextResponse.json({ success: true, attempts });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const attemptData = await request.json();

    if (!attemptData.userId || attemptData.score === undefined) {
      return NextResponse.json({ error: "Missing required attempt fields" }, { status: 400 });
    }

    const db = DsaDbServer.getInstance();
    const savedAttempt = db.addAttempt(attemptData);

    // Fetch the updated user payload to return to the frontend
    const updatedUser = db.getUserByUsername(attemptData.userId);

    return NextResponse.json({
      success: true,
      attempt: savedAttempt,
      user: updatedUser
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
