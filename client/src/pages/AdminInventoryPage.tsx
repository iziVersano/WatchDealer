import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "wouter";
import { AppDispatch } from "@/store/store";
import { 
  fetchWatches, 
  createWatch, 
  updateWatch, 
  selectWatches
} from "@/store/watchSlice";
import { selectIsAdmin } from "@/store/authSlice";
import { Watch, WatchFormData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import WatchTable from "@/components/WatchTable";
import WatchForm from "@/components/WatchForm";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, PlusCircle } from "lucide-react";

export default function AdminInventoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [location, setLocation] = useLocation();
  const watches = useSelector(selectWatches);
  const isAdmin = useSelector(selectIsAdmin);
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const watchesPerPage = 10;

  // Temporarily bypass admin check for testing
  // useEffect(() => {
  //   if (isAdmin === false) {
  //     setLocation('/');
  //   }
  // }, [isAdmin, setLocation]);

  useEffect(() => {
    const loadWatches = async () => {
      setLoading(true);
      try {
        await dispatch(fetchWatches()).unwrap();
      } catch (error) {
        console.error('Failed to fetch watches:', error);
        toast({
          title: "Error",
          description: "Failed to load inventory. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWatches();
  }, [dispatch, toast]);

  const handleAddWatch = () => {
    setEditingWatch(null);
    setFormOpen(true);
  };

  const handleEditWatch = (watch: Watch) => {
    setEditingWatch(watch);
    setFormOpen(true);
  };

  const handleSubmit = async (data: WatchFormData) => {
    setIsSubmitting(true);
    try {
      if (editingWatch) {
        await dispatch(updateWatch({ id: editingWatch.id, data })).unwrap();
        toast({
          title: "Success",
          description: "Watch updated successfully.",
        });
      } else {
        await dispatch(createWatch(data)).unwrap();
        toast({
          title: "Success",
          description: "Watch added successfully.",
        });
      }
      setFormOpen(false);
    } catch (error) {
      console.error('Failed to save watch:', error);
      toast({
        title: "Error",
        description: "Failed to save watch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination logic
  const indexOfLastWatch = currentPage * watchesPerPage;
  const indexOfFirstWatch = indexOfLastWatch - watchesPerPage;
  const currentWatches = watches.slice(indexOfFirstWatch, indexOfLastWatch);
  const totalPages = Math.ceil(watches.length / watchesPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (!isAdmin) {
    return null; // Will redirect due to useEffect
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900 dark:text-neutral-100">
            Manage Inventory
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Add, edit, or remove watches from inventory
          </p>
        </div>
        <Button 
          onClick={handleAddWatch}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Watch
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-neutral-600 dark:text-neutral-400">
            Loading inventory...
          </span>
        </div>
      ) : watches.length > 0 ? (
        <>
          <WatchTable watches={currentWatches} onEdit={handleEditWatch} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Showing <span className="font-medium">{indexOfFirstWatch + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastWatch, watches.length)}
                </span>{" "}
                of <span className="font-medium">{watches.length}</span> watches
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          paginate(index + 1);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )).slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        paginate(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={PlusCircle}
          title="No watches in inventory"
          description="Add your first watch to the inventory to get started."
          action={{
            label: "Add Watch",
            onClick: handleAddWatch,
          }}
        />
      )}

      {/* Add/Edit Watch Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {editingWatch ? "Edit Watch" : "Add New Watch"}
            </DialogTitle>
          </DialogHeader>
          <WatchForm
            watch={editingWatch || undefined}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
