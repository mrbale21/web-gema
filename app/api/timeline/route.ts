import { createTimeline, getAllTimeline } from "@/lib/services/timelineService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const timeline = await getAllTimeline();
    return NextResponse.json(timeline);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // =============================
    // 1) HANDLE JSON REQUEST
    // =============================
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { title, year, desc } = body;

      const timeline = await createTimeline(title, year, desc);
      return NextResponse.json(timeline);
    }

    // =============================
    // 2) HANDLE FORM-DATA REQUEST
    // =============================
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const title = formData.get("title") as string;
      const year = formData.get("year") as string;

      const desc = formData.get("desc") as string;

      const timeline = await createTimeline(title, year, desc);
      return NextResponse.json(timeline);
    }

    // =============================
    // 3) HANDLE UNSUPPORTED
    // =============================
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 415 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
