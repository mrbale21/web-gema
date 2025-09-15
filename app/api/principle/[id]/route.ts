import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { prisma } from "@/lib/prisma";
import {
  deletePrinciple,
  getPrincipleById,
  updatePrinciple,
} from "@/lib/services/principleService";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const PrincipleId = parseInt(id, 10);

    const Principle = await getPrincipleById(PrincipleId);

    if (!Principle) {
      return NextResponse.json(
        { error: "Principle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(Principle);
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
    const PrincipleId = parseInt(id, 10);
    if (isNaN(PrincipleId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    let data: any = {};
    let iconUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        title: formData.get("title") as string,
        desc: formData.get("desc") as string,
      };

      const iconFile = formData.get("image") as File | null;
      if (iconFile) {
        const bytes = await iconFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${iconFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        iconUrl = "/uploads/" + filePath.split("/").pop();
      }
    } else {
      data = await req.json();
    }

    const updatedPrinciple = await updatePrinciple(PrincipleId, {
      ...data,
      icon: iconUrl ?? data.icon,
    });

    return NextResponse.json(updatedPrinciple);
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

    const deleted = await deletePrinciple(id);

    return NextResponse.json({
      message: "Keunggulan berhasil dihapus",
      deleted,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
