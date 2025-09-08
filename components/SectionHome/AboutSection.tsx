import TextHeader from "../Common/TextHeader";

export default function AboutSection() {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full pt-30 pb-20 px-10 gap-5">
        <TextHeader
          title="Tentang | Kami"
          desc=" Gema adalah sebuah komunitas yang berfokus pada pengembangan
          kreativitas dan inovasi di bidang teknologi serta seni. Kami hadir
          untuk menjadi wadah kolaborasi, berbagi ide, dan menciptakan solusi
          yang bermanfaat bagi masyarakat. Dengan semangat kebersamaan, Gema
          berkomitmen untuk terus tumbuh dan memberikan inspirasi bagi generasi
          muda."
        />
      </div>
    </>
  );
}
