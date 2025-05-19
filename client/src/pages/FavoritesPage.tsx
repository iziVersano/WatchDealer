import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchFavorites, selectFavorites } from '@/store/watchSlice';
import { Watch } from '@/types';
import WatchCard from '@/components/WatchCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';

export default function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector(selectFavorites);
  const [loading, setLoading] = useState(true);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        await dispatch(fetchFavorites()).unwrap();
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [dispatch]);

  const handleViewDetails = (watch: Watch) => {
    setSelectedWatch(watch);
  };

  const closeDetails = () => {
    setSelectedWatch(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-neutral-900 dark:text-neutral-100">
          Your Favorites
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Manage your favorite watches
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((watch) => (
            <WatchCard
              key={watch.id}
              watch={watch}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
          <div className="mx-auto w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-neutral-400 dark:text-neutral-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            No favorites yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Start adding watches to your favorites by clicking the star icon.
          </p>
        </div>
      )}

      {/* Watch Details Dialog */}
      {selectedWatch && (
        <Dialog open={!!selectedWatch} onOpenChange={closeDetails}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedWatch.brand} {selectedWatch.model}
              </DialogTitle>
              <DialogDescription>
                Reference: {selectedWatch.reference}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedWatch.imageUrl}
                  alt={`${selectedWatch.brand} ${selectedWatch.model}`}
                  className="w-full h-auto rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Watch+Image';
                  }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Price
                  </h4>
                  <p className="text-2xl font-semibold text-amber-500">
                    {formatPrice(selectedWatch.price)}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Size
                  </h4>
                  <p className="text-neutral-900 dark:text-neutral-100">
                    {selectedWatch.size}mm
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Material
                  </h4>
                  <p className="text-neutral-900 dark:text-neutral-100">
                    {selectedWatch.material}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Description
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Exquisite timepiece featuring exceptional craftsmanship, precision movement, and elegant design. A perfect addition to any luxury watch collection.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button className="bg-primary hover:bg-primary-light">
                Contact Dealer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
