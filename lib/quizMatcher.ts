export interface QuizAnswers {
  location: string[];      // preferred states
  budget: string;          // "below-2L" | "2L-5L" | "5L-10L" | "above-10L"
  stream: string;          // Engineering, Medical, etc.
  collegeType: string;     // Private | Public | Any
  careerGoal: string;      // "placement" | "research" | "entrepreneurship" | "abroad"
  priorities: string[];    // ["placements", "campus-life", "research", "faculty", "fees"]
  entranceExam: string;    // JEE Main, NEET, etc.
  campusSize: string;      // "small" | "medium" | "large"
}

export interface CollegeMatch {
  collegeId: string;
  name: string;
  slug: string;
  location: string;
  type: string;
  nirfRanking?: number;
  avgRating: number;
  matchPercentage: number;
  matchReasons: string[];
}

// Budget thresholds (annual fee in INR)
const BUDGET_RANGES: Record<string, [number, number]> = {
  "below-2L": [0, 200000],
  "2L-5L": [200000, 500000],
  "5L-10L": [500000, 1000000],
  "above-10L": [1000000, Infinity],
};

export function scoreCollege(college: any, answers: QuizAnswers): { score: number; reasons: string[] } {
  let score = 0;
  const maxScore = 100;
  const reasons: string[] = [];

  // 1. Location match (20 points)
  if (answers.location.length === 0 || answers.location.includes("Any")) {
    score += 20;
  } else if (answers.location.includes(college.location?.state)) {
    score += 20;
    reasons.push(`Located in ${college.location.state}`);
  } else if (answers.location.some((l: string) => college.location?.city?.toLowerCase().includes(l.toLowerCase()))) {
    score += 15;
    reasons.push(`Located in ${college.location.city}`);
  }

  // 2. College type match (15 points)
  if (answers.collegeType === "Any" || answers.collegeType === "") {
    score += 15;
  } else if (college.type === answers.collegeType) {
    score += 15;
    reasons.push(`${college.type} institution`);
  } else if (answers.collegeType === "Public" && college.type === "Autonomous") {
    score += 8;
  }

  // 3. Entrance exam match (20 points)
  if (!answers.entranceExam || answers.entranceExam === "Any") {
    score += 20;
  } else if (college.entranceExams?.includes(answers.entranceExam)) {
    score += 20;
    reasons.push(`Accepts ${answers.entranceExam}`);
  }

  // 4. Priority alignment (25 points)
  const priorityPoints = 25 / Math.max(answers.priorities.length, 1);
  answers.priorities.forEach((priority) => {
    if (priority === "placements") {
      if ((college.placementPercentage || 0) >= 80) {
        score += priorityPoints;
        reasons.push(`Strong placements (${college.placementPercentage}%)`);
      } else if ((college.placementPercentage || 0) >= 60) {
        score += priorityPoints * 0.5;
      }
    }
    if (priority === "campus-life") {
      const facilityCount = Object.values(college.facilities || {}).filter(Boolean).length;
      if (facilityCount >= 6) {
        score += priorityPoints;
        reasons.push("Excellent campus facilities");
      } else if (facilityCount >= 4) {
        score += priorityPoints * 0.6;
      }
    }
    if (priority === "research") {
      if (college.type === "Public" || (college.nirfRanking && college.nirfRanking <= 50)) {
        score += priorityPoints;
        reasons.push("Strong research environment");
      }
    }
    if (priority === "fees") {
      const [min, max] = BUDGET_RANGES[answers.budget] || [0, Infinity];
      if (college.annualFeeAvg && college.annualFeeAvg <= max) {
        score += priorityPoints;
        reasons.push("Within your budget");
      } else if (!college.annualFeeAvg) {
        score += priorityPoints * 0.5;
      }
    }
    if (priority === "faculty") {
      if ((college.ratingBreakdown?.facultyQuality || 0) >= 4) {
        score += priorityPoints;
        reasons.push("Highly rated faculty");
      }
    }
  });

  // 5. Rating bonus (10 points)
  if (college.avgRating >= 4.5) {
    score += 10;
    reasons.push("Excellent student ratings");
  } else if (college.avgRating >= 4.0) {
    score += 7;
  } else if (college.avgRating >= 3.5) {
    score += 4;
  }

  // 6. Ranking bonus (10 points)
  if (college.nirfRanking) {
    if (college.nirfRanking <= 10) {
      score += 10;
      reasons.push(`Top 10 in NIRF (Rank #${college.nirfRanking})`);
    } else if (college.nirfRanking <= 50) {
      score += 7;
    } else if (college.nirfRanking <= 100) {
      score += 4;
    }
  }

  // Career goal adjustments
  if (answers.careerGoal === "placement" && (college.highestPackage || 0) > 2000000) {
    score = Math.min(score + 5, maxScore);
    if (!reasons.includes("Strong placements")) reasons.push(`High placement packages (₹${(college.highestPackage / 100000).toFixed(0)}L+)`);
  }
  if (answers.careerGoal === "research" && college.nirfRanking && college.nirfRanking <= 20) {
    score = Math.min(score + 5, maxScore);
  }

  return { score: Math.min(Math.round(score), maxScore), reasons };
}

export function getMatchPercentage(score: number): number {
  return Math.min(Math.round((score / 100) * 100), 99);
}
