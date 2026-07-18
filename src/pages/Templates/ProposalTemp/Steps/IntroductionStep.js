



// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   TextField,
//   Typography,
//   Button,
//   Paper,
//   Alert,
//   FormControl,
//   FormHelperText,
//   InputLabel
// } from '@mui/material';
// import { NavigateBefore, NavigateNext } from '@mui/icons-material';
// import Editor from '../../../../components/Editor'; // Adjust the import path as needed


// const IntroductionStep = ({ formData, updateFormData, nextStep, prevStep, stepErrors, setStepErrors }) => {
//   const [touched, setTouched] = useState({});

//   // Handle field blur
//   const handleBlur = (fieldName) => {
//     setTouched(prev => ({
//       ...prev,
//       [fieldName]: true
//     }));
//   };

//   // Handle title change
//   const handleTitleChange = (e) => {
//     const value = e.target.value;
//     updateFormData('introduction', { 
//       ...formData.introduction, 
//       title: value 
//     });

//     // Clear error when user starts typing
//     if (value.trim() !== '' && stepErrors.title) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.title;
//         return newErrors;
//       });
//     }
//   };

//   // Handle description change from editor
//   const handleDescriptionChange = (content) => {
//     updateFormData('introduction', { 
//       ...formData.introduction, 
//       description: content 
//     });

//     // Clear error when user starts typing
//     const textContent = content.replace(/<[^>]*>/g, '').trim();
//     if (textContent !== '' && stepErrors.description) {
//       setStepErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.description;
//         return newErrors;
//       });
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom color="primary" fontWeight="600" sx={{ mb: 4 }}>
//         Introduction
//       </Typography>

//       <Paper elevation={0} sx={{ p: 3, mb: 3, }}>
//         <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
//           Explain to your clients who you are, what services you provide, the value you bring, 
//           and any other information you want to share.
//         </Typography>

//         <TextField
//           fullWidth
//           // label="Introduction Title"
//           value={formData.introduction?.title || ''}
//           onChange={handleTitleChange}
//           onBlur={() => handleBlur('title')}
//           error={!!stepErrors.title}
//           helperText={stepErrors.title}
//           placeholder="Enter introduction title"
//           required
//           margin="normal"
//           sx={{ mb: 3 }}
//         />

//         <FormControl fullWidth error={!!stepErrors.description}>
//           <Box sx={{ mt: 2, mb: 1 }}>
//             <Editor
//               value={formData.introduction?.description || ''}
//               onChange={handleDescriptionChange}
//               onBlur={() => handleBlur('description')}
//             />
//           </Box>
//           {stepErrors.description && (
//             <FormHelperText error>{stepErrors.description}</FormHelperText>
//           )}
//         </FormControl>
//       </Paper>
//     </Box>
//   );
// };
// export default IntroductionStep;




import React, { useState, useEffect } from 'react';
// import { NavigateBefore, NavigateNext } from 'lucide-react';
import Editor from '../../../../components/TextEditor'; // Adjust the import path as needed
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';

const IntroductionStep = ({ formData, updateFormData, nextStep, prevStep, stepErrors, setStepErrors }) => {
  const [touched, setTouched] = useState({});

  // Handle field blur
  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };

  // Handle title change
  const handleTitleChange = (e) => {
    const value = e.target.value;
    updateFormData('introduction', { 
      ...formData.introduction, 
      title: value 
    });

    // Clear error when user starts typing
    if (value.trim() !== '' && stepErrors.title) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  };

  // Handle description change from editor
  const handleDescriptionChange = (content) => {
    updateFormData('introduction', { 
      ...formData.introduction, 
      description: content 
    });

    // Clear error when user starts typing
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (textContent !== '' && stepErrors.description) {
      setStepErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.description;
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary mb-4">Introduction</h2>

      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Explain to your clients who you are, what services you provide, the value you bring, 
          and any other information you want to share.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Introduction Title <span className="text-destructive">*</span>
          </label>
          <Input
            value={formData.introduction?.title || ''}
            onChange={handleTitleChange}
            onBlur={() => handleBlur('title')}
            className={stepErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            placeholder="Enter introduction title"
          />
          {stepErrors.title && (
            <p className="text-sm text-destructive mt-1">{stepErrors.title}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Description
          </label>
          <Editor
            value={formData.introduction?.description || ''}
            onChange={handleDescriptionChange}
            onBlur={() => handleBlur('description')}
          />
          {stepErrors.description && (
            <p className="text-sm text-destructive mt-1">{stepErrors.description}</p>
          )}
        </div>
      </div>

     
    </div>
  );
};

export default IntroductionStep;