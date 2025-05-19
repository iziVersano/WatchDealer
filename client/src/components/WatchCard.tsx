import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Watch } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppDispatch } from '@/store/store';
import { addFavorite, removeFavorite, selectIsWatchesFavorite } from '@/store/watchSlice';
import { selectIsAuthenticated } from '@/store/authSlice';
import { Star } from 'lucide-react';

interface WatchCardProps {
  watch: Watch;
  onViewDetails?: (watch: Watch) => void;
}

export default function WatchCard({ watch, onViewDetails }: WatchCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isFavorite = useSelector(selectIsWatchesFavorite(watch.id));
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) return;
    
    if (isFavorite) {
      dispatch(removeFavorite(watch.id));
    } else {
      dispatch(addFavorite(watch.id));
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg">
      <div className="relative">
        {isImageLoading && (
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        )}
        
        <img 
          src={imageError ? 'https://via.placeholder.com/400x300?text=Watch+Image' : watch.imageUrl} 
          alt={`${watch.brand} ${watch.model}`} 
          className={cn(
            "w-full h-48 object-cover",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-neutral-800/90 shadow hover:translate-y-[-2px] transition-transform duration-200",
            isFavorite ? "text-amber-400 hover:text-amber-500" : "text-neutral-400 hover:text-neutral-500"
          )}
          onClick={handleToggleFavorite}
        >
          <Star className={cn("h-5 w-5", isFavorite ? "fill-current" : "")} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{watch.brand} {watch.model}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Ref. {watch.reference}</p>
          </div>
          <span className="text-sm font-semibold text-amber-500">{formatPrice(watch.price)}</span>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-neutral-600 dark:text-neutral-400">Size:</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">{watch.size}mm</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Material:</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">{watch.material}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button 
            className="w-full bg-primary hover:bg-primary-light text-white"
            onClick={() => onViewDetails && onViewDetails(watch)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
