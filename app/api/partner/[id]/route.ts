import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  deletePartner,
  getPartnerById,
  updatePartner,
} from "@/lib/services/partnerServices";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // params harus Promise
) {
  try {
    const { id } = await context.params;
    const partnerId = parseInt(id, 10);

    const partner = await getPartnerById(partnerId);

    if (!partner) {
      return NextResponse.json({ error: "partner not found" }, { status: 404 });
    }

    return NextResponse.json(partner);
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
    const partnerId = parseInt(id, 10);
    if (isNaN(partnerId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    let data: any = {};
    let imageUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {
        name: formData.get("name") as string,
        link: formData.get("link") as string,
      };

      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = `public/uploads/${Date.now()}-${imageFile.name}`;
        await fs.promises.writeFile(filePath, buffer);
        imageUrl = "/uploads/" + filePath.split("/").pop();
      }
    } else {
      data = await req.json();
    }

    const updatedpartner = await updatePartner(partnerId, {
      ...data,
      imageLogo: imageUrl ?? data.imageLogo,
    });

    return NextResponse.json(updatedpartner);
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

    const deleted = await deletePartner(id);

    return NextResponse.json({ message: "partner berhasil dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
