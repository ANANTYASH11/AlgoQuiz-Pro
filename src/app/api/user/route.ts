import { NextResponse } from "next/server";
import { DsaDbServer } from "@/lib/db/DsaDbServer";

export async function PUT(request: Request) {
  try {
    const { username, updates } = await request.json();

    if (!username || !updates) {
      return NextResponse.json({ error: "Missing username or updates" }, { status: 400 });
    }

    const db = DsaDbServer.getInstance();
    const updatedUser = db.updateUser(username, updates);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        level: updatedUser.level,
        xp: updatedUser.xp,
        coins: updatedUser.coins,
        streak: updatedUser.streak,
        lastActive: updatedUser.lastActive,
        rank: updatedUser.rank,
        accuracy: updatedUser.accuracy,
        weakSubjects: updatedUser.weakSubjects,
        strongSubjects: updatedUser.strongSubjects,
        badges: updatedUser.badges,
        bookmarks: updatedUser.bookmarks,
        favoriteQuestions: updatedUser.favoriteQuestions,
        dailyRewardsClaimed: updatedUser.dailyRewardsClaimed
      }
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
