import { MdSearch } from 'react-icons/md';

const SearchBar = () => {
  return (
    <div className="relative w-full max-w-[400px]">
      {/* 검색 아이콘 (absolute로 위치 고정) */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-headerSearchPlaceholder">
        <MdSearch className="w-5 h-5" />
      </div>
      
      <input
        type="text"
        placeholder="종목명, 심볼 검색..."
        className="w-full h-10 pl-10 pr-4 bg-headerSearchBg rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-headerSearchText placeholder:text-headerSearchPlaceholder duration-transitionDuration"
      />
    </div>
  );
};

export default SearchBar;