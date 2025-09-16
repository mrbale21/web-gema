import { NextRequest, NextResponse } from "next/server";
import { createVideo, getAllVideo } from "@/lib/services/documentService";
import { VideoType } from "@prisma/client";
import { uploadToS3Buffer } from "@/lib/s3";

export async function GET() {
  try {
    const videos = await getAllVideo();
    return NextResponse.json(videos);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let name: string = "";
    let videoUrl: string | undefined;
    let type: VideoType = VideoType.YOUTUBE;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await req.json();
      name = data.name;
      videoUrl = data.videoUrl;
      type = VideoType.YOUTUBE;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name") as string;

      const videoFile = formData.get("video") as File | null;
      if (videoFile) {
        const buffer = await streamToBuffer(videoFile.stream());
        const fileName = `${Date.now()}-${videoFile.name}`;
        const s3Key = `videos/${fileName}`;

        videoUrl = await uploadToS3Buffer(
          buffer,
          s3Key,
          videoFile.type || "application/octet-stream"
        );
        type = VideoType.LOCAL;
      } else {
        return NextResponse.json(
          { error: "Video file required" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const video = await createVideo(name, videoUrl!, type);
    return NextResponse.json(video);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// helper untuk konversi ReadableStream ke Buffer
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
