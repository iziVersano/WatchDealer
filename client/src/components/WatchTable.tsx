import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { deleteWatch } from "@/store/watchSlice";
import { useToast } from "@/hooks/use-toast";
import { Watch } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface WatchTableProps {
  watches: Watch[];
  onEdit: (watch: Watch) => void;
}

export default function WatchTable({ watches, onEdit }: WatchTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [watchToDelete, setWatchToDelete] = useState<Watch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (watch: Watch) => {
    onEdit(watch);
  };

  const handleDeleteClick = (watch: Watch) => {
    setWatchToDelete(watch);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!watchToDelete) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteWatch(watchToDelete.id)).unwrap();
      toast({
        title: "Watch deleted",
        description: `${watchToDelete.brand} ${watchToDelete.model} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete watch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setWatchToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50 dark:bg-neutral-900">
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Brand & Reference</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watches.map((watch) => (
              <TableRow key={watch.id}>
                <TableCell>
                  <div className="h-16 w-16 rounded-md overflow-hidden">
                    <img
                      src={watch.imageUrl}
                      alt={`${watch.brand} ${watch.model}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Watch+Image';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{watch.brand} {watch.model}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Ref. {watch.reference}
                  </div>
                </TableCell>
                <TableCell>{watch.size}mm</TableCell>
                <TableCell>{watch.material}</TableCell>
                <TableCell className="font-semibold text-amber-500">
                  {formatPrice(watch.price)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(watch)}
                    className="text-primary dark:text-blue-400 hover:text-primary-light dark:hover:text-blue-300"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(watch)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {watchToDelete?.brand}{" "}
              {watchToDelete?.model} (Ref. {watchToDelete?.reference})? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
