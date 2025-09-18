import { prisma } from "@/lib/prisma";
import { getChairman } from "@/lib/services/chairmanService";
import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];

export async function GET() {
  try {
    const chairman = await getChairman();
    return NextResponse.json(chairman);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    // slug unik dari nama
    function generateSlug(name: string) {
      return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const slug = generateSlug(name);

    const newChairman = await prisma.chairman.create({
      data: {
        name,
        slug,
        image: null, // upload belakangan
        title: "",
        sub1: "",
        sub2: "",
        content: "",
        position: "",
        period: "",
        city: "",
        ToS: "",
      },
    });

    return NextResponse.json(newChairman, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/chairman error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper convert stream ke buffer
async function streamToBuffer(
  stream: ReadableStream<Uint8Array> | null | undefined
) {
  if (!stream) return Buffer.alloc(0);
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}
