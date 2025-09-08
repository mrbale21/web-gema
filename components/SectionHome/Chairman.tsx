import { Award, BookOpen, Quote, Users } from "lucide-react";

import Image from "next/image";

export default function Chairman() {
  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sambutan <span className="text-primary">Ketua Umum</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Foto Ketua Umum */}
            <div className="relative">
              <div className="relative bg-accent rounded-3xl p-8 lg:p-12">
                <div className="absolute top-4 right-4 w-20 h-20 bg-primary rounded-full opacity-50"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary rounded-full opacity-30"></div>

                <div className="relative bg-primary rounded-2xl aspect-[3/4] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/assets/images/headmaster.jpg"
                    alt="H. Ahmad Santoso - Ketua Umum Gema Nahdliyin"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    H. Ahmad Santoso
                  </h3>
                  <p className="text-primary font-semibold">
                    Ketua Umum Gema Nahdliyin
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Periode 2025 - Sekarang
                  </p>
                </div>
              </div>

              {/* Achievement Card */}
              <div className="absolute -right-4 top-20 bg-white rounded-xl shadow-lg p-4 border-l-4 border-primary hidden lg:block">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-secondary" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      20+ Tahun
                    </p>
                    <p className="text-gray-600 text-xs">
                      Bakti untuk Organisasi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sambutan Ketua Umum */}
            <div className="space-y-8">
              <div className="relative">
                <Quote className="w-12 h-12 text-secondary opacity-20 absolute -top-2 -left-2" />
                <blockquote className="text-2xl lg:text-3xl font-light text-gray-700 leading-relaxed italic pl-8">
                  "Mengabdi untuk Nahdlatul Ulama berarti mengabdi untuk umat
                  dan bangsa."
                </blockquote>
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  <span className="font-semibold text-gray-900">
                    Assalamualaikum warahmatullahi wabarakatuh,
                  </span>
                </p>

                <p>
                  Dengan penuh rasa syukur, saya menyambut kehadiran Anda di
                  website resmi{" "}
                  <span className="font-semibold text-primary">
                    Gema Nahdliyin
                  </span>
                  . Sebagai Ketua Umum, saya berkomitmen untuk menjadikan
                  organisasi ini sebagai wadah perjuangan, pengabdian, dan
                  pengembangan kader-kader muda Nahdlatul Ulama.
                </p>

                <p>
                  Kami bertekad untuk terus memperkuat{" "}
                  <span className="font-semibold">ukhuwah, dakwah,</span> dan{" "}
                  <span className="font-semibold">pengabdian sosial</span> demi
                  kemaslahatan umat dan kejayaan bangsa. Generasi muda adalah
                  harapan, dan Gema Nahdliyin hadir untuk membimbing sekaligus
                  mewadahi potensi mereka.
                </p>

                <p>
                  Mari kita bersama-sama menjaga semangat Nahdliyin, meneguhkan
                  tradisi, dan melangkah menuju masa depan yang lebih baik.
                </p>

                <p className="text-lg font-medium text-gray-900">
                  Wassalamualaikum warahmatullahi wabarakatuh.
                </p>
              </div>

              {/* Tanda Tangan */}
              <div className="pt-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">
                        H. Ahmad Santoso
                      </p>
                      <p className="text-primary">Ketua Umum Gema Nahdliyin</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>
                        Jakarta,{" "}
                        {new Date().toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
