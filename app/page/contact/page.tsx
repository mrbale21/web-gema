import LayoutPage from "../layout-page";

export default function ContactPage() {
  return (
    <LayoutPage
      title="Kontak Gema Nahdliyin"
      titlePage="Kontak"
      desc="Hubungi kami untuk informasi lebih lanjut terkait program, produk, atau kerja sama dengan Gema Nahdliyin."
    >
      <div className="grid md:grid-cols-2 gap-8 py-10 px-6 lg:px-20">
        {/* Info Kontak */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Informasi Kontak</h2>
          <p className="text-gray-600">
            Kami selalu terbuka untuk kolaborasi, saran, maupun pertanyaan.
            Silakan hubungi kami melalui informasi berikut:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Alamat</h3>
              <p className="text-gray-700">
                Sekretariat Gema Nahdliyin <br />
                Jl. KH. Hasyim Asy’ari No. 45, Kota Bandung, Jawa Barat
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Telepon / WhatsApp</h3>
              <p className="text-gray-700">+62 812-3456-7890</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-gray-700">info@gemanahdliyin.org</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Jam Operasional</h3>
              <p className="text-gray-700">
                Senin - Jumat: 08.00 - 16.00 WIB <br />
                Sabtu: 09.00 - 13.00 WIB
              </p>
            </div>
          </div>
        </div>

        {/* Form Kontak */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Kirim Pesan</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Alamat Email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Pesan Anda"
              rows={4}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>

      {/* Peta Lokasi */}
      <div className="mt-10 px-6 lg:px-20 pb-20">
        <h2 className="text-2xl font-bold text-primary mb-4">Lokasi Kami</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.334068989733!2d107.60981!3d-6.914744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6e3bbd4b1f1%3A0x3027a76e352b140!2sBandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1697001234567!5m2!1sid!2sid"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>
    </LayoutPage>
  );
}
