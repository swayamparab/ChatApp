import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/services/message";

export function useUploadImage() {
    return useMutation({
        mutationFn: uploadImage,
    });
}