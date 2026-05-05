import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { accountsAPI } from "../../services/api"; // ✅ adjust path

const ProfilePictureUpload = ({
  accountId,
  currentImage,
  onUploadSuccess,
}) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [isUploading, setIsUploading] = useState(false);
const ACCOUNT_URL = process.env.REACT_APP_ACCOUNT_CONTACT ;
  // ✅ Handle preview update
  useEffect(() => {
    if (currentImage) {
      setPreview(`${ACCOUNT_URL}/${currentImage}`);
    } else {
      setPreview("");
    }
  }, [currentImage]);

  // ✅ Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Upload using accountsAPI
  const handleUpload = async () => {
    if (!image) {
      toast.warning("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", image);

    try {
      setIsUploading(true);

      await accountsAPI.uploadProfilePicture(accountId, formData);

      toast.success("Profile picture updated successfully");

      // Refresh parent data
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setImage(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to upload profile picture"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Avatar */}
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={preview}
          sx={{
            width: 120,
            height: 120,
            border: "2px solid #eee",
          }}
        />

        {/* Hidden Input */}
        <input
          accept="image/*"
          id="profile-picture-upload"
          type="file"
          hidden
          onChange={handleImageChange}
        />

        {/* Edit Button */}
        <label htmlFor="profile-picture-upload">
          <Box
            component="span"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              borderRadius: "10px",
              cursor: "pointer",
              padding: "6px 8px",
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            <EditIcon sx={{ color: "#fff" }} fontSize="small" />
          </Box>
        </label>
      </Box>

      {/* File Info + Upload */}
      {image && (
        <>
          <Typography variant="body2">
            {image.name} ({Math.round(image.size / 1024)} KB)
          </Typography>

          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={isUploading}
            fullWidth
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} color="inherit" />
                <Box sx={{ ml: 1 }}>Uploading...</Box>
              </>
            ) : (
              "Upload Profile Picture"
            )}
          </Button>
        </>
      )}
    </Box>
  );
};

export default ProfilePictureUpload;