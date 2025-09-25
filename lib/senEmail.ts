// lib/sendPinEmail.ts
import nodemailer from "nodemailer";

export async function sendVerificationPIN(email: string, pin: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Gema Nahdliyin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "PIN Verifikasi Email Anda",
    html: `
      <h2>Selamat datang!</h2>
      <p>Terima kasih sudah mendaftar. Masukkan kode PIN berikut untuk verifikasi email:</p>
      <h3 style="letter-spacing: 4px; font-size: 24px;">${pin}</h3>
      <p>Kode PIN ini berlaku 1 jam.</p>
    `,
  });
}
