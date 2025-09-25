import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  createProductSuperior,
  getProductSuperiorsByProductId,
} from "@/lib/services/products/productSuperior";

// ✅ GET /api/products/:productId/superiors
export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId);
    if (!productId) {
      return NextResponse.json(
        { error: "productId wajib diisi" },
        { status: 400 }
      );
    }

    const superiors = await getProductSuperiorsByProductId(productId);
    return NextResponse.json(superiors, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mengambil data superior" },
      { status: 500 }
    );
  }
}

// ✅ POST /api/products/:productId/superiors
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = parseInt(params.productId);
    if (!productId) {
      return NextResponse.json(
        { error: "productId wajib diisi" },
        { status: 400 }
      );
    }

    let data: any = {};
    let iconUrl: string | undefined = undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // 📌 Kalau JSON
      data = await req.json();
      iconUrl = data.icon;
    } else if (contentType.includes("multipart/form-data")) {
      // 📌 Kalau FormData
      const formData = await req.formData();
      data = {
        title: formData.get("title") as string,
        desc: formData.get("desc") as string,
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
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 400 }
      );
    }

    const superior = await createProductSuperior(
      productId,
      data.title,
      data.desc,
      iconUrl
    );

    return NextResponse.json(superior, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal membuat data superior" },
      { status: 500 }
    );
  }
}
