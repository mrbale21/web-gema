import FooterSection from "@/components/SectionHome/FooterSection";
import NavbarSection from "@/components/SectionHome/Navbar/NavbarSection";
import BannerPage from "./banner-page";

interface LayoutPageProps {
  children: React.ReactNode;
  title: string;
  titlePage: string;
  desc: string;
}

export default function LayoutPage({
  children,
  title,
  titlePage,
  desc,
}: LayoutPageProps) {
  return (
    <div className="max-h-auto w-full bg-white text-gray-800">
      <NavbarSection />
      <BannerPage title={title} breadcrumb={titlePage} desc={desc} />

      {children}

      <FooterSection />
    </div>
  );
}
