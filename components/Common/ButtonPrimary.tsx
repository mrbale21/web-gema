import Link from "next/link";
import Image from "next/image";
import { IoMdArrowRoundForward } from "react-icons/io";

export default function ButtonPrimary({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex text-sm sm:text-lg justify-center items-center z-10 rounded-lg relative transition-all duration-200 group px-[22px] py-[15px] lg:px-[32px] lg:py-[22px]  bg-primary text-white hover:bg-gray-100 hover:text-primary hover:-translate-y-[2px] text-heading-6 tracking-wide mr-[22px] font-chivo font-semibold"
    >
      {label}
      <IoMdArrowRoundForward className="ml-3 text-lg sm:text-xl" />
    </Link>
  );
}
