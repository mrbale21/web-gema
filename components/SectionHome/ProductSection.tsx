import product from "@/data/product";
import TextHeader from "../Common/TextHeader";

export default function ProductSection() {
  return (
    <div className="bg-white px-6 md:px-10 pb-16">
      {/* Header */}
      <TextHeader
        title=" Produk Unggulan | Gema Nahdliyin"
        desc="Berbagai produk inovatif yang dirancang untuk mendukung penguatan
          ekonomi, pemberdayaan UMKM, serta pengembangan ekosistem digital
          berbasis komunitas."
      />

      {/* Grid Produk */}
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 p-0.5">
          {product.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-accent flex flex-col justify-between items-center group overflow-hidden"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Gambar */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover relative z-0 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
              />

              {/* Info Produk */}
              <div className="bg-white group-hover:bg-transparent h-40 w-full items-center flex flex-col gap-1 justify-center relative z-20 -mt-20 p-4">
                <div className="uppercase font-bold text-lg text-gray-800 transition">
                  {item.title}
                </div>
                <div className="text-gray-600 text-center  transition text-sm">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
