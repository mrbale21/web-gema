"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DynamicIcon from "@/components/Common/DynamicIcon";
import WhatsappButton from "@/components/Common/WhatsAppButton";

import { TenantType } from "@/types/tenant";
import { Product } from "@/types/products";
import { ProductTitle } from "@/types/productTitle";
import { ProductSubTitle } from "@/types/productSubTitle";
import { ProductBenefit } from "@/types/productBenefit";
import { ProductImage } from "@/types/productImage";
import { ProductSuperior } from "@/types/productSuperior";
import { ProductType } from "@/types/productType";
import Image from "next/image";
import LayoutPage from "@/app/page/layout-page";
import Loading from "@/components/Common/Loading";

export default function PageProduct({ product }: { product: Product }) {
  const [productsSuperior, setProductsSuperior] = useState<ProductSuperior[]>(
    []
  );
  const [productTitles, setProductTitles] = useState<ProductTitle | null>(null);
  const [productSubTitles, setProductSubTitles] =
    useState<ProductSubTitle | null>(null);
  const [productsBenefit, setProductsBenefit] = useState<ProductBenefit[]>([]);
  const [productsImage, setProductsImage] = useState<ProductImage[]>([]);
  const [productsType, setProductsType] = useState<ProductType[]>([]);
  const [tenant, setTenant] = useState<TenantType | null>(null);

  const [loadingSections, setLoadingSections] = useState({
    title: true,
    subtitle: true,
    superior: true,
    benefit: true,
    image: true,
    type: true,
    tenant: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!product?.id) return;

      try {
        const urls = {
          title: `/api/products/${product.id}/products-title`,
          subtitle: `/api/products/${product.id}/products-subtitle`,
          superior: `/api/products/${product.id}/products-superior`,
          benefit: `/api/products/${product.id}/products-benefit`,
          image: `/api/products/${product.id}/products-image`,
          type: `/api/products/${product.id}/products-type`,
          tenant: `/api/tenant`,
        };

        const entries = Object.entries(urls);

        // Fetch semua endpoint sekaligus
        const responses = await Promise.all(
          entries.map(([_, url]) => fetch(url))
        );
        const data = await Promise.all(responses.map((res) => res.json()));

        entries.forEach(([key], idx) => {
          const value = data[idx];
          switch (key) {
            case "title":
              setProductTitles(value || null);
              setLoadingSections((prev) => ({ ...prev, title: false }));
              break;
            case "subtitle":
              setProductSubTitles(value || null);
              setLoadingSections((prev) => ({ ...prev, subtitle: false }));
              break;
            case "superior":
              setProductsSuperior(Array.isArray(value) ? value : []);
              setLoadingSections((prev) => ({ ...prev, superior: false }));
              break;
            case "benefit":
              setProductsBenefit(Array.isArray(value) ? value : []);
              setLoadingSections((prev) => ({ ...prev, benefit: false }));
              break;
            case "image":
              setProductsImage(Array.isArray(value) ? value : []);
              setLoadingSections((prev) => ({ ...prev, image: false }));
              break;
            case "type":
              setProductsType(Array.isArray(value) ? value : []);
              setLoadingSections((prev) => ({ ...prev, type: false }));
              break;
            case "tenant":
              setTenant(value || null);
              setLoadingSections((prev) => ({ ...prev, tenant: false }));
              break;
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [product?.id]);

  return (
    <LayoutPage
      title={product.name}
      titlePage={product.name}
      desc={product.desc}
    >
      {/* Intro Section */}
      {loadingSections.title ? (
        <Loading type="spinner" text="Memuat Title..." />
      ) : productTitles ? (
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {productTitles.title}
          </h2>
          <p className="text-gray-600">{productTitles.desc}</p>
        </div>
      ) : null}

      {loadingSections.subtitle ? (
        <Loading type="spinner" text="Memuat SubTitle..." />
      ) : productSubTitles ? (
        <div className="mt-20 max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            <span className="text-primary">{productSubTitles.title}</span>
          </h2>
          <p className="text-gray-600 md:text-lg">{productSubTitles.desc}</p>
        </div>
      ) : null}

      {/* Steps Section */}
      {loadingSections.superior ? (
        <Loading type="spinner" text="Memuat Steps..." />
      ) : productsSuperior.length > 0 ? (
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-6 md:px-10">
          {productsSuperior.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center bg-white shadow-md rounded-2xl p-6 text-center group hover:shadow-xl hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-lg mb-4">
                <DynamicIcon
                  name={step.icon || "Package"}
                  className="mx-auto text-white w-8 h-8"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Products Image */}
      {loadingSections.image ? (
        <Loading type="spinner" text="Memuat Gambar Produk..." />
      ) : productsImage.length > 0 ? (
        <div className="mt-20 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 px-15">
            {productsImage.map((item) => (
              <motion.div
                key={item.id}
                className="relative group rounded-2xl overflow-hidden shadow-lg bg-white"
                whileHover={{ scale: 1.05, rotate: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={item.image || "/assets/images/default.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Program Types */}
      {loadingSections.type ? (
        <Loading type="spinner" text="Memuat Jenis Pelatihan..." />
      ) : productsType.length > 0 ? (
        <div className="mt-20 max-w-5xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">
            Jenis Pelatihan yang Tersedia
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {productsType.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <div className="mb-4">
                  <DynamicIcon
                    name={prog.icon || "Package"}
                    className="w-8 h-8 text-primary"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {prog.title}
                </h4>
                <p className="text-gray-600 text-sm">{prog.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Mitra Benefits */}
      {loadingSections.benefit ? (
        <Loading type="spinner" text="Memuat Keunggulan..." />
      ) : productsBenefit.length > 0 ? (
        <div className="mt-20 max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Keunggulan Bergabung Sebagai Mitra
          </h3>
          <ul className="text-gray-600 space-y-3 text-center items-center justify-center flex flex-col max-w-xl mx-auto">
            {productsBenefit.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-2"
              >
                <span className="text-primary font-bold">✔</span>
                <span>{item.title}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Call to Action */}
      {loadingSections.tenant ? (
        <Loading type="spinner" text="Memuat Kontak Tenant..." />
      ) : (
        <section className="py-16 px-6 mt-20 bg-accent text-gray-700 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {product.name}
            </h2>
            <p className="mb-6 text-lg">{product.desc}</p>
            <WhatsappButton
              phone={tenant?.phone2 || ""}
              message={`Halo ${
                tenant?.nameTenant || "Tenant"
              }, saya ingin menanyakan sesuatu.`}
              className="bg-white text-primary font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Hubungi Sekarang!
            </WhatsappButton>
          </div>
        </section>
      )}
    </LayoutPage>
  );
}
