import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addBrandFilter, 
  removeBrandFilter, 
  addSizeFilter, 
  removeSizeFilter, 
  addMaterialFilter, 
  removeMaterialFilter, 
  setPriceRange, 
  clearFilters, 
  selectFilters,
  selectWatches, 
  applyFilters,
  fetchWatches 
} from '@/store/watchSlice';
import { AppDispatch } from '@/store/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Brand options
const BRANDS = [
  'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Omega', 'Cartier', 
  'IWC', 'Jaeger-LeCoultre', 'Tudor', 'Grand Seiko', 'Vacheron Constantin'
];

// Size options
const SIZES = [36, 38, 39, 40, 41, 42, 44, 45];

// Material options
const MATERIALS = [
  'Steel', 'Titanium', 'Yellow Gold', 'Rose Gold', 'White Gold', 
  'Platinum', 'Two-Tone', 'Ceramic', 'Carbon Fiber'
];

// Price range options
const PRICE_RANGES: Array<[number, number]> = [
  [5000, 10000],
  [10000, 25000],
  [25000, 50000],
  [50000, 100000],
  [100000, 1000000],
];

export default function FilterSection() {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector(selectFilters);
  const watches = useSelector(selectWatches);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  
  // Dropdown states
  const [brandOpen, setBrandOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  
  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Search in watch brand, model, reference
    const results = watches
      .filter(watch => 
        watch.brand.toLowerCase().includes(term) || 
        watch.model.toLowerCase().includes(term) || 
        watch.reference.toLowerCase().includes(term)
      )
      .map(watch => `${watch.brand} ${watch.model} ${watch.reference}`)
      .slice(0, 5); // Limit to 5 results
    
    // Remove duplicates manually without using Set
    const uniqueResults: string[] = [];
    results.forEach(result => {
      if (!uniqueResults.includes(result)) {
        uniqueResults.push(result);
      }
    });
    setSearchResults(uniqueResults);
  }, [searchTerm, watches]);

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchWatches());
  };

  const handleRemoveBrand = (brand: string) => {
    dispatch(removeBrandFilter(brand));
    dispatch(applyFilters());
    dispatch(fetchWatches({
      ...filters,
      brand: filters.brand.filter(b => b !== brand)
    }));
  };

  const handleRemoveSize = (size: number) => {
    dispatch(removeSizeFilter(size));
    dispatch(applyFilters());
    dispatch(fetchWatches({
      ...filters,
      size: filters.size.filter(s => s !== size)
    }));
  };

  const handleRemoveMaterial = (material: string) => {
    dispatch(removeMaterialFilter(material));
    dispatch(applyFilters());
    dispatch(fetchWatches({
      ...filters,
      material: filters.material.filter(m => m !== material)
    }));
  };

  const handleRemovePriceRange = () => {
    dispatch(setPriceRange(null));
    dispatch(applyFilters());
    dispatch(fetchWatches({
      ...filters,
      priceRange: null
    }));
  };

  const handleAddBrand = (brand: string) => {
    dispatch(addBrandFilter(brand));
    dispatch(applyFilters());
    setBrandOpen(false);
    dispatch(fetchWatches({
      ...filters,
      brand: [...filters.brand, brand]
    }));
  };

  const handleAddSize = (size: number) => {
    dispatch(addSizeFilter(size));
    dispatch(applyFilters());
    setSizeOpen(false);
    dispatch(fetchWatches({
      ...filters,
      size: [...filters.size, size]
    }));
  };

  const handleAddMaterial = (material: string) => {
    dispatch(addMaterialFilter(material));
    dispatch(applyFilters());
    setMaterialOpen(false);
    dispatch(fetchWatches({
      ...filters,
      material: [...filters.material, material]
    }));
  };

  const handleSetPriceRange = (range: [number, number]) => {
    dispatch(setPriceRange(range));
    dispatch(applyFilters());
    setPriceOpen(false);
    dispatch(fetchWatches({
      ...filters,
      priceRange: range
    }));
  };

  const hasActiveFilters = filters.brand.length > 0 || 
                          filters.size.length > 0 || 
                          filters.material.length > 0 || 
                          filters.priceRange !== null;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Filters</h3>
          {hasActiveFilters && (
            <Button 
              variant="link" 
              className="text-sm text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 p-0"
              onClick={handleClearFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary">
            <Search className="h-4 w-4 mx-3 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search by brand, model, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-neutral-800 shadow-lg">
              <ul className="py-1 overflow-auto text-base divide-y divide-neutral-200 dark:divide-neutral-700">
                {searchResults.map((result, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    onClick={() => {
                      // Parse result to extract brand
                      const brand = result.split(' ')[0];
                      if (!filters.brand.includes(brand)) {
                        dispatch(addBrandFilter(brand));
                        dispatch(applyFilters());
                        dispatch(fetchWatches({
                          ...filters,
                          brand: [...filters.brand, brand]
                        }));
                      }
                      setSearchTerm('');
                    }}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.brand.map(brand => (
            <Badge 
              key={brand} 
              variant="secondary"
              className="transition-transform hover:-translate-y-0.5 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
            >
              {brand}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleRemoveBrand(brand)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {brand} filter</span>
              </Button>
            </Badge>
          ))}
          
          {filters.size.map(size => (
            <Badge 
              key={size} 
              variant="secondary"
              className="transition-transform hover:-translate-y-0.5 bg-primary/10 text-primary dark:bg-blue-900 dark:text-blue-100"
            >
              {size}mm
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleRemoveSize(size)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {size}mm filter</span>
              </Button>
            </Badge>
          ))}
          
          {filters.material.map(material => (
            <Badge 
              key={material} 
              variant="secondary"
              className="transition-transform hover:-translate-y-0.5 bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200"
            >
              {material}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={() => handleRemoveMaterial(material)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {material} filter</span>
              </Button>
            </Badge>
          ))}
          
          {filters.priceRange && (
            <Badge 
              variant="secondary"
              className="transition-transform hover:-translate-y-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
            >
              {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0" 
                onClick={handleRemovePriceRange}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove price filter</span>
              </Button>
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Brand Filter */}
          <DropdownMenu open={brandOpen} onOpenChange={setBrandOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
              >
                <span>Brand</span>
                {brandOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {BRANDS.map(brand => (
                <DropdownMenuItem 
                  key={brand}
                  className="cursor-pointer"
                  disabled={filters.brand.includes(brand)}
                  onClick={() => handleAddBrand(brand)}
                >
                  {brand}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Size Filter */}
          <DropdownMenu open={sizeOpen} onOpenChange={setSizeOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
              >
                <span>Size (mm)</span>
                {sizeOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {SIZES.map(size => (
                <DropdownMenuItem 
                  key={size}
                  className="cursor-pointer"
                  disabled={filters.size.includes(size)}
                  onClick={() => handleAddSize(size)}
                >
                  {size}mm
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Material Filter */}
          <DropdownMenu open={materialOpen} onOpenChange={setMaterialOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
              >
                <span>Material</span>
                {materialOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {MATERIALS.map(material => (
                <DropdownMenuItem 
                  key={material}
                  className="cursor-pointer"
                  disabled={filters.material.includes(material)}
                  onClick={() => handleAddMaterial(material)}
                >
                  {material}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Range Filter */}
          <DropdownMenu open={priceOpen} onOpenChange={setPriceOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between"
              >
                <span>Price Range</span>
                {priceOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              {PRICE_RANGES.map((range, index) => (
                <DropdownMenuItem 
                  key={index}
                  className="cursor-pointer"
                  disabled={filters.priceRange?.[0] === range[0] && filters.priceRange?.[1] === range[1]}
                  onClick={() => handleSetPriceRange(range)}
                >
                  {formatPrice(range[0])} - {range[1] === 1000000 ? '$1,000,000+' : formatPrice(range[1])}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
