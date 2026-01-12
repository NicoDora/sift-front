import { useEffect, useRef, useState } from "react";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdCheck,
  MdCheckBox,
  MdDelete,
  MdSearch,
} from "react-icons/md";
import { SECTOR_LIST } from "../../constants/stockScreener";
import { cn } from "../../lib/utils";

interface Props {
  selectedSectors: string[];
  onToggle: (sector: string) => void;
  onSelectAll: (all: string[]) => void;
  onClear: () => void;
}

export const SectorFilterDropdown = ({
  selectedSectors,
  onToggle,
  onSelectAll,
  onClear,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredList = SECTOR_LIST.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors min-w-[120px] justify-between border bg-bodyButtonBg text-bodyButtonText border-bodyBorder hover:bg-bodyButtonBgHover",
          isOpen && "border-blue-500 text-blue-500"
        )}
      >
        <span className="truncate">
          {selectedSectors.length === 0
            ? "Sector (All)"
            : `${selectedSectors.length} selected`}
        </span>
        {isOpen ? <MdArrowUpward /> : <MdArrowDownward />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[280px] bg-bodyButtonBoxBg border border-bodyBorder rounded-lg shadow-xl z-50 flex flex-col">
          {/* 검색창 */}
          <div className="px-3 py-2 border-b border-bodyBorder">
            <div className="relative group">
              <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-bodyTextMuted" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bodyBg border border-bodyBorder rounded-lg pl-8 pr-2 py-1 text-sm focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* 리스트 */}
          <div className="max-h-[240px] overflow-y-auto custom-scrollbar py-1">
            {filteredList.map((sector) => (
              <div
                key={sector}
                onClick={() => onToggle(sector)}
                className="px-3 py-2 flex items-center gap-2 hover:bg-bodyButtonBg cursor-pointer text-sm text-bodyText"
              >
                <div
                  className={cn(
                    "w-4 h-4 border rounded flex items-center justify-center",
                    selectedSectors.includes(sector)
                      ? "bg-blue-600 border-blue-600"
                      : "border-bodyTextMuted"
                  )}
                >
                  {selectedSectors.includes(sector) && (
                    <MdCheck className="text-white text-xs" />
                  )}
                </div>
                <span>{sector}</span>
              </div>
            ))}
          </div>

          {/* 푸터 */}
          <div className="p-2 border-t border-bodyBorder grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectAll(SECTOR_LIST)}
              className="flex items-center justify-center gap-1 text-xs hover:bg-bodyButtonBg py-1 rounded"
            >
              <MdCheckBox /> All
            </button>
            <button
              onClick={onClear}
              className="flex items-center justify-center gap-1 text-xs hover:bg-bodyButtonBg py-1 rounded"
            >
              <MdDelete /> Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
