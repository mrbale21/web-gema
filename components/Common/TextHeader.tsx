interface TextHeaderProps {
  title: string;
  desc: string;
}

export default function TextHeader({ title, desc }: TextHeaderProps) {
  const [first, second] = title.split("|");
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="text-center flex flex-col items-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 ">
            {first} <span className="text-primary">{second}</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-2 mb-5"></div>
          <p className="text-gray-600 text-lg w-2/3">{desc}</p>
        </div>
      </div>
    </>
  );
}
