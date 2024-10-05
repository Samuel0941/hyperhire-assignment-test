import Image from "next/image";
import MenuComponent from "./components/Menu.component";

export default function Home() {
  return (
    <div className="bg-white flex flex-row">
      <div className="w-[240px] m-[24px] bg-[#101828] rounded-[24px] pt-[30px] pb-[30px] pl-[32px] pr-[32px]">
        <Image
          src="/close_left.svg"
          alt="My SVG Image"
          width={24}
          height={24}
        />
      </div>

      <MenuComponent />
    </div>
  );
}
