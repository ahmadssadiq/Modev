from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Optional
from ..core.supabase_storage import supabase_storage_service
from ..core.auth import get_current_active_user
from ..models.user import User
from ..schemas.user import User as UserSchema

router = APIRouter(prefix="/storage", tags=["storage"])


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    bucket_name: Optional[str] = Form(None),
    folder_path: Optional[str] = Form(""),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a file to Supabase Storage"""
    try:
        result = await supabase_storage_service.upload_file(
            file=file,
            bucket_name=bucket_name,
            folder_path=folder_path,
            user_id=str(current_user.id)
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )


@router.get("/files")
async def list_files(
    bucket_name: Optional[str] = None,
    folder_path: str = "",
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user)
):
    """List files in a bucket or folder"""
    try:
        files = await supabase_storage_service.list_files(
            bucket_name=bucket_name,
            folder_path=folder_path,
            limit=limit,
            offset=offset
        )
        return {"files": files, "total": len(files)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list files: {str(e)}"
        )


@router.get("/files/{file_path:path}")
async def get_file_url(
    file_path: str,
    bucket_name: Optional[str] = None,
    expires_in: int = 3600,
    current_user: User = Depends(get_current_active_user)
):
    """Get a signed URL for file access"""
    try:
        url = await supabase_storage_service.get_file_url(
            file_path=file_path,
            bucket_name=bucket_name,
            expires_in=expires_in
        )
        return {"url": url, "expires_in": expires_in}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get file URL: {str(e)}"
        )


@router.delete("/files/{file_path:path}")
async def delete_file(
    file_path: str,
    bucket_name: Optional[str] = None,
    current_user: User = Depends(get_current_active_user)
):
    """Delete a file from Supabase Storage"""
    try:
        result = await supabase_storage_service.delete_file(
            file_path=file_path,
            bucket_name=bucket_name
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete file: {str(e)}"
        )


@router.post("/move")
async def move_file(
    from_path: str = Form(...),
    to_path: str = Form(...),
    bucket_name: Optional[str] = Form(None),
    current_user: User = Depends(get_current_active_user)
):
    """Move a file within the same bucket"""
    try:
        result = await supabase_storage_service.move_file(
            from_path=from_path,
            to_path=to_path,
            bucket_name=bucket_name
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to move file: {str(e)}"
        )


@router.get("/buckets/{bucket_name}")
async def get_bucket_info(
    bucket_name: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get information about a bucket"""
    try:
        info = await supabase_storage_service.get_bucket_info(bucket_name)
        return info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get bucket info: {str(e)}"
        )


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    """Upload user avatar image"""
    try:
        result = await supabase_storage_service.upload_user_avatar(
            file=file,
            user_id=str(current_user.id)
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload avatar: {str(e)}"
        )


@router.post("/reports")
async def upload_report(
    file: UploadFile = File(...),
    report_type: str = Form("usage"),
    current_user: User = Depends(get_current_active_user)
):
    """Upload usage report file"""
    try:
        result = await supabase_storage_service.upload_usage_report(
            file=file,
            user_id=str(current_user.id),
            report_type=report_type
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload report: {str(e)}"
        )


@router.post("/buckets")
async def create_bucket(
    bucket_name: str = Form(...),
    public: bool = Form(False),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new storage bucket (admin only)"""
    # Check if user has admin privileges
    if current_user.plan not in ["premium", "enterprise"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only premium and enterprise users can create buckets"
        )
    
    try:
        result = await supabase_storage_service.create_bucket(
            bucket_name=bucket_name,
            public=public
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create bucket: {str(e)}"
        ) 