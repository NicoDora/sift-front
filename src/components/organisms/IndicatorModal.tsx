import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import type { FearGreedData } from "../../types/fearGreed";
import { IndicatorCard } from "../molecules/IndicatorCard";

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FearGreedData;
}

const IndicatorModal = ({ isOpen, onClose, data }: IndicatorModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-bodyBg w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-xl font-bold text-bodyText">
            7 Fear & Greed Indicators
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bodyButtonBgHover rounded-full"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <IndicatorCard
            title="Market Momentum"
            data={data.market_momentum_sp500}
          />
          <IndicatorCard
            title="Stock Price Strength"
            data={data.stock_price_strength}
          />
          <IndicatorCard
            title="Stock Price Breadth"
            data={data.stock_price_breadth}
          />
          <IndicatorCard
            title="Put and Call Options"
            data={data.put_call_options}
          />
          <IndicatorCard
            title="Market Volatility (VIX)"
            data={data.market_volatility_vix}
          />
          <IndicatorCard
            title="Safe Haven Demand"
            data={data.safe_haven_demand}
          />
          <IndicatorCard
            title="Junk Bond Demand"
            data={data.junk_bond_demand}
          />
        </div>
      </div>
    </div>
  );
};

export default IndicatorModal;
