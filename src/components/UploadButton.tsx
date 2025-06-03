'use client';

import { UploadButton } from "@uploadthing/react";
import { useState } from "react";
import Image from "next/image";
import { OurFileRouter } from "@/lib/uploadthing";

interface UploadButtonProps {
  onUploadComplete: (url: string) => void;
  value?: string;
}

export default function CustomUploadButton({ onUploadComplete, value }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <UploadButton<OurFileRouter, "imageUploader">
        endpoint="imageUploader"
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          if (res && res[0]?.url) {
            onUploadComplete(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          console.error("Upload error:", error);
        }}
      />
      
      {value && (
        <div className="relative w-full h-48">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover rounded-lg"
            unoptimized
          />
        </div>
      )}
      
      {isUploading && (
        <div className="text-sm text-gray-500">
          Uploading...
        </div>
      )}
    </div>
  );
}