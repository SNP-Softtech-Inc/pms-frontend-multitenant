// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Box, TextField, Button, Typography, Alert } from "@mui/material";
// import { toast } from "react-toastify";
// import { folderManagementAPI } from "../../../services/api";
// const TemplateCreator = () => {
//   const [templatename, setTemplateName] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");
//   setMessage("");

//   try {
//     const res = await folderManagementAPI.createFolderTemplate({
//       templatename,
//     });

//     const data = res.data;

//     const templatePath = data.templatePath;

//     setMessage(`Success! Folder template created: ${templatePath}`);
//     toast.success("Success! Folder template created");

//     const encodedPath = encodeURIComponent(templatePath);

//     navigate(`/firmtemp/templates/tree/${encodedPath}`, {
//       state: { templateName: templatename },
//     });
//   } catch (err) {
//     console.error(err);

//     const errorMsg =
//       err.response?.data?.error || "Failed to create folder template";

//     setError(errorMsg);
//     toast.error(errorMsg);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
  
//     <Box
//       sx={{
//         margin: "auto",
//         padding: 3,
      
//         display: "flex",
//         flexDirection: "column",
//         // alignItems: "center",
//         boxShadow: 3,
//         borderRadius: 2,
//         backgroundColor: "#fff",
//       }}
//     >
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Create Folder Template
//       </Typography>

//       <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
//         <TextField
//           label="Template Name"
//           variant="outlined"
//           fullWidth
//           required
//           value={templatename}
//           onChange={(e) => setTemplateName(e.target.value)}
//           sx={{ mb: 2 }}
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           // fullWidth
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create"}
//         </Button>
//       </Box>

//       {message && (
//         <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
//           {message}
//         </Alert>
//       )}
//       {error && (
//         <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
//           {error}
//         </Alert>
//       )}
//     </Box>
//   );
// };

// export default TemplateCreator;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormPage, FormSection, FormField } from "../../../components/ui/form-layout";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { FolderPlus } from "lucide-react";
import { folderManagementAPI } from "../../../services/api";

const TemplateCreator = () => {
  const [templatename, setTemplateName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await folderManagementAPI.createFolderTemplate({
        templatename,
      });

      const data = res.data;
      const templatePath = data.templatePath;

      setMessage(`Success! Folder template created: ${templatePath}`);
      toast.success("Success! Folder template created");

      const encodedPath = encodeURIComponent(templatePath);
      navigate(`/firmtemp/templates/tree/${encodedPath}`, {
        state: { templateName: templatename },
      });
    } catch (err) {
      console.error(err);
      
      const errorMsg =
        err.response?.data?.error || "Failed to create folder template";
      
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPage
      title="Create Folder Template"
      subtitle="Set up a new document folder template"
    >
      <FormSection title="Template Info" icon={<FolderPlus className="h-4 w-4" />}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Template Name">
            <Input
              placeholder="Enter template name"
              required
              value={templatename}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </FormField>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>

        {message && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </FormSection>
    </FormPage>
  );
};

export default TemplateCreator;