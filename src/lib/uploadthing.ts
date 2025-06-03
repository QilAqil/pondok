import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { 
      maxFileSize: "4MB",
      maxFileCount: 1 
    }
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for file:", file);
      return { url: file.ufsUrl };
    }),
};

export type OurFileRouter = typeof ourFileRouter;