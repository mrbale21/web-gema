import { prisma } from "@/lib/prisma";
import PageProduct from "../page-product";

export default async function ProductsPage({
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

  return <PageProduct product={product} />;
}
