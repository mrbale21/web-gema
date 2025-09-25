import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  deleteProductSuperior,
  getProductSuperiorById,
  updateProductSuperior,
} from "@/lib/services/products/productSuperior";

// GET 1 superior by productId + superId
export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string; superId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    const superId = parseInt(params.superId, 10);

    if (isNaN(productId) || isNaN(superId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const superior = await getProductSuperiorById(superId);

    if (!superior || superior.productId !== productId) {
      return NextResponse.json(
        { error: "ProductSuperior not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(superior);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// UPDATE superior by superId
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string; superId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    const superId = parseInt(params.superId, 10);

    if (isNaN(productId) || isNaN(superId)) {
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
        isActive: formData.get("isActive") === "true",
      };

      const iconFile = formData.get("icon") as File | null;
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

    const updated = await updateProductSuperior(superId, {
      ...data,
      icon: iconUrl ?? data.icon,
    });

    // Pastikan belong to productId
    if (updated.productId !== productId) {
      return NextResponse.json(
        { error: "Superior tidak sesuai dengan productId" },
        { status: 400 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE superior by superId
export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string; superId: string } }
) {
  try {
    const productId = parseInt(params.productId, 10);
    const superId = parseInt(params.superId, 10);

    if (isNaN(productId) || isNaN(superId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Cek dulu belong to product
    const superior = await getProductSuperiorById(superId);
    if (!superior || superior.productId !== productId) {
      return NextResponse.json(
        { error: "Superior tidak ditemukan atau tidak sesuai productId" },
        { status: 404 }
      );
    }

    const deleted = await deleteProductSuperior(superId);

    return NextResponse.json({
      message: "Keunggulan berhasil dihapus",
      deleted,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
