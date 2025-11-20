import { MdClose } from "react-icons/md";
import type { FearGreedData } from "../../types/fearGreed";
import { IndicatorCard } from "../molecules/IndicatorCard";

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FearGreedData;
}

const IndicatorModal = ({ isOpen, onClose, data }: IndicatorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            7 Fear & Greed Indicators
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
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
