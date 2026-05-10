import { NextRequest, NextResponse } from "next/server";
import { getSearches, getSearchById, getQuestionsBySearchId, getTotalSearchCount } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get("searchId");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    await logger.log("INFO", "USER_INTERACTION", "Questions retrieved", {
      search_id: searchId,
      query_params: { limit, offset },
    });

    if (searchId) {
      const search = await getSearchById(searchId);
      if (!search) {
        return NextResponse.json({ error: "Search not found" }, { status: 404 });
      }
      const questions = await getQuestionsBySearchId(searchId);
      return NextResponse.json({
        searches: [{ ...search, questions }],
        total: 1,
      });
    }

    const searches = await getSearches(limit, offset);
    const searchesWithQuestions = await Promise.all(
      searches.map(async (search) => ({
        ...search,
        questions: await getQuestionsBySearchId(search.id),
      }))
    );

    const total = await getTotalSearchCount();

    return NextResponse.json({
      searches: searchesWithQuestions,
      total,
    });
  } catch (error) {
    await logger.log(
      "ERROR",
      "API_ERROR",
      `Failed to retrieve questions: ${error instanceof Error ? error.message : String(error)}`
    );

    return NextResponse.json(
      { error: "Failed to retrieve questions" },
      { status: 500 }
    );
  }
}