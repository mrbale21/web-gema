import {
  deleteTimeline,
  getTimelineById,
  updateTimeline,
} from "@/lib/services/timelineService";
import { NextRequest, NextResponse } from "next/server";

// =============================
// GET /api/Timeline/[id]
// =============================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const timeline = await getTimelineById(id);
    if (!timeline) {
      return NextResponse.json(
        { error: "Timeline not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(timeline);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// =============================
// PUT /api/Timeline/[id]
// =============================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const contentType = req.headers.get("content-type") || "";

    // ✅ 1. JSON request
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const {
        title,
        year,

        desc,
      } = body;

      const updated = await updateTimeline(
        id,
        title,
        year,

        desc
      );
      return NextResponse.json(updated);
    }

    // ✅ 2. Multipart form-data (upload file)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      const title = formData.get("title") as string;
      const year = formData.get("year") as string;

      const desc = formData.get("desc") as string;

      const updated = await updateTimeline(
        id,

        title,
        year,

        desc
      );
      return NextResponse.json(updated);
    }

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

// =============================
// DELETE /api/Timeline/[id]
// =============================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteTimeline(id);
    return NextResponse.json({
      message: "Data Timeline berhasil dihapus",
      deleted,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
