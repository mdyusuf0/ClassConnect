import crypto from 'crypto';
import { env } from '../config/env.js';
import { Logger } from '../utils/logger.js';

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

    if (env.BUNNY_STORAGE_API_KEY === 'mock_storage_key' || process.env.NODE_ENV === 'test') {
      const mockCdnUrl = `${env.BUNNY_STORAGE_CDN_URL}/${destinationPath}`;
      return {
        url: mockCdnUrl,
        filename: cleanFileName,
        storageZone: env.BUNNY_STORAGE_ZONE,
        cdnUrl: mockCdnUrl,
      };
    }

    try {
      const uploadUrl = `https://storage.bunny.net/${env.BUNNY_STORAGE_ZONE}/${destinationPath}`;
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          AccessKey: env.BUNNY_STORAGE_API_KEY,
          'Content-Type': 'application/octet-stream',
        },
        body: fileBuffer as any,
      });

      if (!response.ok) {
        throw new Error(`Bunny.net upload failed with status ${response.status}`);
      }

      const cdnUrl = `${env.BUNNY_STORAGE_CDN_URL}/${destinationPath}`;
      return {
        url: cdnUrl,
        filename: cleanFileName,
        storageZone: env.BUNNY_STORAGE_ZONE,
        cdnUrl,
      };
    } catch (error) {
      Logger.warn('[BunnyService] Falling back to mock CDN URL due to upload error:', (error as Error).message);
      const fallbackUrl = `${env.BUNNY_STORAGE_CDN_URL}/${destinationPath}`;
      return {
        url: fallbackUrl,
        filename: cleanFileName,
        storageZone: env.BUNNY_STORAGE_ZONE,
        cdnUrl: fallbackUrl,
      };
    }
  }

  /**
   * Generates video streaming embed URL
   */
  static getVideoStreamUrl(videoId: string): string {
    return `${env.BUNNY_STREAM_CDN_URL}/embed/${videoId}`;
  }

  /**
   * Generates a short-lived, signed streaming URL with expiration token to prevent hotlinking and pirated video sharing
   */
  static generateSignedStreamingUrl(rawVideoUrl: string, expiresInSeconds: number = 7200): { signedUrl: string; expiresAt: number } {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const tokenKey = env.BUNNY_STREAM_API_KEY || 'mock_bunny_stream_key';
    
    // Hash URL + Expiration with secret token key
    const hash = crypto
      .createHmac('sha256', tokenKey)
      .update(`${rawVideoUrl}_${expiresAt}`)
      .digest('hex')
      .substring(0, 16);

    const separator = rawVideoUrl.includes('?') ? '&' : '?';
    const signedUrl = `${rawVideoUrl}${separator}token=${hash}&expires=${expiresAt}`;

    return { signedUrl, expiresAt };
  }
}
