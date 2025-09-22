"use client";

import Loading from "@/components/Common/Loading";
import NewProductDashboard from "@/components/dashboard/product/NewProductDash";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
}

export default function NewProdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 🔹 Unwrap params
  const { id } = React.use(params);
  const productId = parseInt(id);

  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/newprod/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data: Product = await res.json();
        setTitle(data.title);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Kelola New Product #{productId} {title && `- ${title}`}
      </h1>
      <NewProductDashboard productId={productId} />
    </div>
  );
}
