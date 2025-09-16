import { NextRequest, NextResponse } from "next/server";
import { uploadToS3Buffer } from "@/lib/s3";
import { createPartner, getAllPartner } from "@/lib/services/partnerServices";

export async function GET() {
  try {
    const partner = await getAllPartner();
    return NextResponse.json(partner);
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
      // 📌 Kalau JSON
      data = await req.json();
      imageUrl = data.image; // ambil langsung dari JSON body
    } else if (contentType.includes("multipart/form-data")) {
      // 📌 Kalau FormData
      const formData = await req.formData();
      data = {
        name: formData.get("name") as string,
        link: formData.get("link") as string,
      };

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const buffer = await streamToBuffer(imageFile.stream());
        const fileName = `${Date.now()}-${imageFile.name}`;
        const s3Key = `partner/${fileName}`;

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

    const partner = await createPartner(data.name, data.link, imageUrl);

    return NextResponse.json(partner);
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
