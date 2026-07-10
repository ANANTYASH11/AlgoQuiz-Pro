import { NextResponse } from "next/server";
import { DsaDbServer } from "@/lib/db/DsaDbServer";

export async function POST(request: Request) {
  try {
    const { username, email, password, avatar } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields (username, email, password)" },
        { status: 400 }
      );
    }

    const db = DsaDbServer.getInstance();

    // Check custom HashMap indexes
    if (db.getUserByEmail(email)) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    if (db.getUserByUsername(username)) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Create user in DSA database
    const newUser = db.createUser({
      username,
      email,
      password,
      avatar: avatar || "👨‍💻",
    });

    if (!newUser) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Return user details and JWT mock
    return NextResponse.json({
      success: true,
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tokenFor_" + newUser.username,
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        level: newUser.level,
        xp: newUser.xp,
        coins: newUser.coins,
        streak: newUser.streak,
        lastActive: newUser.lastActive,
        rank: newUser.rank,
        accuracy: newUser.accuracy,
        weakSubjects: newUser.weakSubjects,
        strongSubjects: newUser.strongSubjects,
        badges: newUser.badges,
        bookmarks: newUser.bookmarks,
        favoriteQuestions: newUser.favoriteQuestions,
        dailyRewardsClaimed: newUser.dailyRewardsClaimed
      }
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
