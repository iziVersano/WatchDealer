import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Watch, WatchFormData } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  reference: z.string().min(1, "Reference number is required"),
  size: z.coerce.number().min(1, "Size must be greater than 0"),
  material: z.string().min(1, "Material is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  imageUrl: z.string().url("Must be a valid URL"),
});

interface WatchFormProps {
  watch?: Watch;
  onSubmit: (data: WatchFormData) => Promise<void>;
  isSubmitting: boolean;
}

// Brand options
const BRANDS = ['Rolex', 'Patek Philippe', 'Omega', 'Audemars Piguet', 'Cartier', 'Jaeger-LeCoultre', 'IWC', 'Breitling', 'Tag Heuer', 'Longines'];

// Material options
const MATERIALS = ['Stainless Steel', 'Yellow Gold', 'Rose Gold', 'White Gold', 'Titanium', 'Ceramic', 'Platinum', 'Bronze', 'Carbon Fiber'];

export default function WatchForm({ watch, onSubmit, isSubmitting }: WatchFormProps) {
  const [imagePreview, setImagePreview] = useState(watch?.imageUrl || "");

  // Initialize form with watch data or defaults
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: watch?.brand || "",
      model: watch?.model || "",
      reference: watch?.reference || "",
      size: watch?.size || 40,
      material: watch?.material || "",
      price: watch?.price || 0,
      imageUrl: watch?.imageUrl || "",
    },
  });

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Brand Field */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BRANDS.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model Field */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Submariner" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reference Field */}
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Number</FormLabel>
                  <FormControl>
                    <Input placeholder="126610LN" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size Field */}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (mm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="40"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Material Field */}
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MATERIALS.map((material) => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="13000"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Enter price in dollars (without cents)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            {/* Image URL Field */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleImageUrlChange(e.target.value);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Enter a URL to an image of the watch</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Preview */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Image Preview</p>
              <div className="border rounded-md overflow-hidden h-64 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Watch preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview("")}
                  />
                ) : (
                  <div className="text-neutral-400 dark:text-neutral-500 text-center p-4">
                    <p>No image URL provided or unable to load image</p>
                    <p className="text-xs mt-2">
                      Preview will appear here once a valid image URL is entered
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {watch ? 'Update Watch' : 'Add Watch'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
