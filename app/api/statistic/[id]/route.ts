import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import {
  deleteStatistic,
  getStatisticById,
  updateStatistic,
} from "@/lib/services/statisticServices";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const statisticId = parseInt(id, 10);

    const statistic = await getStatisticById(statisticId);

    if (!statistic) {
      return NextResponse.json(
        { error: "statistic not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(statistic);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const statisticId = parseInt(id, 10);
    if (isNaN(statisticId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    let data: any = {};
    let image: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        name: formData.get("name") as string,
        count: Number(formData.get("count")),
      };

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const buffer = await streamToBuffer(imageFile.stream());

        // Upload ke S3
        const fileName = `${Date.now()}-${imageFile.name}`;
        const s3Key = `statistic/${fileName}`;
        image = await uploadToS3Buffer(
          buffer,
          s3Key,
          imageFile.type || "application/octet-stream"
        );
      }
    } else {
      data = await req.json();
    }

    const updatedstatistic = await updateStatistic(statisticId, {
      ...data,
      image: image ?? data.image,
    });

    return NextResponse.json(updatedstatistic);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteStatistic(id);

    return NextResponse.json({
      message: "statistic berhasil dihapus",
      deleted,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// helper convert stream ke buffer
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
