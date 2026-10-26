const AnkLogo = ({ size = "md" }: { size?: "md" | "lg" }) => {
  const mark = size === "lg" ? "w-12 h-12 text-2xl" : "w-9 h-9 text-lg";
  const word = size === "lg" ? "text-4xl" : "text-2xl";
  return (
    <div className="flex items-center gap-3">
      <div className={`${mark} rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-600 flex items-center justify-center font-black text-black shadow-lg shadow-emerald-500/20`}>
        a
      </div>
      <span className={`${word} font-black tracking-tight text-white`}>ank</span>
    </div>
  );
};

export default AnkLogo;
