import { FaArrowRight } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";

interface Props {
  className?: string;
  onClick?: () => void;
  title: String;
}

const ButtonReadMore = ({ onClick, title }: Props) => {
  return (
    <>
      <button
        onClick={onClick}
        className="p-3 px-4 flex rounded-lg items-center gap-2 border-b-2 bg-primary hover:bg-primary/80 group transition-all duration-200"
      >
        <div className="text-white group-hover:text-white font-semibold">
          {title}
        </div>
        <FaArrowRight className="text-white group-hover:text-white " />
      </button>
    </>
  );
};

export default ButtonReadMore;
