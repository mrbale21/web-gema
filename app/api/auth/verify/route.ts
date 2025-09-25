import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, pin } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 }
    );

  if (user.verified)
    return NextResponse.json({
      success: true,
      message: "User sudah terverifikasi",
    });

  if (user.verificationToken !== pin)
    return NextResponse.json({ error: "PIN salah" }, { status: 400 });

  if (user.verificationExpires && user.verificationExpires < new Date()) {
    return NextResponse.json(
      { error: "PIN sudah kadaluarsa" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { email },
    data: {
      verified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Verifikasi berhasil. Silakan login.",
  });
}
