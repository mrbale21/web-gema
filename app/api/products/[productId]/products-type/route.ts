import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  createProductType,
  getProductTypesByProductId,
} from "@/lib/services/products/productType";

// ✅ GET /api/products/:productId/Types
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

    const Types = await getProductTypesByProductId(productId);
    return NextResponse.json(Types, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mengambil data Type" },
      { status: 500 }
    );
  }
}

// ✅ POST /api/products/:productId/Types
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

    const Type = await createProductType(
      productId,
      data.title,
      data.desc,
      iconUrl
    );

    return NextResponse.json(Type, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal membuat data Type" },
      { status: 500 }
    );
  }
}
