



// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '../../../components/ui/dialog';
// import { Button } from '../../../components/ui/button';
// import {
//   ChevronLeft,
//   ChevronRight,
//   Download,
//   Printer,
//   RotateCw,
//   ZoomIn,
//   ZoomOut,
//   X,
//   Maximize2,
//   Minimize2,
//   FileText,
//   FileSpreadsheet,
//   File,
//   FileImage,
// } from 'lucide-react';
// import { ArrowLeft } from 'lucide-react';
// import { officeViewerUrl, previewUrl } from '../../../lib/filePreview';

// // Component to render text files
// const TextViewer = ({ fileUrl, fileName, scale, rotation }) => {
//   const [content, setContent] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch(fileUrl)
//       .then(response => {
//         if (!response.ok) throw new Error('Failed to load file');
//         return response.text();
//       })
//       .then(text => {
//         setContent(text);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [fileUrl]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-full text-destructive">
//         <p>Error loading text file: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="w-full h-full overflow-auto bg-white rounded-lg p-4"
//       style={{
//         transform: `rotate(${rotation}deg)`,
//         transformOrigin: 'center center',
//       }}
//     >
//       <pre
//         className="whitespace-pre-wrap font-mono text-sm text-foreground"
//         style={{
//           fontSize: `${scale * 0.875}rem`,
//         }}
//       >
//         {content}
//       </pre>
//     </div>
//   );
// };

// // Component for Office documents (Word, Excel) with zoom support
// //
// // v1.88.0: the iframe gets its src directly. It used to be set from an effect
// // through a ref - but the first render showed a spinner instead of the
// // iframe, so the ref was still null when the effect ran, the src was never
// // set, and Excel/Word files opened in this viewer as a blank pane.
// export const OfficeViewer = ({ fileUrl, fileName, scale = 1, rotation = 0, fileType }) => (
//   <div
//     className="w-full h-full"
//     style={{
//       transform: `rotate(${rotation}deg) scale(${scale})`,
//       transformOrigin: 'center center',
//     }}
//   >
//     <iframe
//       src={officeViewerUrl(fileUrl)}
//       className="w-full h-full border-0 rounded-lg"
//       title={`${fileType} Document: ${fileName}`}
//       sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
//     />
//   </div>
// );

// // Component for PDF files - uses the browser's native PDF viewer via iframe
// const PdfViewer = ({ fileUrl, fileName, rotation, onDownload }) => {
//   const [error, setError] = useState(null);

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-center p-8">
//         <FileText className="h-16 w-16 text-red-500 mb-4" />
//         <h3 className="text-lg font-semibold mb-2">PDF Preview Unavailable</h3>
//         <p className="text-sm text-muted-foreground mb-4 max-w-md">
//           Unable to load this PDF. You can download it to view locally.
//         </p>
//         <div className="flex gap-2">
//           <Button variant="default" onClick={onDownload}>
//             <Download className="h-4 w-4 mr-2" />
//             Download PDF
//           </Button>
//           <Button variant="outline" onClick={() => window.open(fileUrl, '_blank')}>
//             Open in New Tab
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // The browser's built-in PDF viewer defaults to fit-whole-page zoom, so a
//   // portrait page inside this wide dialog was scaled down to fit vertically
//   // and left large empty margins either side. FitH fits the page to the
//   // viewer's width instead, so the document actually fills the space.
//   // (Standard PDF open parameter - appended after any existing fragment.)
//   const pdfSrc = `${fileUrl}${fileUrl.includes("#") ? "&" : "#"}view=FitH`;

//   return (
//     <iframe
//       src={pdfSrc}
//       title={fileName}
//       className="w-full h-full border-0 rounded-lg bg-white"
//       style={{
//         transform: `rotate(${rotation}deg)`,
//         transformOrigin: 'center center',
//       }}
//       onError={() => setError(true)}
//     />
//   );
// };

// // Main Document Viewer Component
// const DocumentViewer = ({
//   isOpen,
//   onClose,
//   files,
//   currentIndex,
//   onNavigate,
//   onDownload,
//   onPrint,
// }) => {
//   const FILE_MANAGER_BASE_URL = process.env.REACT_APP_FOLDER_MANAGEMENT;
//   const [scale, setScale] = useState(1.0);
//   const [rotation, setRotation] = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [fileUrl, setFileUrl] = useState('');
//   const containerRef = useRef(null);
//   const viewerRef = useRef(null);

//   const currentFile = files[currentIndex];
//   const totalFiles = files.length;
//   const fileExtension = currentFile?.name?.toLowerCase().split('.').pop() || '';

//   // Determine file type
//   const getFileType = (filename) => {
//     const ext = filename?.toLowerCase().split('.').pop() || '';
//     const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
//     const textExts = ['txt', 'csv', 'md', 'log', 'xml', 'json', 'html', 'css', 'js'];
//     const pdfExts = ["pdf"];
//     const wordExts = ["doc", "docx"];
//     const excelExts = ["xls", "xlsx", "xlsm", "xlsb"];

//     if (imageExts.includes(ext)) return 'image';
//     if (pdfExts.includes(ext)) return 'pdf';
//     if (wordExts.includes(ext)) return 'word';
//     if (excelExts.includes(ext)) return 'excel';
//     if (textExts.includes(ext)) return 'text';
//     return 'other';
//   };

//   const fileType = getFileType(currentFile?.name);
//   const isPdf = fileType === 'pdf';
//   const isImage = fileType === 'image';
//   const isWord = fileType === 'word';
//   const isExcel = fileType === 'excel';
//   const isText = fileType === 'text';
//   const isOffice = isWord || isExcel;

//   // Get file icon
//   const getFileIcon = (filename, size = "h-6 w-6") => {
//     const ext = filename?.toLowerCase().split('.').pop() || '';
//     const iconProps = { className: `${size} shrink-0` };

//     if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
//       return <FileImage {...iconProps} className={`${iconProps.className} text-blue-500`} />;
//     }
//     if (['pdf'].includes(ext)) {
//       return <FileText {...iconProps} className={`${iconProps.className} text-red-500`} />;
//     }
//     if (['doc', 'docx'].includes(ext)) {
//       return <FileText {...iconProps} className={`${iconProps.className} text-blue-600`} />;
//     }
//     if (['xls', 'xlsx', 'xlsm', 'xlsb'].includes(ext)) {
//       return <FileSpreadsheet {...iconProps} className={`${iconProps.className} text-green-600`} />;
//     }
//     if (['txt', 'csv', 'md', 'log', 'xml', 'json'].includes(ext)) {
//       return <FileText {...iconProps} className={`${iconProps.className} text-gray-500`} />;
//     }
//     return <File {...iconProps} className={`${iconProps.className} text-gray-400`} />;
//   };

//   // Get file type label
//   const getFileTypeLabel = (filename) => {
//     const ext = filename?.toLowerCase().split('.').pop() || '';
//     const typeMap = {
//       'pdf': 'PDF',
//       'doc': 'WORD',
//       'docx': 'WORD',
//       'xls': 'EXCEL',
//       'xlsx': 'EXCEL',
//       'xlsm': 'EXCEL',
//       'xlsb': 'EXCEL',
//       'jpg': 'IMAGE',
//       'jpeg': 'IMAGE',
//       'png': 'IMAGE',
//       'gif': 'IMAGE',
//       'bmp': 'IMAGE',
//       'webp': 'IMAGE',
//       'svg': 'IMAGE',
//       'txt': 'TEXT',
//       'csv': 'TEXT',
//       'md': 'TEXT',
//       'log': 'TEXT',
//       'xml': 'TEXT',
//       'json': 'TEXT',
//       'html': 'TEXT',
//       'css': 'TEXT',
//       'js': 'TEXT',
//     };
//     return typeMap[ext] || ext.toUpperCase();
//   };

//   // Update file URL when current file changes
//   useEffect(() => {
//     if (currentFile) {
//       const url = `${FILE_MANAGER_BASE_URL}/uploads/accounts/${currentFile.path}`;
//       setFileUrl(url);
//       setLoading(true);
//       setError(null);
//       // Reset zoom and rotation when switching files
//       setScale(1.0);
//       setRotation(0);
//     }
//   }, [currentFile]);

//   // Handle fullscreen
//   useEffect(() => {
//     if (isFullscreen && containerRef.current) {
//       containerRef.current.requestFullscreen?.();
//     } else if (!isFullscreen && document.fullscreenElement) {
//       document.exitFullscreen?.();
//     }
//   }, [isFullscreen]);

//   const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
//   const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
//   const handleRotate = () => setRotation(prev => (prev + 90) % 360);
//   const handleResetView = () => {
//     setScale(1.0);
//     setRotation(0);
//   };

//   const handleDownload = () => {
//     if (currentFile) {
//       onDownload(currentFile);
//     }
//   };

//   const handlePrint = () => {
//     if (currentFile && onPrint) {
//       onPrint(currentFile);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       onNavigate(currentIndex - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < totalFiles - 1) {
//       onNavigate(currentIndex + 1);
//     }
//   };

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!isOpen) return;

//       switch (e.key) {
//         case 'ArrowLeft':
//           if (currentIndex > 0) handlePrevious();
//           break;
//         case 'ArrowRight':
//           if (currentIndex < totalFiles - 1) handleNext();
//           break;
//         case 'Escape':
//           onClose();
//           break;
//         case 'f':
//           setIsFullscreen(prev => !prev);
//           break;
//         case 'r':
//           handleRotate();
//           break;
//         case '=':
//         case '+':
//           handleZoomIn();
//           break;
//         case '-':
//           handleZoomOut();
//           break;
//         case '0':
//           handleResetView();
//           break;
//         default:
//           break;
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [isOpen, currentIndex, totalFiles]);

//   // Render the appropriate viewer based on file type
//   const renderContent = () => {
//     if (!currentFile) {
//       return (
//         <div className="flex items-center justify-center h-full">
//           <p className="text-muted-foreground">No document selected</p>
//         </div>
//       );
//     }

//     // PDF Viewer - native browser rendering via iframe
//     if (isPdf) {
//       return (
//         <PdfViewer
//           fileUrl={fileUrl}
//           fileName={currentFile.name}
//           rotation={rotation}
//           onDownload={handleDownload}
//         />
//       );
//     }

//     // Image Viewer
//     if (isImage) {
//       return (
//         <img
//           src={fileUrl}
//           alt={currentFile.name}
//           style={{
//             transform: `rotate(${rotation}deg) scale(${scale})`,
//             transformOrigin: 'center center',
//             maxWidth: '100%',
//             maxHeight: '100%',
//             objectFit: 'contain',
//           }}
//           className="shadow-lg"
//           onLoad={() => setLoading(false)}
//           onError={() => {
//             setError('Failed to load image');
//             setLoading(false);
//           }}
//         />
//       );
//     }

//     // Word Viewer
//     if (isWord) {
//       return (
//         <OfficeViewer
//           fileUrl={fileUrl}
//           fileName={currentFile.name}
//           scale={scale}
//           rotation={rotation}
//           fileType="Word"
//         />
//       );
//     }

//     // Excel Viewer
//     if (isExcel) {
//       return (
//         <OfficeViewer
//           fileUrl={fileUrl}
//           fileName={currentFile.name}
//           scale={scale}
//           rotation={rotation}
//           fileType="Excel"
//         />
//       );
//     }

//     // Text Viewer
//     if (isText) {
//       return (
//         <TextViewer
//           fileUrl={fileUrl}
//           fileName={currentFile.name}
//           scale={scale}
//           rotation={rotation}
//         />
//       );
//     }

//     // Other file types - fallback
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-center p-8">
//         {getFileIcon(currentFile.name, "h-16 w-16")}
//         <h3 className="text-lg font-semibold mt-4 mb-2">{currentFile.name}</h3>
//         <p className="text-sm text-muted-foreground mb-4">
//           This file type ({fileExtension}) cannot be previewed directly.
//         </p>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={handleDownload}>
//             <Download className="h-4 w-4 mr-2" />
//             Download to view
//           </Button>
//           {/* v1.88.0: an Office file opens in the viewer, not as a download. */}
//           <Button variant="outline" onClick={() => window.open(previewUrl(fileUrl, currentFile.name), '_blank', 'noopener,noreferrer')}>
//             Open in new tab
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       {/* flex flex-col overrides DialogContent's default `grid`, which made
//           flex-1 on the preview pane a no-op - the preview then collapsed to
//           its min-h-[400px] and only about a quarter of the page was visible
//           inside a 95vh dialog. */}
//       <DialogContent
//         className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-background flex flex-col"
//         style={{ width: '95vw', height: '95vh' }}
//         ref={containerRef}
//       >
//         {/* Fix: Add DialogTitle for accessibility (visually hidden) */}
//         <DialogTitle className="sr-only">
//           Document Viewer - {currentFile?.name || 'Document'}
//         </DialogTitle>

//         {/* Description for screen readers */}
//         <p id="dialog-description" className="sr-only">
//           Viewing document {currentIndex + 1} of {totalFiles}: {currentFile?.name || 'Document'}
//         </p>

//         {/* Header - Like your reference image */}
//         {/* shrink-0 keeps the header at its natural height now that the
//             dialog is a flex column. pr-10 reserves room for DialogContent's
//             own absolutely-positioned close button (right-4), which was
//             landing on top of the maximize/minimize button. */}
//         <DialogHeader className="p-4 pr-10 border-b border-border bg-background shrink-0">
//           <div className="flex items-center justify-between gap-3">
//             {/* Left side: Navigation arrows and file counter */}
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={onClose}
//                 className="h-8 w-8 hover:bg-muted/50"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>

//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={handlePrevious}
//                   disabled={currentIndex === 0}
//                   className="h-8 w-8 p-0 hover:bg-muted/50"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>

//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={handleNext}
//                   disabled={currentIndex === totalFiles - 1}
//                   className="h-8 w-8 p-0 hover:bg-muted/50"
//                 >
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>

//               <span className="text-sm font-medium text-muted-foreground">
//                 {currentIndex + 1} of {totalFiles} files
//               </span>
//             </div>

//             {/* Center: file name (the single, readable instance) with its
//                 type badge - previously the name only appeared in small muted
//                 text in the zoom bar and again in the footer. */}
//             <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-2">
//               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border shrink-0">
//                 {getFileIcon(currentFile?.name, "h-5 w-5")}
//                 <span className="text-xs font-semibold text-muted-foreground">
//                   {getFileTypeLabel(currentFile?.name)}
//                 </span>
//               </div>
//               <span
//                 className="truncate text-sm font-medium text-foreground"
//                 title={currentFile?.name || ''}
//               >
//                 {currentFile?.name || ''}
//               </span>
//             </div>

//             {/* Right side: Action buttons */}
//             <div className="flex items-center gap-1">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleDownload}
//                 className="h-8 px-3 hover:bg-muted/50"
//                 title="Download file"
//               >
//                 <Download className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handlePrint}
//                 className="h-8 px-3 hover:bg-muted/50"
//                 title="Print file"
//               >
//                 <Printer className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setIsFullscreen(prev => !prev)}
//                 className="h-8 w-8 p-0 hover:bg-muted/50"
//                 title="Toggle fullscreen (F)"
//               >
//                 {isFullscreen ? (
//                   <Minimize2 className="h-4 w-4" />
//                 ) : (
//                   <Maximize2 className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Toolbar - Zoom, Rotate, Reset controls */}
//         <div className="flex flex-wrap items-center gap-1 px-4 py-1.5 border-b border-border bg-muted/5 shrink-0">
//           {/* Zoom controls - Not applicable to native PDF rendering, hidden for PDFs */}
//           {!isPdf && (
//             <div className="flex items-center gap-1">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleZoomOut}
//                 disabled={scale <= 0.5}
//                 className="h-7 w-7 p-0 hover:bg-muted/50"
//                 title="Zoom out (-)"
//               >
//                 <ZoomOut className="h-3.5 w-3.5" />
//               </Button>
//               <span className="text-xs font-medium min-w-[45px] text-center text-muted-foreground">
//                 {Math.round(scale * 100)}%
//               </span>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleZoomIn}
//                 disabled={scale >= 3}
//                 className="h-7 w-7 p-0 hover:bg-muted/50"
//                 title="Zoom in (+/=)"
//               >
//                 <ZoomIn className="h-3.5 w-3.5" />
//               </Button>
//             </div>
//           )}

//           {!isPdf && <div className="h-5 w-px bg-border mx-1" />}

//           {/* Rotate controls - Available for ALL file types, including PDFs */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleRotate}
//             className="h-7 w-7 p-0 hover:bg-muted/50"
//             title="Rotate 90° (R)"
//           >
//             <RotateCw className="h-3.5 w-3.5" />
//           </Button>

//           <div className="h-5 w-px bg-border mx-1" />

//           {/* Reset view - Available for ALL file types */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleResetView}
//             className="h-7 px-2 text-xs hover:bg-muted/50"
//             title="Reset view (0)"
//           >
//             Reset
//           </Button>

//           {/* Note for PDFs: native viewer has its own zoom/page controls built in */}
//           {isPdf && (
//             <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
//               Use the PDF viewer's built-in controls for zoom and page navigation
//             </span>
//           )}

//         </div>

//         {/* Document Preview */}
//         <div
//           ref={viewerRef}
//           className="flex-1 overflow-auto p-2 bg-muted/5"
//           style={{ minHeight: 0 }}
//         >
//           {/* min-h floor removed: the pane is already a sized flex child, and
//               the floor could force a scrollbar on short viewports. Centering
//               stays for images and the fallback card, which don't fill. */}
//           <div className="flex justify-center items-center w-full h-full">
//             {renderContent()}
//           </div>
//         </div>

//         {/* Footer with file info - the file name lives in the header now,
//             so only the metadata that isn't shown up there remains here. */}
//         <DialogFooter className="p-2.5 border-t border-border bg-muted/5 shrink-0">
//           <div className="flex flex-wrap items-center justify-end w-full text-xs text-muted-foreground gap-2">
//             <span className="flex items-center gap-3">
//               <span>
//                 <span className="font-medium">Type:</span> {fileExtension.toUpperCase() || 'Unknown'}
//               </span>
//               <span>
//                 <span className="font-medium">Size:</span> {currentFile?.meta?.size ?
//                   (currentFile.meta.size / 1024).toFixed(1) + ' KB' :
//                   'Unknown'}
//               </span>
//               <span>
//                 <span className="font-medium">View:</span> {isPdf ? `${rotation}°` : `${Math.round(scale * 100)}% • ${rotation}°`}
//               </span>
//             </span>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DocumentViewer;

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileText,
  FileSpreadsheet,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  Presentation,
  ArrowLeft,
} from 'lucide-react';
import { officeViewerUrl, previewUrl } from '../../../lib/filePreview';

// ---------------------------------------------------------------------------
// File type registry - single source of truth for extension -> viewer, icon
// and label. (Previously the extension lists were duplicated in getFileType,
// getFileIcon and getFileTypeLabel and had drifted apart.)
// ---------------------------------------------------------------------------
const FILE_TYPES = {
  image: {
    exts: ['jpg', 'jpeg', 'jfif', 'png', 'apng', 'gif', 'bmp', 'webp', 'svg', 'avif', 'ico', 'tif', 'tiff'],
    label: 'IMAGE',
    icon: FileImage,
    color: 'text-blue-500',
  },
  heic: {
    exts: ['heic', 'heif'],
    label: 'HEIC',
    icon: FileImage,
    color: 'text-blue-500',
  },
  pdf: { exts: ['pdf'], label: 'PDF', icon: FileText, color: 'text-red-500' },
  word: {
    exts: ['doc', 'docx', 'docm', 'dot', 'dotx', 'rtf'],
    label: 'WORD',
    icon: FileText,
    color: 'text-blue-600',
  },
  excel: {
    exts: ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx'],
    label: 'EXCEL',
    icon: FileSpreadsheet,
    color: 'text-green-600',
  },
  powerpoint: {
    exts: ['ppt', 'pptx', 'pptm', 'pps', 'ppsx', 'pot', 'potx'],
    label: 'POWERPOINT',
    icon: Presentation,
    color: 'text-orange-500',
  },
  csv: { exts: ['csv', 'tsv'], label: 'CSV', icon: FileSpreadsheet, color: 'text-green-600' },
  text: {
    exts: [
      'txt', 'md', 'markdown', 'log', 'xml', 'json', 'html', 'htm', 'css', 'scss',
      'js', 'jsx', 'ts', 'tsx', 'yaml', 'yml', 'ini', 'conf', 'cfg', 'env', 'sh',
      'bat', 'ps1', 'py', 'java', 'c', 'cpp', 'h', 'cs', 'go', 'rb', 'php', 'sql',
    ],
    label: 'TEXT',
    icon: FileCode,
    color: 'text-gray-500',
  },
  video: {
    exts: ['mp4', 'webm', 'ogv', 'mov', 'm4v'],
    label: 'VIDEO',
    icon: FileVideo,
    color: 'text-purple-500',
  },
  audio: {
    exts: ['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'opus'],
    label: 'AUDIO',
    icon: FileAudio,
    color: 'text-pink-500',
  },
  // No in-browser preview - registered only for the icon and label.
  archive: {
    exts: ['zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2'],
    label: 'ARCHIVE',
    icon: FileArchive,
    color: 'text-amber-600',
  },
};

const EXT_TO_TYPE = Object.entries(FILE_TYPES).reduce((map, [type, { exts }]) => {
  exts.forEach((ext) => { map[ext] = type; });
  return map;
}, {});

const getExtension = (filename) => filename?.toLowerCase().split('.').pop() || '';
const getFileType = (filename) => EXT_TO_TYPE[getExtension(filename)] || 'other';

const getFileIcon = (filename, size = 'h-6 w-6') => {
  const config = FILE_TYPES[getFileType(filename)];
  const Icon = config?.icon || File;
  return <Icon className={`${size} shrink-0 ${config?.color || 'text-gray-400'}`} />;
};

const getFileTypeLabel = (filename) => {
  const type = getFileType(filename);
  if (type === 'csv') return getExtension(filename).toUpperCase(); // CSV / TSV
  return FILE_TYPES[type]?.label || getExtension(filename).toUpperCase();
};

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------
const Spinner = ({ label }) => (
  <div className="flex flex-col items-center justify-center h-full gap-3">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    {label && <p className="text-sm text-muted-foreground">{label}</p>}
  </div>
);

const PreviewError = ({ title, message, fileName, onDownload }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    {getFileIcon(fileName, 'h-16 w-16')}
    <h3 className="text-lg font-semibold mt-4 mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
    {onDownload && (
      <Button variant="default" onClick={onDownload}>
        <Download className="h-4 w-4 mr-2" />
        Download file
      </Button>
    )}
  </div>
);

// Fetches a file as text, ignoring results that arrive after the file changed.
const useFileText = (fileUrl) => {
  const [state, setState] = useState({ content: '', loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ content: '', loading: true, error: null });

    fetch(fileUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load file (HTTP ${response.status})`);
        return response.text();
      })
      .then((text) => setState({ content: text.replace(/^\uFEFF/, ''), loading: false, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ content: '', loading: false, error: err.message });
      });

    return () => controller.abort();
  }, [fileUrl]);

  return state;
};

// ---------------------------------------------------------------------------
// Text files
// ---------------------------------------------------------------------------
const TextViewer = ({ fileUrl, scale, rotation }) => {
  const { content, loading, error } = useFileText(fileUrl);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        <p>Error loading text file: {error}</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full overflow-auto bg-white rounded-lg p-4"
      style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center center' }}
    >
      <pre
        className="whitespace-pre-wrap font-mono text-sm text-foreground"
        style={{ fontSize: `${scale * 0.875}rem` }}
      >
        {content}
      </pre>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CSV / TSV - rendered as a table
// ---------------------------------------------------------------------------
const MAX_CSV_ROWS = 2000;

// RFC 4180 parser: quoted fields, escaped quotes (""), delimiters and line
// breaks inside quotes, and \n / \r\n / \r line endings.
const parseDelimited = (text, delimiter) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"' && field === '') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  // Drop fully blank lines (e.g. a trailing newline).
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
};

// Picks the most frequent of , ; \t | in the first line (outside quotes).
const detectDelimiter = (text, extension) => {
  if (extension === 'tsv') return '\t';
  const candidates = [',', ';', '\t', '|'];
  const counts = Object.fromEntries(candidates.map((d) => [d, 0]));
  let inQuotes = false;
  for (const c of text) {
    if (c === '"') inQuotes = !inQuotes;
    else if (!inQuotes && (c === '\n' || c === '\r')) break;
    else if (!inQuotes && c in counts) counts[c]++;
  }
  return candidates.reduce((best, d) => (counts[d] > counts[best] ? d : best), ',');
};

const CsvViewer = ({ fileUrl, fileName, scale, rotation }) => {
  const { content, loading, error } = useFileText(fileUrl);
  const [showRaw, setShowRaw] = useState(false);

  const { header, body, totalRows, columnCount } = useMemo(() => {
    if (!content) return { header: [], body: [], totalRows: 0, columnCount: 0 };
    const rows = parseDelimited(content, detectDelimiter(content, getExtension(fileName)));
    const [head = [], ...rest] = rows;
    const cols = rows.reduce((max, r) => Math.max(max, r.length), 0);
    return {
      header: head,
      body: rest.slice(0, MAX_CSV_ROWS),
      totalRows: rest.length,
      columnCount: cols,
    };
  }, [content, fileName]);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        <p>Error loading CSV file: {error}</p>
      </div>
    );
  }

  const columns = Array.from({ length: columnCount }, (_, i) => i);

  return (
    <div
      className="w-full h-full flex flex-col bg-white rounded-lg overflow-hidden"
      style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center center' }}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-border text-xs text-muted-foreground shrink-0">
        <span>
          {totalRows.toLocaleString()} rows, {columnCount} columns
          {totalRows > MAX_CSV_ROWS && ` (showing the first ${MAX_CSV_ROWS.toLocaleString()})`}
        </span>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setShowRaw((v) => !v)}>
          {showRaw ? 'Show table' : 'Show raw text'}
        </Button>
      </div>

      {showRaw ? (
        <pre
          className="flex-1 overflow-auto p-4 whitespace-pre font-mono text-foreground"
          style={{ fontSize: `${scale * 0.875}rem` }}
        >
          {content}
        </pre>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="border-collapse text-foreground" style={{ fontSize: `${scale * 0.8125}rem` }}>
            <thead className="sticky top-0 z-10 bg-muted">
              <tr>
                <th className="px-2 py-1.5 border border-border text-right text-muted-foreground font-normal">#</th>
                {columns.map((i) => (
                  <th key={i} className="px-3 py-1.5 border border-border text-left font-semibold whitespace-nowrap">
                    {header[i] ?? ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={r} className="odd:bg-white even:bg-muted/20 hover:bg-muted/40">
                  <td className="px-2 py-1 border border-border text-right text-muted-foreground tabular-nums">
                    {r + 1}
                  </td>
                  {columns.map((i) => (
                    <td key={i} className="px-3 py-1 border border-border whitespace-nowrap max-w-[24rem] truncate" title={row[i] ?? ''}>
                      {row[i] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------
const imageStyle = (scale, rotation) => ({
  transform: `rotate(${rotation}deg) scale(${scale})`,
  transformOrigin: 'center center',
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

const ImageViewer = ({ fileUrl, fileName, scale, rotation, onDownload }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <PreviewError
        title="Image preview unavailable"
        message="This browser can't display this image format. Download the file to view it."
        fileName={fileName}
        onDownload={onDownload}
      />
    );
  }

  return (
    <img
      src={fileUrl}
      alt={fileName}
      style={imageStyle(scale, rotation)}
      className="shadow-lg"
      onError={() => setFailed(true)}
    />
  );
};

// HEIC / HEIF: Safari displays these natively, so the original file is tried
// first. Other browsers fail to decode it, and the image is then converted
// to JPEG in the browser with heic2any (loaded on demand, so it only adds to
// the bundle for users who actually open a HEIC file).
const HeicViewer = ({ fileUrl, fileName, scale, rotation, onDownload }) => {
  const [src, setSrc] = useState(fileUrl);
  const [status, setStatus] = useState('native'); // native | converting | converted | error
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status !== 'converting') return undefined;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to load file (HTTP ${response.status})`);
        const blob = await response.blob();
        const { default: heic2any } = await import('heic2any');
        const result = await heic2any({ blob, toType: 'image/jpeg', quality: 0.9 });
        // Multi-image HEIC files (bursts, live photos) return an array - show the first.
        const jpeg = Array.isArray(result) ? result[0] : result;
        if (cancelled) return;
        setSrc(URL.createObjectURL(jpeg));
        setStatus('converted');
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'The image could not be converted.');
        setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, [status, fileUrl]);

  // Free the converted JPEG when it's replaced or the viewer closes.
  useEffect(() => {
    if (!src.startsWith('blob:')) return undefined;
    return () => URL.revokeObjectURL(src);
  }, [src]);

  if (status === 'converting') return <Spinner label="Converting HEIC image…" />;

  if (status === 'error') {
    return (
      <PreviewError
        title="HEIC preview unavailable"
        message={`This image couldn't be converted for preview (${error}). Download it to view it in your photo app.`}
        fileName={fileName}
        onDownload={onDownload}
      />
    );
  }

  return (
    <img
      src={src}
      alt={fileName}
      style={imageStyle(scale, rotation)}
      className="shadow-lg"
      onError={() => {
        if (status === 'native') {
          setStatus('converting');
        } else {
          setError('The converted image could not be displayed.');
          setStatus('error');
        }
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Video / audio
// ---------------------------------------------------------------------------
const VideoViewer = ({ fileUrl, fileName, scale, rotation, onDownload }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <PreviewError
        title="Video preview unavailable"
        message="This browser can't play this video format. Download the file to watch it."
        fileName={fileName}
        onDownload={onDownload}
      />
    );
  }

  return (
    <video
      src={fileUrl}
      controls
      preload="metadata"
      className="rounded-lg shadow-lg bg-black"
      style={imageStyle(scale, rotation)}
      onError={() => setFailed(true)}
    >
      <track kind="captions" />
    </video>
  );
};

const AudioViewer = ({ fileUrl, fileName, onDownload }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <PreviewError
        title="Audio preview unavailable"
        message="This browser can't play this audio format. Download the file to listen to it."
        fileName={fileName}
        onDownload={onDownload}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 w-full max-w-xl">
      {getFileIcon(fileName, 'h-20 w-20')}
      <p className="text-sm font-medium text-foreground text-center break-all">{fileName}</p>
      <audio src={fileUrl} controls preload="metadata" className="w-full" onError={() => setFailed(true)} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Office documents (Word, Excel, PowerPoint)
//
// v1.88.0: the iframe gets its src directly. It used to be set from an effect
// through a ref - but the first render showed a spinner instead of the
// iframe, so the ref was still null when the effect ran, the src was never
// set, and Excel/Word files opened in this viewer as a blank pane.
// ---------------------------------------------------------------------------
export const OfficeViewer = ({ fileUrl, fileName, scale = 1, rotation = 0, fileType }) => (
  <div
    className="w-full h-full"
    style={{
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transformOrigin: 'center center',
    }}
  >
    <iframe
      src={officeViewerUrl(fileUrl)}
      className="w-full h-full border-0 rounded-lg"
      title={`${fileType} Document: ${fileName}`}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  </div>
);

// ---------------------------------------------------------------------------
// PDF - the browser's native PDF viewer via iframe
// ---------------------------------------------------------------------------
const PdfViewer = ({ fileUrl, fileName, rotation, onDownload }) => {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FileText className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">PDF Preview Unavailable</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          Unable to load this PDF. You can download it to view locally.
        </p>
        <div className="flex gap-2">
          <Button variant="default" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={() => window.open(fileUrl, '_blank')}>
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  }

  // The browser's built-in PDF viewer defaults to fit-whole-page zoom, so a
  // portrait page inside this wide dialog was scaled down to fit vertically
  // and left large empty margins either side. FitH fits the page to the
  // viewer's width instead, so the document actually fills the space.
  // (Standard PDF open parameter - appended after any existing fragment.)
  const pdfSrc = `${fileUrl}${fileUrl.includes('#') ? '&' : '#'}view=FitH`;

  return (
    <iframe
      src={pdfSrc}
      title={fileName}
      className="w-full h-full border-0 rounded-lg bg-white"
      style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center center' }}
      onError={() => setError(true)}
    />
  );
};

// ---------------------------------------------------------------------------
// Main Document Viewer Component
// ---------------------------------------------------------------------------
const OFFICE_LABELS = { word: 'Word', excel: 'Excel', powerpoint: 'PowerPoint' };

const DocumentViewer = ({
  isOpen,
  onClose,
  files,
  currentIndex,
  onNavigate,
  onDownload,
  onPrint,
}) => {
  const FILE_MANAGER_BASE_URL = process.env.REACT_APP_FOLDER_MANAGEMENT;
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  const currentFile = files[currentIndex];
  const totalFiles = files.length;
  const fileExtension = getExtension(currentFile?.name);
  const fileType = getFileType(currentFile?.name);
  const isPdf = fileType === 'pdf';
  const isAudio = fileType === 'audio';

  // Update file URL when current file changes
  useEffect(() => {
    if (currentFile) {
      setFileUrl(`${FILE_MANAGER_BASE_URL}/uploads/accounts/${currentFile.path}`);
      // Reset zoom and rotation when switching files
      setScale(1.0);
      setRotation(0);
    }
  }, [currentFile]);

  // Handle fullscreen
  useEffect(() => {
    if (isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
    } else if (!isFullscreen && document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetView = () => {
    setScale(1.0);
    setRotation(0);
  };

  const handleDownload = () => {
    if (currentFile) onDownload(currentFile);
  };

  const handlePrint = () => {
    if (currentFile && onPrint) onPrint(currentFile);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < totalFiles - 1) onNavigate(currentIndex + 1);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      // Don't hijack keys while a media player or form control has focus
      // (e.g. arrow keys seeking in a video, typing in an input).
      const tag = e.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'VIDEO', 'AUDIO'].includes(tag)) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) handlePrevious();
          break;
        case 'ArrowRight':
          if (currentIndex < totalFiles - 1) handleNext();
          break;
        case 'Escape':
          onClose();
          break;
        case 'f':
          setIsFullscreen((prev) => !prev);
          break;
        case 'r':
          handleRotate();
          break;
        case '=':
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetView();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, totalFiles]);

  // Render the appropriate viewer based on file type
  const renderContent = () => {
    if (!currentFile) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No document selected</p>
        </div>
      );
    }
    if (!fileUrl) return <Spinner />;

    // key={fileUrl} remounts the viewer per file, so loading / error /
    // conversion state never leaks from one file to the next.
    const common = {
      key: fileUrl,
      fileUrl,
      fileName: currentFile.name,
      scale,
      rotation,
      onDownload: handleDownload,
    };

    switch (fileType) {
      case 'pdf':
        return <PdfViewer {...common} />;
      case 'image':
        return <ImageViewer {...common} />;
      case 'heic':
        return <HeicViewer {...common} />;
      case 'word':
      case 'excel':
      case 'powerpoint':
        return <OfficeViewer {...common} fileType={OFFICE_LABELS[fileType]} />;
      case 'csv':
        return <CsvViewer {...common} />;
      case 'text':
        return <TextViewer {...common} />;
      case 'video':
        return <VideoViewer {...common} />;
      case 'audio':
        return <AudioViewer {...common} />;
      default:
        break;
    }

    // Other file types - fallback
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        {getFileIcon(currentFile.name, 'h-16 w-16')}
        <h3 className="text-lg font-semibold mt-4 mb-2">{currentFile.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This file type ({fileExtension}) cannot be previewed directly.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download to view
          </Button>
          {/* v1.88.0: an Office file opens in the viewer, not as a download. */}
          <Button
            variant="outline"
            onClick={() => window.open(previewUrl(fileUrl, currentFile.name), '_blank', 'noopener,noreferrer')}
          >
            Open in new tab
          </Button>
        </div>
      </div>
    );
  };

  // Zoom doesn't apply to the native PDF viewer or to the audio player.
  const showZoom = !isPdf && !isAudio;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* flex flex-col overrides DialogContent's default `grid`, which made
          flex-1 on the preview pane a no-op - the preview then collapsed to
          its min-h-[400px] and only about a quarter of the page was visible
          inside a 95vh dialog. */}
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-background flex flex-col"
        style={{ width: '95vw', height: '95vh' }}
        ref={containerRef}
      >
        <DialogTitle className="sr-only">
          Document Viewer - {currentFile?.name || 'Document'}
        </DialogTitle>

        <p id="dialog-description" className="sr-only">
          Viewing document {currentIndex + 1} of {totalFiles}: {currentFile?.name || 'Document'}
        </p>

        {/* shrink-0 keeps the header at its natural height now that the
            dialog is a flex column. pr-10 reserves room for DialogContent's
            own absolutely-positioned close button (right-4), which was
            landing on top of the maximize/minimize button. */}
        <DialogHeader className="p-4 pr-10 border-b border-border bg-background shrink-0">
          <div className="flex items-center justify-between gap-3">
            {/* Left side: Navigation arrows and file counter */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-muted/50">
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentIndex === totalFiles - 1}
                  className="h-8 w-8 p-0 hover:bg-muted/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <span className="text-sm font-medium text-muted-foreground">
                {currentIndex + 1} of {totalFiles} files
              </span>
            </div>

            {/* Center: file name with its type badge */}
            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border shrink-0">
                {getFileIcon(currentFile?.name, 'h-5 w-5')}
                <span className="text-xs font-semibold text-muted-foreground">
                  {getFileTypeLabel(currentFile?.name)}
                </span>
              </div>
              <span className="truncate text-sm font-medium text-foreground" title={currentFile?.name || ''}>
                {currentFile?.name || ''}
              </span>
            </div>

            {/* Right side: Action buttons */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8 px-3 hover:bg-muted/50" title="Download file">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePrint} className="h-8 px-3 hover:bg-muted/50" title="Print file">
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen((prev) => !prev)}
                className="h-8 w-8 p-0 hover:bg-muted/50"
                title="Toggle fullscreen (F)"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar - Zoom, Rotate, Reset controls */}
        <div className="flex flex-wrap items-center gap-1 px-4 py-1.5 border-b border-border bg-muted/5 shrink-0">
          {showZoom && (
            <>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  className="h-7 w-7 p-0 hover:bg-muted/50"
                  title="Zoom out (-)"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium min-w-[45px] text-center text-muted-foreground">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                  className="h-7 w-7 p-0 hover:bg-muted/50"
                  title="Zoom in (+/=)"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="h-5 w-px bg-border mx-1" />
            </>
          )}

          <Button variant="ghost" size="sm" onClick={handleRotate} className="h-7 w-7 p-0 hover:bg-muted/50" title="Rotate 90° (R)">
            <RotateCw className="h-3.5 w-3.5" />
          </Button>

          <div className="h-5 w-px bg-border mx-1" />

          <Button variant="ghost" size="sm" onClick={handleResetView} className="h-7 px-2 text-xs hover:bg-muted/50" title="Reset view (0)">
            Reset
          </Button>

          {isPdf && (
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
              Use the PDF viewer's built-in controls for zoom and page navigation
            </span>
          )}
        </div>

        {/* Document Preview */}
        <div ref={viewerRef} className="flex-1 overflow-auto p-2 bg-muted/5" style={{ minHeight: 0 }}>
          <div className="flex justify-center items-center w-full h-full">{renderContent()}</div>
        </div>

        {/* Footer with file info */}
        <DialogFooter className="p-2.5 border-t border-border bg-muted/5 shrink-0">
          <div className="flex flex-wrap items-center justify-end w-full text-xs text-muted-foreground gap-2">
            <span className="flex items-center gap-3">
              <span>
                <span className="font-medium">Type:</span> {fileExtension.toUpperCase() || 'Unknown'}
              </span>
              <span>
                <span className="font-medium">Size:</span>{' '}
                {currentFile?.meta?.size ? `${(currentFile.meta.size / 1024).toFixed(1)} KB` : 'Unknown'}
              </span>
              <span>
                <span className="font-medium">View:</span>{' '}
                {showZoom ? `${Math.round(scale * 100)}% • ${rotation}°` : `${rotation}°`}
              </span>
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;