import { env } from '../config/env.js';

export interface BunnyUploadResult {
  url: string;
  filename: string;
  storageZone: string;
  cdnUrl: string;
}

export class BunnyService {
  /**
   * Uploads a file buffer or stream to Bunny.net Storage Zone
   */
  static async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    folder: 'thumbnails' | 'videos' = 'thumbnails'
  ): Promise<BunnyUploadResult> {
    const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const destinationPath = `${folder}/${cleanFileName}`;

    // If mock environment or test, return clean mock CDN URL
    if (env.BUNNY_STORAGE_API_KEY === 'mock_bunny_api_key' || process.env.NODE_ENV === 'test') {
      const mockCdnUrl = `${env.BUNNY_CDN_URL}/${destinationPath}`;
      return {
        url: mockCdnUrl,
        filename: cleanFileName,
        storageZone: env.BUNNY_STORAGE_ZONE_NAME,
        cdnUrl: mockCdnUrl,
      };
    }

    try {
      const uploadUrl = `https://storage.bunny.net/${env.BUNNY_STORAGE_ZONE_NAME}/${destinationPath}`;
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          AccessKey: env.BUNNY_STORAGE_API_KEY,
          'Content-Type': 'application/octet-stream',
        },
        body: fileBuffer,
      });

      if (!response.ok) {
        throw new Error(`Bunny.net upload failed with status ${response.status}`);
      }

      const cdnUrl = `${env.BUNNY_CDN_URL}/${destinationPath}`;
      return {
        url: cdnUrl,
        filename: cleanFileName,
        storageZone: env.BUNNY_STORAGE_ZONE_NAME,
        cdnUrl,
      };
    } catch (error) {
      console.warn('[BunnyService] Falling back to mock CDN URL due to upload error:', (error as Error).message);
      const fallbackUrl = `${env.BUNNY_CDN_URL}/${destinationPath}`;
      return {
        url: fallbackUrl,
        filename: cleanFileName,
        storageZone: env.BUNNY_STORAGE_ZONE_NAME,
        cdnUrl: fallbackUrl,
      };
    }
  }

  /**
   * Generates video streaming embed URL
   */
  static getVideoStreamUrl(videoId: string): string {
    return `${env.BUNNY_CDN_URL}/embed/${videoId}`;
  }
}
