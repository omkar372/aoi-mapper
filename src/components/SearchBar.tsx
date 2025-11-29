import React from 'react';
import { Search } from 'lucide-react';
import { searchLocations } from '@/utils/geocoding';
import { useMapStore } from '@/store/mapStore';
import { debounce } from '@/utils/common';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<
    Array<{ lat: number; lon: number; display_name: string }>
  >([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const setCenter = useMapStore((state) => state.setCenter);

  const handleSearch = debounce(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const locations = await searchLocations(searchQuery);
    setResults(locations);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    handleSearch(value);
  };

  const handleSelect = (result: (typeof results)[0]) => {
    setCenter([result.lat, result.lon]);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          aria-label="Search locations"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0 text-sm"
              aria-label={`Select ${result.display_name}`}
            >
              <div className="font-medium text-gray-900">{result.display_name.split(',')[0]}</div>
              <div className="text-xs text-gray-500">{result.display_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
