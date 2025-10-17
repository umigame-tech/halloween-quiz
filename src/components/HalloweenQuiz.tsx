import halloweenBg from "../halloween_bg.png";

interface HalloweenQuizProps {
  onStart: () => void;
}

export function HalloweenQuiz({ onStart }: HalloweenQuizProps) {
  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col dark group/design-root overflow-x-hidden"
      style={{ fontFamily: "var(--font-family-display)" }}
    >
      <div className="@container">
        <div className="@[480px]">
          <div
            className="flex min-h-screen flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(rgba(25, 16, 34, 0.3) 0%, rgba(25, 16, 34, 0.7) 100%), url(${halloweenBg})`,
              backgroundSize: "cover",
            }}
          >
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-white text-5xl font-black leading-tight tracking-tighter @[480px]:text-7xl">
                ハロウィンクイズ
              </h1>
              <h2 className="text-white text-base font-normal leading-normal @[480px]:text-lg">
                怖くてかわいい4択クイズ
              </h2>
            </div>
            <button
              onClick={onStart}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 @[480px]:h-14 @[480px]:px-8 text-white text-lg font-bold leading-normal tracking-[0.015em] transition-transform duration-300 ease-in-out hover:scale-105"
              style={{ backgroundColor: "#7311d4" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#5f0eb8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#7311d4";
              }}
            >
              <span className="truncate">スタート</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
