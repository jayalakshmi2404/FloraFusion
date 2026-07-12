import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "$lib/firebase";

const cache = new Map<string, string>();

/**
 * Resolves a Firebase Storage path into a downloadable URL.
 * If the value is already a URL, it is returned unchanged.
 * Falls back to the placeholder image if the file doesn't exist.
 */
export async function resolveStorageUrl(path: string): Promise<string> {
    if (!path) {
        return "/images/flower-placeholder.svg";
    }

    // Already a valid URL
    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    // Cached URL
    if (cache.has(path)) {
        return cache.get(path)!;
    }

    try {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);

        cache.set(path, url);

        return url;
    } catch (error) {
        console.error("Failed to resolve storage URL:", path, error);
        return "/images/flower-placeholder.svg";
    }
}

export function clearStorageUrlCache(): void {
    cache.clear();
}