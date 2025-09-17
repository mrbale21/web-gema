import { useEffect, useState } from "react";
import TextHeader from "../Common/TextHeader";
import Loading from "../Common/Loading";

interface dataTenant {
  desc: string;
}

export default function AboutSection() {
  const [tenant, setTenant] = useState<dataTenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await fetch("/api/tenant");
        if (!res.ok) throw new Error("Failed to fetch tenant");

        const json = await res.json();
        setTenant(Array.isArray(json) ? json[0] : json);
      } catch (err) {
        console.error("Invalid API", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, []);

  if (loading) return <Loading type="spinner" text="Memuat Tentang Kami..." />;
  if (!tenant) return <Loading type="spinner" text="Data Tidak Ditemukan!" />;

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full pt-30 pb-20 px-10 gap-5">
        <TextHeader title="Tentang | Kami" desc={tenant.desc} />
      </div>
    </>
  );
}
