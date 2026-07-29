
import React, { useState, useEffect, useRef } from 'react';
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
  X,
  Maximize2,
  Minimize2,
  FileText,
  FileSpreadsheet,
  File,
  FileImage,
} from 'lucide-react';
import { ArrowLeft } from 'lucide-react';


import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Component to render text files
const TextViewer = ({ fileUrl, fileName, scale, rotation }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(fileUrl)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load file');
        return response.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

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
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <pre 
        className="whitespace-pre-wrap font-mono text-sm text-foreground"
        style={{
          fontSize: `${scale * 0.875}rem`,
        }}
      >
        {content}
      </pre>
    </div>
  );
};

// Component for Office documents (Word, Excel) with zoom support
const OfficeViewer = ({ fileUrl, fileName, scale, rotation, fileType }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const encodedUrl = encodeURIComponent(fileUrl);
    const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
    
    if (iframeRef.current) {
      iframeRef.current.src = viewerUrl;
    }
    setLoading(false);
  }, [fileUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full"
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: 'center center',
      }}
    >
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0 rounded-lg"
        title={`${fileType} Document: ${fileName}`}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onError={() => {
          setError('Failed to load document');
          setLoading(false);
        }}
      />
    </div>
  );
};

// Main Document Viewer Component
const DocumentViewer = ({
  isOpen,
  onClose,
  files,
  currentIndex,
  onNavigate,
  onDownload,
  onPrint,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [pdfError, setPdfError] = useState(false);
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  const currentFile = files[currentIndex];
  const totalFiles = files.length;
  const fileExtension = currentFile?.name?.toLowerCase().split('.').pop() || '';
  
  // Determine file type
  const getFileType = (filename) => {
    const ext = filename?.toLowerCase().split('.').pop() || '';
    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    const textExts = ['txt', 'csv', 'md', 'log', 'xml', 'json', 'html', 'css', 'js'];
    const pdfExts = ["pdf"];
    const wordExts = ["doc", "docx"];
    const excelExts = ["xls", "xlsx", "xlsm", "xlsb"];
    
    if (imageExts.includes(ext)) return 'image';
    if (pdfExts.includes(ext)) return 'pdf';
    if (wordExts.includes(ext)) return 'word';
    if (excelExts.includes(ext)) return 'excel';
    if (textExts.includes(ext)) return 'text';
    return 'other';
  };

  const fileType = getFileType(currentFile?.name);
  const isPdf = fileType === 'pdf';
  const isImage = fileType === 'image';
  const isWord = fileType === 'word';
  const isExcel = fileType === 'excel';
  const isText = fileType === 'text';
  const isOffice = isWord || isExcel;

  // Get file icon
  const getFileIcon = (filename, size = "h-6 w-6") => {
    const ext = filename?.toLowerCase().split('.').pop() || '';
    const iconProps = { className: `${size} shrink-0` };
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
      return <FileImage {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    }
    if (['pdf'].includes(ext)) {
      return <FileText {...iconProps} className={`${iconProps.className} text-red-500`} />;
    }
    if (['doc', 'docx'].includes(ext)) {
      return <FileText {...iconProps} className={`${iconProps.className} text-blue-600`} />;
    }
    if (['xls', 'xlsx', 'xlsm', 'xlsb'].includes(ext)) {
      return <FileSpreadsheet {...iconProps} className={`${iconProps.className} text-green-600`} />;
    }
    if (['txt', 'csv', 'md', 'log', 'xml', 'json'].includes(ext)) {
      return <FileText {...iconProps} className={`${iconProps.className} text-gray-500`} />;
    }
    return <File {...iconProps} className={`${iconProps.className} text-gray-400`} />;
  };

  // Get file type label
  const getFileTypeLabel = (filename) => {
    const ext = filename?.toLowerCase().split('.').pop() || '';
    const typeMap = {
      'pdf': 'PDF',
      'doc': 'WORD',
      'docx': 'WORD',
      'xls': 'EXCEL',
      'xlsx': 'EXCEL',
      'xlsm': 'EXCEL',
      'xlsb': 'EXCEL',
      'jpg': 'IMAGE',
      'jpeg': 'IMAGE',
      'png': 'IMAGE',
      'gif': 'IMAGE',
      'bmp': 'IMAGE',
      'webp': 'IMAGE',
      'svg': 'IMAGE',
      'txt': 'TEXT',
      'csv': 'TEXT',
      'md': 'TEXT',
      'log': 'TEXT',
      'xml': 'TEXT',
      'json': 'TEXT',
      'html': 'TEXT',
      'css': 'TEXT',
      'js': 'TEXT',
    };
    return typeMap[ext] || ext.toUpperCase();
  };

  // Update file URL when current file changes
  useEffect(() => {
    if (currentFile) {
      const url = `${process.env.REACT_APP_FOLDER_MANAGEMENT}/uploads/accounts/${currentFile.path}`;
      setFileUrl(url);
      setPageNumber(1);
      setLoading(true);
      setError(null);
      setNumPages(null);
      setPdfError(false);
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

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setPdfError(false);
  };

  const handleDocumentLoadError = (error) => {
    console.error('Error loading document:', error);
    setPdfError(true);
    setError('Failed to load PDF document. The file may be corrupted or inaccessible.');
    setLoading(false);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleResetView = () => {
    setScale(1.0);
    setRotation(0);
  };

  const handleDownload = () => {
    if (currentFile) {
      onDownload(currentFile);
    }
  };

  const handlePrint = () => {
    if (currentFile && onPrint) {
      onPrint(currentFile);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalFiles - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
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
          setIsFullscreen(prev => !prev);
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

    // PDF Viewer
    if (isPdf) {
      if (pdfError) {
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <FileText className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">PDF Preview Unavailable</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {error || 'Unable to load this PDF. You can download it to view locally.'}
            </p>
            <div className="flex gap-2">
              <Button variant="default" onClick={handleDownload}>
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

      return (
        <Document
          file={fileUrl}
          onLoadSuccess={handleDocumentLoadSuccess}
          onLoadError={handleDocumentLoadError}
          loading={() => (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}
          error={() => null}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      );
    }

    // Image Viewer
    if (isImage) {
      return (
        <img
          src={fileUrl}
          alt={currentFile.name}
          style={{
            transform: `rotate(${rotation}deg) scale(${scale})`,
            transformOrigin: 'center center',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
          className="shadow-lg"
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Failed to load image');
            setLoading(false);
          }}
        />
      );
    }

    // Word Viewer
    if (isWord) {
      return (
        <OfficeViewer 
          fileUrl={fileUrl} 
          fileName={currentFile.name} 
          scale={scale}
          rotation={rotation}
          fileType="Word"
        />
      );
    }

    // Excel Viewer
    if (isExcel) {
      return (
        <OfficeViewer 
          fileUrl={fileUrl} 
          fileName={currentFile.name} 
          scale={scale}
          rotation={rotation}
          fileType="Excel"
        />
      );
    }

    // Text Viewer
    if (isText) {
      return (
        <TextViewer 
          fileUrl={fileUrl} 
          fileName={currentFile.name}
          scale={scale}
          rotation={rotation}
        />
      );
    }

    // Other file types - fallback
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        {getFileIcon(currentFile.name, "h-16 w-16")}
        <h3 className="text-lg font-semibold mt-4 mb-2">{currentFile.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This file type ({fileExtension}) cannot be previewed directly.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download to view
          </Button>
          <Button variant="outline" onClick={() => window.open(fileUrl, '_blank')}>
            Open in new tab
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-background"
        style={{ width: '95vw', height: '95vh' }}
        ref={containerRef}
      >
        {/* Header - Like your reference image */}
        <DialogHeader className="p-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            {/* Left side: Navigation arrows and file counter */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 hover:bg-muted/50"
              >
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

            {/* Center: File type badge with icon */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border">
                {getFileIcon(currentFile?.name, "h-5 w-5")}
                <span className="text-xs font-semibold text-muted-foreground">
                  {getFileTypeLabel(currentFile?.name)}
                </span>
              </div>
            </div>

            {/* Right side: Action buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 px-3 hover:bg-muted/50"
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="h-8 px-3 hover:bg-muted/50"
                title="Print file"
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(prev => !prev)}
                className="h-8 w-8 p-0 hover:bg-muted/50"
                title="Toggle fullscreen (F)"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar - Zoom, Rotate, Reset controls for ALL document types */}
        <div className="flex flex-wrap items-center gap-1 px-4 py-1.5 border-b border-border bg-muted/5">
          {/* Zoom controls - Available for ALL file types */}
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
          
          {/* Rotate controls - Available for ALL file types */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="h-7 w-7 p-0 hover:bg-muted/50"
            title="Rotate 90° (R)"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>

          <div className="h-5 w-px bg-border mx-1" />

          {/* Reset view - Available for ALL file types */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetView}
            className="h-7 px-2 text-xs hover:bg-muted/50"
            title="Reset view (0)"
          >
            Reset
          </Button>

          {/* PDF page navigation - Only for PDFs */}
          {isPdf && numPages && !pdfError && (
            <>
              <div className="h-5 w-px bg-border mx-1" />
              <span className="text-xs text-muted-foreground">
                Page {pageNumber} of {numPages}
              </span>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="h-7 w-7 p-0 hover:bg-muted/50"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                  disabled={pageNumber >= numPages}
                  className="h-7 w-7 p-0 hover:bg-muted/50"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </>
          )}

          {/* File name display (optional) */}
          <span className="ml-auto text-xs text-muted-foreground truncate max-w-[200px] hidden sm:block">
            {currentFile?.name || ''}
          </span>
        </div>

        {/* Document Preview */}
        <div
          ref={viewerRef}
          className="flex-1 overflow-auto p-4 bg-muted/5"
          style={{ minHeight: 0 }}
        >
          <div className="flex justify-center items-center min-h-[400px] w-full h-full">
            {renderContent()}
          </div>
        </div>

        {/* Footer with file info */}
        <DialogFooter className="p-2.5 border-t border-border bg-muted/5">
          <div className="flex flex-wrap items-center justify-between w-full text-xs text-muted-foreground gap-2">
            <span className="truncate flex items-center gap-2">
              <span className="font-medium">File:</span>
              <span>{currentFile?.name || ''}</span>
            </span>
            <span className="flex items-center gap-3">
              <span>
                <span className="font-medium">Type:</span> {fileExtension.toUpperCase() || 'Unknown'}
              </span>
              <span>
                <span className="font-medium">Size:</span> {currentFile?.meta?.size ? 
                  (currentFile.meta.size / 1024).toFixed(1) + ' KB' : 
                  'Unknown'}
              </span>
              <span>
                <span className="font-medium">View:</span> {Math.round(scale * 100)}% • {rotation}°
              </span>
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;