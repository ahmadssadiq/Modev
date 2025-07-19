import os
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status, UploadFile
from supabase import Client
from .supabase import get_supabase_client, get_supabase_admin_client
import uuid
from datetime import datetime

class SupabaseStorageService:
    """Service for handling Supabase Storage operations"""
    
    def __init__(self):
        self.client = get_supabase_client()
        self.admin_client = get_supabase_admin_client()
        self.default_bucket = "ai-cost-optimizer"
    
    async def create_bucket(self, bucket_name: str, public: bool = False) -> Dict[str, Any]:
        """Create a new storage bucket"""
        try:
            response = self.admin_client.storage.create_bucket(
                bucket_name,
                {"public": public}
            )
            return {"message": f"Bucket {bucket_name} created successfully", "bucket": response}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create bucket: {str(e)}"
            )
    
    async def upload_file(
        self, 
        file: UploadFile, 
        bucket_name: str = None,
        folder_path: str = "",
        user_id: str = None
    ) -> Dict[str, Any]:
        """Upload a file to Supabase Storage"""
        try:
            bucket = bucket_name or self.default_bucket
            
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            # Create file path
            if user_id:
                file_path = f"{folder_path}/{user_id}/{unique_filename}".lstrip("/")
            else:
                file_path = f"{folder_path}/{unique_filename}".lstrip("/")
            
            # Upload file
            response = self.client.storage.from_(bucket).upload(
                file_path,
                file.file.read(),
                {"content-type": file.content_type}
            )
            
            # Get public URL
            public_url = self.client.storage.from_(bucket).get_public_url(file_path)
            
            return {
                "file_path": file_path,
                "public_url": public_url,
                "file_name": file.filename,
                "content_type": file.content_type,
                "size": file.size,
                "uploaded_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file: {str(e)}"
            )
    
    async def download_file(self, file_path: str, bucket_name: str = None) -> bytes:
        """Download a file from Supabase Storage"""
        try:
            bucket = bucket_name or self.default_bucket
            response = self.client.storage.from_(bucket).download(file_path)
            return response
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"File not found: {str(e)}"
            )
    
    async def get_file_url(self, file_path: str, bucket_name: str = None, expires_in: int = 3600) -> str:
        """Get a signed URL for file access"""
        try:
            bucket = bucket_name or self.default_bucket
            response = self.client.storage.from_(bucket).create_signed_url(
                file_path,
                expires_in
            )
            return response.signed_url
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate signed URL: {str(e)}"
            )
    
    async def list_files(
        self, 
        bucket_name: str = None, 
        folder_path: str = "",
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """List files in a bucket or folder"""
        try:
            bucket = bucket_name or self.default_bucket
            response = self.client.storage.from_(bucket).list(
                folder_path,
                {"limit": limit, "offset": offset}
            )
            
            files = []
            for file_info in response:
                files.append({
                    "name": file_info.name,
                    "id": file_info.id,
                    "size": file_info.metadata.get("size", 0),
                    "content_type": file_info.metadata.get("mimetype", ""),
                    "created_at": file_info.created_at,
                    "updated_at": file_info.updated_at,
                    "path": f"{folder_path}/{file_info.name}".lstrip("/")
                })
            
            return files
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to list files: {str(e)}"
            )
    
    async def delete_file(self, file_path: str, bucket_name: str = None) -> Dict[str, str]:
        """Delete a file from Supabase Storage"""
        try:
            bucket = bucket_name or self.default_bucket
            response = self.client.storage.from_(bucket).remove([file_path])
            return {"message": f"File {file_path} deleted successfully"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete file: {str(e)}"
            )
    
    async def move_file(
        self, 
        from_path: str, 
        to_path: str, 
        bucket_name: str = None
    ) -> Dict[str, str]:
        """Move a file within the same bucket"""
        try:
            bucket = bucket_name or self.default_bucket
            
            # Download the file
            file_content = await self.download_file(from_path, bucket)
            
            # Upload to new location
            response = self.client.storage.from_(bucket).upload(
                to_path,
                file_content
            )
            
            # Delete from old location
            await self.delete_file(from_path, bucket)
            
            return {"message": f"File moved from {from_path} to {to_path}"}
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to move file: {str(e)}"
            )
    
    async def get_bucket_info(self, bucket_name: str = None) -> Dict[str, Any]:
        """Get information about a bucket"""
        try:
            bucket = bucket_name or self.default_bucket
            response = self.admin_client.storage.get_bucket(bucket)
            return {
                "name": response.name,
                "id": response.id,
                "public": response.public,
                "created_at": response.created_at,
                "updated_at": response.updated_at
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get bucket info: {str(e)}"
            )
    
    async def upload_user_avatar(
        self, 
        file: UploadFile, 
        user_id: str
    ) -> Dict[str, Any]:
        """Upload user avatar image"""
        try:
            # Validate file type
            if not file.content_type.startswith("image/"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only image files are allowed for avatars"
                )
            
            # Upload to user avatars folder
            result = await self.upload_file(
                file=file,
                bucket_name="user-avatars",
                folder_path="",
                user_id=user_id
            )
            
            return result
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload avatar: {str(e)}"
            )
    
    async def upload_usage_report(
        self, 
        file: UploadFile, 
        user_id: str,
        report_type: str = "usage"
    ) -> Dict[str, Any]:
        """Upload usage report file"""
        try:
            # Validate file type
            allowed_types = ["text/csv", "application/json", "application/pdf"]
            if file.content_type not in allowed_types:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only CSV, JSON, and PDF files are allowed for reports"
                )
            
            # Upload to reports folder
            result = await self.upload_file(
                file=file,
                bucket_name="usage-reports",
                folder_path=report_type,
                user_id=user_id
            )
            
            return result
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload report: {str(e)}"
            )

# Global instance - lazy initialization
_supabase_storage_service = None

def get_supabase_storage_service():
    global _supabase_storage_service
    if _supabase_storage_service is None:
        _supabase_storage_service = SupabaseStorageService()
    return _supabase_storage_service 