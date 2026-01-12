import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Spinner } from "@/components/ui/spinner";
import { useState, type ChangeEvent } from "react";
import {
  Controller,
  useForm,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import { IoWarningOutline, IoCloseCircle } from "react-icons/io5";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProductSchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ColorSelector from "@/components/Form/ColorSelector/ColorSelector";
import { Link } from "react-router";
import CustomSpecifications from "@/components/Form/CustomSpecifications/CustomSpecifications";

export type TProductFormData = {
  title: string;
  description: string;
  tags: string;
  warranty: string;
  brand?: string;
  colors?: string[];
};

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg",
];

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

export default function CreateProduct() {
  const [imageFiles, setImageFiles] = useState<ImagePreview[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const validateImage = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPG, PNG, SVG and WebP images are allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Image size must be less than 5MB";
    }
    return null;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (imageFiles.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      e.target.value = "";
      return;
    }

    const remainingSlots = MAX_IMAGES - imageFiles.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more image's can be added`);
    }

    setIsImageLoading(true);

    const newImages: ImagePreview[] = [];
    let processedCount = 0;

    filesToProcess.forEach((file) => {
      const validationError = validateImage(file);

      if (validationError) {
        toast.error(validationError);
        processedCount++;
        if (processedCount === filesToProcess.length) {
          setIsImageLoading(false);
        }
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          file,
          preview: reader.result as string,
          id: `${Date.now()}-${Math.random()}`,
        });

        processedCount++;
        if (processedCount === filesToProcess.length) {
          setImageFiles((prev) => [...prev, ...newImages]);
          setIsImageLoading(false);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
        processedCount++;
        if (processedCount === filesToProcess.length) {
          setIsImageLoading(false);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImageFiles((prev) => prev.filter((img) => img.id !== id));
  };

  const { handleSubmit, control } = useForm<TProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      warranty: "",
      brand: "",
      colors: [],
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (imageFiles.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    console.log(data);

    const formData = new FormData();

    formData.append("productData", JSON.stringify(data));

    imageFiles.forEach((img) => {
      formData.append("productImages", img.file);
    });
  };

  return (
    <section className="min-h-[300vh]  max-w-7xl mx-auto">
      {/* Title and Breadcrumb section */}
      <section className="space-y-1">
        <h2 className="text-xl font-semibold font-poppins">Create Product</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={"/dashboard"}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>
      {/* main create form */}
      <form
        className="flex flex-col lg:flex-row gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* image upload section */}
        <div className="lg:w-[35%] mt-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Product Images
            <span className="text-muted-foreground ml-2">
              ({imageFiles.length}/{MAX_IMAGES})
            </span>
          </label>

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="productImages"
              className={`flex flex-col items-center justify-center w-full h-48 md:h-56 border-2 border-dashed rounded cursor-pointer transition-all duration-200 ${
                imageFiles.length >= MAX_IMAGES
                  ? "border-border/40 bg-card/30 cursor-not-allowed opacity-40"
                  : "border-border hover:border-primary/50 bg-card/50 hover:bg-card/80"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isImageLoading ? (
                  <Spinner className="size-10" color="primary" />
                ) : (
                  <>
                    <div className="mb-4 p-3 rounded-full bg-primary/10">
                      <HiOutlinePhotograph className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <p className="mb-2 text-sm text-foreground text-center px-4">
                      <span className="font-semibold">Click to upload</span>{" "}
                      <span className="text-muted-foreground">
                        or drag and drop
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground text-center px-4 mb-1">
                      PNG, JPG, SVG, or WebP (max 5MB per image)
                    </p>
                    <p className="text-xs text-primary/70 text-center px-4 font-medium">
                      Recommended: 1200×1200px or 2000×2000px
                    </p>
                  </>
                )}
              </div>
              <input
                onChange={handleImageChange}
                multiple
                id="productImages"
                type="file"
                className="hidden"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                disabled={imageFiles.length >= MAX_IMAGES || isImageLoading}
                aria-label="Upload product images"
              />
            </label>
          </div>

          {imageFiles.length === 0 && (
            <Alert
              variant="destructive"
              className="mt-3 bg-destructive/10 border border-destructive/20"
            >
              <IoWarningOutline />
              <AlertDescription>
                At least one product image is required
              </AlertDescription>
            </Alert>
          )}

          {imageFiles.length > 0 && (
            <div className="mt-5">
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-3">
                {imageFiles.map((imageData, index) => (
                  <div
                    key={imageData.id}
                    className="relative group aspect-square rounded border border-border overflow-hidden bg-card hover:border-primary/50 transition-all duration-200"
                  >
                    <img
                      src={imageData.preview}
                      alt={`Product image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(imageData.id)}
                      className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-white rounded-full p-1.5 lg:opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <IoCloseCircle className="w-4 h-4" />
                    </button>

                    {/* Primary Badge */}
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-md shadow-lg">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Alert className="mt-3">
                <AlertCircleIcon />
                <AlertDescription className="text-xs">
                  The first image will be used as the primary product image in
                  listings and search results
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        {/* Right side : form inputs */}
        <div className="flex-1 mt-6">
          <FieldGroup>
            {/* product title */}
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Product Title *</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter product title"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* short description */}
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">
                    Short Description * (Max 150 character)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter product description for quick view"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* tags */}
            <Controller
              name="tags"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tags">Tags *</FieldLabel>
                  <Input
                    {...field}
                    id="tags"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="apple, flagship"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* warranty */}
            <Controller
              name="warranty"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="warranty">Warranty *</FieldLabel>
                  <Input
                    {...field}
                    id="warranty"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="1 Year / No Warranty"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* brand */}
            <Controller
              name="brand"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="brand">Brand</FieldLabel>
                  <Input
                    {...field}
                    id="brand"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Samsung"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Color Selector */}
            <ColorSelector control={control} />

            {/* Custom Specifications */}
            <CustomSpecifications control={control} />

            <Button>Create</Button>
          </FieldGroup>
        </div>
      </form>
    </section>
  );
}
