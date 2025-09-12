import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import {
  getTenant,
  updateTenant,
  deleteTenant,
} from "@/lib/services/tenantServices";

// ✅ GET tenant
export async function GET() {
  try {
    const tenant = await getTenant();
    return NextResponse.json(tenant ?? {}); // selalu return JSON
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PUT tenant (bisa JSON atau multipart/form-data)
export async function PUT(req: NextRequest) {
  try {
    let data: Record<string, any> = {};
    let imageUrl: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data = {};

      for (const [key, value] of formData.entries()) {
        if (key === "image" && value instanceof File) {
          const bytes = await value.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filePath = `public/uploads/${Date.now()}-${value.name}`;
          await fs.promises.writeFile(filePath, buffer);
          imageUrl = "/uploads/" + filePath.split("/").pop();
        } else {
          data[key] = value;
        }
      }
    }

    const tenant = await getTenant();
    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant belum ada, silakan buat dulu." },
        { status: 400 }
      );
    }

    const updatedTenant = await updateTenant(tenant.id, {
      ...data,
      imageLogo: imageUrl ?? data.imageLogo ?? tenant.imageLogo,
    });

    return NextResponse.json(updatedTenant);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE tenant (pakai ID)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await deleteTenant(id);
    return NextResponse.json({ message: "Tenant berhasil dihapus", deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
