import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

import cloudinary from "../lib/cloudinary";

export async function uploadImage(
    buffer: Buffer
): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "chatapp/messages",
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Image upload failed."));
                    return;
                }

                resolve(result);

            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
}