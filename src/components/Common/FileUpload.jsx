import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import Button from './Button';

const FileUpload = ({
  onUpload,
  acceptedTypes = '.pdf,.doc,.docx,.zip,.png,.jpg,.mp4,.csv',
  maxSizeMB = 15,
  defaultMilestone = 'Milestone 4'
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('Report');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            if (onUpload) {
              onUpload({
                name: selectedFile.name,
                size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
                type: fileType,
                date: new Date().toISOString().split('T')[0]
              });
            }
            setSelectedFile(null);
            setUploadProgress(0);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="space-y-4">
      {/* File Category Select */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Evidence Type
          </label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Report">Official Technical Report (.pdf)</option>
            <option value="Test Results">Laboratory / Field Test Results (.pdf, .csv)</option>
            <option value="Photos">Geotagged Site Photos (.zip, .jpg, .png)</option>
            <option value="Video">Video Proof of Demonstration (.mp4)</option>
            <option value="Document">Compliance / Sign-off Document (.pdf)</option>
          </select>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100/60'
        }`}
      >
        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-700">
          Drag & drop evidence files here, or{' '}
          <label className="text-blue-600 hover:underline cursor-pointer font-semibold">
            browse your computer
            <input
              type="file"
              className="hidden"
              accept={acceptedTypes}
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supports PDF, DOCX, ZIP, MP4, CSV, JPG up to {maxSizeMB} MB. Digitally timestamped upon upload.
        </p>
      </div>

      {/* Selected File Card */}
      {selectedFile && (
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <File className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {fileType}
              </p>
            </div>
          </div>
          {!isUploading && (
            <button
              onClick={() => setSelectedFile(null)}
              className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Uploading & Encrypting Document...</span>
            <span className="font-semibold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action button */}
      {selectedFile && !isUploading && (
        <Button
          variant="primary"
          onClick={handleSubmitUpload}
          className="w-full"
        >
          Submit Evidence for Expert Verification
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
