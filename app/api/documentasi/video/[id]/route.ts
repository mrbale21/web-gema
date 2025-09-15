import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  getVideoById,
  updateVideo,
  deleteVideo,
} from "@/lib/services/documentService";
import { VideoType } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const video = await getVideoById(id);
    if (!video)
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    return NextResponse.json(video);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    let data: any = {};
    let videoUrl: string | undefined;
    let type: VideoType | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data.name = formData.get("name") as string;

      const videoFile = formData.get("video") as File | null;
      if (videoFile) {
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${videoFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        videoUrl = "/uploads/" + filePath.split("/").pop();
        type = VideoType.LOCAL;
      }
    } else {
      const body = await req.json();
      data.name = body.name;
      if (body.videoUrl) {
        videoUrl = body.videoUrl;
        type = VideoType.YOUTUBE;
      }
    }

    const updated = await updateVideo(id, {
      ...data,
      videoUrl: videoUrl ?? undefined,
      type: type ?? undefined,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const deleted = await deleteVideo(id);
    return NextResponse.json({ message: "Video deleted", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
