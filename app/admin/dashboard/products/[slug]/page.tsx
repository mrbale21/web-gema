import ProductDashboard from "@/components/dashboard/products/ProductsDash";
import { prisma } from "@/lib/prisma";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.products.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return <div>Produk tidak ditemukan</div>;
  }

  return <ProductDashboard product={product} />;
}
