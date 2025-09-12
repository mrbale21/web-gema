import Link from "next/link";
import Image from "next/image";
import { IoMdArrowRoundForward } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

export default function ButtonDash({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex text-sm font-semibold gap-3 justify-center items-center z-10 rounded-lg relative transition-all duration-200 group px-[22px] py-[10px] bg-primary text-white hover:bg-primary/80 mb-4"
    >
      <FaPlus />
      {label}
    </Link>
  );
}
