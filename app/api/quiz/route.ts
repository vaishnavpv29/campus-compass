import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import College from "@/models/College";
import QuizResult from "@/models/QuizResult";
import { scoreCollege } from "@/lib/quizMatcher";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const answers = await req.json();

    await dbConnect();

    // Fetch all approved colleges
    const colleges = await College.find({ isApproved: true, isActive: true }).lean();

    // Score all colleges
    const scored = colleges
      .map((college) => {
        const { score, reasons } = scoreCollege(college, answers);
        return {
          college,
          score,
          reasons,
          matchPercentage: Math.max(Math.min(Math.round((score / 100) * 100), 99), 30),
        };
      })
      .filter((c) => c.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const matchedColleges = scored.map((s) => ({
      college: {
        _id: (s.college as any)._id,
        name: s.college.name,
        slug: s.college.slug,
        logo: s.college.logo,
        location: s.college.location,
        type: s.college.type,
        nirfRanking: s.college.nirfRanking,
        avgRating: s.college.avgRating,
        averagePackage: s.college.averagePackage,
        naacGrade: s.college.naacGrade,
      },
      matchPercentage: s.matchPercentage,
      matchReasons: s.reasons.slice(0, 3),
    }));

    // Save quiz result
    const sessionId = randomUUID();
    
    const quizResult = await QuizResult.create({
      user: session?.user?.id,
      sessionId,
      answers,
      matchedColleges: matchedColleges.map((m) => ({
        college: m.college._id,
        matchPercentage: m.matchPercentage,
      })),
    });

    return NextResponse.json({ results: matchedColleges, quizResultId: quizResult._id });
  } catch (error: any) {
    console.error("Quiz error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
