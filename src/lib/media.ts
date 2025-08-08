// src/lib/media.ts – helper for uploading media files to the backend
// Using native fetch API to avoid extra dependency
import { MediaType } from '../types';

/**
 * Upload a media file (image, audio, video) to the backend.
 * The backend stores the file on S3/Cloudinary and returns a public URL.
 *
 * @param file   The File object selected by the user.
 * @param type   The MediaType (image | audio | video).
 * @returns      The public URL of the uploaded media.
 */
export async function uploadMedia(file: File, type: MediaType): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} ${errorText}`);
  }
  const data = (await response.json()) as { url: string };
  return data.url;
}
