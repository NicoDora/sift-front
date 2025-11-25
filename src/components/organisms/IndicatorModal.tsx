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
      <div className="bg-background w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-xl font-bold text-bodyText p-2">
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
            secondData={data.market_momentum_sp125}
            yAxisInterval={500}
          />
          <IndicatorCard
            title="Stock Price Strength"
            data={data.stock_price_strength}
            showReferenceLine={true}
            yAxisInterval={5}
            unit="%"
          />
          <IndicatorCard
            title="Stock Price Breadth"
            data={data.stock_price_breadth}
            yAxisInterval={500}
          />
          <IndicatorCard
            title="Put and Call Options"
            data={data.put_call_options}
            yAxisInterval={0.1}
          />
          <IndicatorCard
            title="Market Volatility (VIX)"
            data={data.market_volatility_vix}
            secondData={data.market_volatility_vix_50}
            yAxisInterval={10}
          />
          <IndicatorCard
            title="Safe Haven Demand"
            data={data.safe_haven_demand}
            showReferenceLine={true}
            yAxisInterval={5}
            unit="%"
          />
          <IndicatorCard
            title="Junk Bond Demand"
            data={data.junk_bond_demand}
            yAxisInterval={0.1}
            unit="%"
          />
        </div>
      </div>
    </div>
  );
};

export default IndicatorModal;
