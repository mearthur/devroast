import { desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { type Submission, type Vote, submissions, votes } from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);
export const db = drizzle(client);

export type { Submission, Vote };

export async function createSubmission(data: { code: string; language: string; roast: string }) {
  const result = await db
    .insert(submissions)
    .values({
      code: data.code,
      language: data.language,
      roast: data.roast,
    })
    .returning({
      id: submissions.id,
      code: submissions.code,
      language: submissions.language,
      roast: submissions.roast,
      score: submissions.score,
      createdAt: submissions.createdAt,
    });

  return result[0];
}

export async function getSubmissionById(id: string) {
  const result = await db
    .select({
      id: submissions.id,
      code: submissions.code,
      language: submissions.language,
      roast: submissions.roast,
      score: submissions.score,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);

  return result[0] || null;
}

export async function getAllSubmissions(limitCount = 50, offsetCount = 0) {
  return db
    .select({
      id: submissions.id,
      code: submissions.code,
      language: submissions.language,
      roast: submissions.roast,
      score: submissions.score,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .orderBy(desc(submissions.createdAt))
    .limit(limitCount)
    .offset(offsetCount);
}

export async function getLeaderboard(limitCount = 10, offsetCount = 0) {
  const result = await db.execute(sql`
    SELECT 
      s.id,
      s.code,
      s.language,
      s.roast,
      s.score,
      s.created_at as "createdAt",
      COALESCE(COUNT(v.id), 0)::int as "voteCount"
    FROM submissions s
    LEFT JOIN votes v ON v.submission_id = s.id
    GROUP BY s.id
    ORDER BY s.score DESC, s.created_at DESC
    LIMIT ${limitCount}
    OFFSET ${offsetCount}
  `);

  return result as unknown as Array<{
    id: string;
    code: string;
    language: string;
    roast: string;
    score: number;
    createdAt: Date;
    voteCount: number;
  }>;
}

export async function getTopSubmissions(limitCount = 5) {
  const result = await db.execute(sql`
    SELECT 
      s.id,
      s.code,
      s.language,
      s.roast,
      s.score,
      s.created_at as "createdAt",
      COALESCE(COUNT(v.id), 0)::int as "voteCount"
    FROM submissions s
    LEFT JOIN votes v ON v.submission_id = s.id
    GROUP BY s.id
    ORDER BY s.score DESC
    LIMIT ${limitCount}
  `);

  return result as unknown as Array<{
    id: string;
    code: string;
    language: string;
    roast: string;
    score: number;
    createdAt: Date;
    voteCount: number;
  }>;
}

export async function createVote(submissionId: string) {
  const [vote] = await db
    .insert(votes)
    .values({
      submissionId,
    })
    .returning({
      id: votes.id,
      submissionId: votes.submissionId,
      createdAt: votes.createdAt,
    });

  await db
    .update(submissions)
    .set({ score: sql`${submissions.score} + 1` })
    .where(eq(submissions.id, submissionId));

  return vote;
}

export async function deleteVote(submissionId: string) {
  const existing = await db
    .select({ id: votes.id })
    .from(votes)
    .where(eq(votes.submissionId, submissionId))
    .limit(1);

  if (existing.length === 0) {
    return false;
  }

  await db.delete(votes).where(eq(votes.submissionId, submissionId));

  await db
    .update(submissions)
    .set({ score: sql`GREATEST(${submissions.score} - 1, 0)` })
    .where(eq(submissions.id, submissionId));

  return true;
}

export async function hasVoted(submissionId: string) {
  const result = await db
    .select({ id: votes.id })
    .from(votes)
    .where(eq(votes.submissionId, submissionId))
    .limit(1);

  return result.length > 0;
}
