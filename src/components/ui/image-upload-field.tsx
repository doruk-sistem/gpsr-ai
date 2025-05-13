import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ImageUploadFieldProps {
  imagePreview?: string;
  onImageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    imageDataUrl: string
  ) => void;
  altText?: string;
  name?: string;
}

export function ImageUploadField({
  imagePreview,
  onImageChange,
  altText = "Image",
  name = "images",
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, e);
    }
  };

  const processFile = (file: File, e: any) => {
    if (!file.type.match("image.*")) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onImageChange(e, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const dt = e.dataTransfer;
    const file = dt.files[0];

    if (file && file.type.match("image.*")) {
      processFile(file, e);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-[260px] px-6 py-6 border-2 ${
        isDragging
          ? "border-primary border-dashed bg-primary/5"
          : "border-gray-300 border-dashed hover:border-gray-400"
      } rounded-lg transition-colors`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {imagePreview ? (
        <div className="relative w-full h-full group">
          <Image
            src={imagePreview}
            alt={altText}
            fill
            className="object-contain rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="cursor-pointer rounded-md px-4 py-2 font-medium text-white">
              <span>Change Image</span>
              <Input
                type="file"
                name={name}
                className="sr-only"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-center">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90">
              <span>Upload Image</span>
              <Input
                type="file"
                name={name}
                className="sr-only"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG - max 2MB</p>
        </div>
      )}
    </div>
  );
}
