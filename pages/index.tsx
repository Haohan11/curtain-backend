import Image from "next/image";

export default function Home() {
  return (
    <div className="h-100 flex-center flex-column">
      <div className="position-relative w-150px h-150px">
        <Image alt="logo" fill src="/logo.svg" />
      </div>
      <p className="fs-2 fw-bold text-primary mt-6">
        請由左側面板進入系統
      </p>
    </div>
  );
}
