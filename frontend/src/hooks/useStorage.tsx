import { useState, useCallback } from 'react';
import { storage } from '../lib/supabase';

interface FileInfo {
  name: string;
  id: string;
  size: number;
  content_type: string;
  created_at: string;
  updated_at: string;
  path: string;
}

interface UploadResult {
  file_path: string;
  public_url: string;
  file_name: string;
  content_type: string;
  size: number;
  uploaded_at: string;
}

interface UseStorageReturn {
  files: FileInfo[];
  loading: boolean;
  error: string | null;
  uploadFile: (bucket: string, path: string, file: File) => Promise<UploadResult | null>;
  downloadFile: (bucket: string, path: string) => Promise<Blob | null>;
  getPublicUrl: (bucket: string, path: string) => string;
  createSignedUrl: (bucket: string, path: string, expiresIn?: number) => Promise<string | null>;
  listFiles: (bucket: string, path?: string, limit?: number, offset?: number) => Promise<void>;
  deleteFile: (bucket: string, path: string) => Promise<boolean>;
  moveFile: (bucket: string, fromPath: string, toPath: string) => Promise<boolean>;
  clearError: () => void;
}

export const useStorage = (): UseStorageReturn => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadFile = useCallback(async (
    bucket: string, 
    path: string, 
    file: File
  ): Promise<UploadResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: uploadError } = await storage.uploadFile(bucket, path, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const publicUrl = storage.getPublicUrl(bucket, path);

      const result: UploadResult = {
        file_path: path,
        public_url: publicUrl,
        file_name: file.name,
        content_type: file.type,
        size: file.size,
        uploaded_at: new Date().toISOString()
      };

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadFile = useCallback(async (
    bucket: string, 
    path: string
  ): Promise<Blob | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: downloadError } = await storage.downloadFile(bucket, path);

      if (downloadError) {
        throw new Error(downloadError.message);
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Download failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPublicUrl = useCallback((bucket: string, path: string): string => {
    return storage.getPublicUrl(bucket, path);
  }, []);

  const createSignedUrl = useCallback(async (
    bucket: string, 
    path: string, 
    expiresIn: number = 3600
  ): Promise<string | null> => {
    try {
      setError(null);

      const { data, error } = await storage.createSignedUrl(bucket, path, expiresIn);

      if (error) {
        throw new Error(error.message);
      }

      return data.signedUrl;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create signed URL';
      setError(errorMessage);
      return null;
    }
  }, []);

  const listFiles = useCallback(async (
    bucket: string, 
    path: string = '', 
    limit: number = 100, 
    offset: number = 0
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await storage.listFiles(bucket, path, limit, offset);

      if (error) {
        throw new Error(error.message);
      }

      const fileList: FileInfo[] = data.map((file: any) => ({
        name: file.name,
        id: file.id,
        size: file.metadata?.size || 0,
        content_type: file.metadata?.mimetype || '',
        created_at: file.created_at,
        updated_at: file.updated_at,
        path: `${path}/${file.name}`.replace(/^\/+/, '')
      }));

      setFiles(fileList);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to list files';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (
    bucket: string, 
    path: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await storage.deleteFile(bucket, path);

      if (error) {
        throw new Error(error.message);
      }

      // Remove from local state
      setFiles(prev => prev.filter(file => file.path !== path));

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete file';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const moveFile = useCallback(async (
    bucket: string, 
    fromPath: string, 
    toPath: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await storage.moveFile(bucket, fromPath, toPath);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setFiles(prev => prev.map(file => 
        file.path === fromPath 
          ? { ...file, path: toPath, name: toPath.split('/').pop() || file.name }
          : file
      ));

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to move file';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    files,
    loading,
    error,
    uploadFile,
    downloadFile,
    getPublicUrl,
    createSignedUrl,
    listFiles,
    deleteFile,
    moveFile,
    clearError
  };
};

export default useStorage; 