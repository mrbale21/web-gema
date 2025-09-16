import { NextRequest, NextResponse } from "next/server";
import {
  createStatistic,
  getAllStatistic,
} from "@/lib/services/statisticServices";
import { uploadToS3Buffer } from "@/lib/s3";

export async function GET() {
  try {
    const statistic = await getAllStatistic();
    return NextResponse.json(statistic);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let data: any = {};
    let imageUrl: string | undefined = undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await req.json();
      imageUrl = data.image; // ambil langsung dari JSON body
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        nameTenant: formData.get("nameTenant") as string,
        name: formData.get("name") as string,
        count: Number(formData.get("count")),
      };

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        // Convert stream ke buffer
        const buffer = await streamToBuffer(imageFile.stream());

        // Upload ke S3
        const fileName = `${Date.now()}-${imageFile.name}`;
        const s3Key = `statistic/${fileName}`;
        imageUrl = await uploadToS3Buffer(
          buffer,
          s3Key,
          imageFile.type || "application/octet-stream"
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const statistic = await createStatistic(data.name, data.count, imageUrl);
    return NextResponse.json(statistic);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// helper untuk convert stream ke buffer
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
