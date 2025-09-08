import { FaBullseye, FaLightbulb, FaQuoteLeft } from "react-icons/fa";
import LayoutPage from "../layout-page";

export default function VisiMisi() {
  return (
    <>
      <LayoutPage
        title="Visi Misi"
        titlePage="Visi Misi"
        desc="Menjadi wadah perjuangan dan pemberdayaan warga Nahdliyin dengan semangat kebersamaan, pertumbuhan usaha, serta keberkahan yang berlandaskan nilai syariah."
      >
        <section className="bg-white py-8 px-4 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Visi */}
            <div className="bg-primary/10 p-8 rounded-xl shadow hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FaLightbulb className="text-primary text-4xl" />
                <h3 className="text-2xl font-bold text-primary lg:text-3xl">
                  Visi
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed lg:text-lg">
                Menjadi wadah gerakan ekonomi umat yang berlandaskan nilai-nilai
                Nahdlatul Ulama, mandiri, berdaya saing, dan berkontribusi nyata
                dalam meningkatkan kesejahteraan masyarakat serta kemandirian
                bangsa.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-primary/10 p-8 rounded-xl shadow hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FaBullseye className="text-primary text-4xl" />
                <h3 className="text-2xl font-bold text-primary lg:text-3xl">
                  Misi
                </h3>
              </div>
              <ul className="list-disc list-outside pl-5 space-y-2 text-gray-700 leading-relaxed">
                <li>
                  Memberdayakan UMKM dan pelaku usaha melalui pendampingan,
                  pelatihan, dan akses pasar.
                </li>
                <li>
                  Membangun ekosistem ekonomi yang adil, inklusif, dan
                  berkelanjutan bagi masyarakat.
                </li>
                <li>
                  Menanamkan nilai kemandirian, kebersamaan, dan semangat gotong
                  royong dalam setiap kegiatan usaha.
                </li>
                <li>
                  Memanfaatkan teknologi digital untuk memperluas jaringan dan
                  meningkatkan daya saing produk lokal.
                </li>
                <li>
                  Menjalin kemitraan strategis dengan berbagai pihak untuk
                  memperkuat jejaring usaha Nahdliyin.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Motto */}
        <section className="bg-gray-50 py-8 px-4 md:px-12 lg:px-24 mb-10">
          <div className="max-w-3xl mx-auto text-center">
            <FaQuoteLeft className="text-primary text-4xl mx-auto mb-4" />
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
              Motto Gema Nahdliyin
            </h3>
            <p className="text-lg italic text-gray-700">
              "Bersinergi, Berdaya, dan Berkah untuk Umat"
            </p>
          </div>
        </section>
      </LayoutPage>
    </>
  );
}
