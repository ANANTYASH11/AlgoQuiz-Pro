import { NextResponse } from "next/server";
import { DsaDbServer } from "@/lib/db/DsaDbServer";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields (email, password)" },
        { status: 400 }
      );
    }

    const db = DsaDbServer.getInstance();
    
    // Look up in O(1) from custom HashMap
    const user = db.getUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return user details and JWT mock
    return NextResponse.json({
      success: true,
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tokenFor_" + user.username,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        streak: user.streak,
        lastActive: user.lastActive,
        rank: user.rank,
        accuracy: user.accuracy,
        weakSubjects: user.weakSubjects,
        strongSubjects: user.strongSubjects,
        badges: user.badges,
        bookmarks: user.bookmarks,
        favoriteQuestions: user.favoriteQuestions,
        dailyRewardsClaimed: user.dailyRewardsClaimed
      }
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
