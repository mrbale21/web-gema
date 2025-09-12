import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
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
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        image = "/uploads/" + filePath.split("/").pop();
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
