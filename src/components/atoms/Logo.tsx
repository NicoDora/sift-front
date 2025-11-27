import { MdCandlestickChart } from "react-icons/md";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <MdCandlestickChart className="w-8 h-8 text-blue-600" />
      <span className="text-xl font-bold tracking-tight text-headerLogoText duration-transitionDuration">
        SIFT
      </span>
    </div>
  );
};

export default Logo;
