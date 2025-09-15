import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { createVideo, getAllVideo } from "@/lib/services/documentService";
import { VideoType } from "@prisma/client";

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
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${videoFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        videoUrl = "/uploads/" + filePath.split("/").pop();
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
