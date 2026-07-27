import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/message";

export function useUploadAttachment() {
    return useMutation({
        mutationFn: uploadImage,
    });
}