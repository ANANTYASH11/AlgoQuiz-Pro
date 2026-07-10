import { NextResponse } from "next/server";
import { DsaDbServer } from "@/lib/db/DsaDbServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const tag = searchParams.get("tag");

    const db = DsaDbServer.getInstance();
    let questions = db.getQuestions();

    if (subject) {
      questions = questions.filter(
        q => q.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    if (tag) {
      // Execute O(L) tag prefix search on custom Trie index
      questions = db.searchQuestionsByTag(tag);
    }

    return NextResponse.json({ success: true, questions });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
