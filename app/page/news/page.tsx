import NewsSection from "@/components/SectionHome/News/NewsSection";
import LayoutPage from "../layout-page";

export default function NewsPage() {
  return (
    <LayoutPage title="Berita" titlePage="Berita" desc="Berita">
      <NewsSection />
    </LayoutPage>
  );
}
