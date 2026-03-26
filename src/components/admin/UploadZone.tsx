"use client";

import React, { useState, useRef } from "react";

interface UploadZoneProps {
    onUpload: (file: File) => void;
    accept: string;
    isProcessing?: boolean;
    progress?: number;
}

export default function UploadZone({ onUpload, accept, isProcessing, progress }: UploadZoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) validateAndUpload(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) validateAndUpload(file);
    };

    const validateAndUpload = (file: File) => {
        // Basic validation
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        const isVideo = file.type.startsWith("video/") || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileExtension);
        const isImage = file.type.startsWith("image/") || ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic'].includes(fileExtension);

        const canAcceptVideo = accept.includes("video") || accept.includes("*");
        const canAcceptImage = accept.includes("image") || accept.includes("*");

        if (isVideo && !canAcceptVideo) {
            alert("This slot only accepts images.");
            return;
        }
        if (isImage && !canAcceptImage) {
            alert("This slot only accepts videos.");
            return;
        }
        if (!isVideo && !isImage && accept !== "*/*") {
            // Check for file extension matches if it's not a standard mime type
            const isMatch = accept.split(",").some(pattern => {
                const pat = pattern.trim().toLowerCase();
                return file.type.toLowerCase().includes(pat) || file.name.toLowerCase().endsWith(pat);
            });
            if (!isMatch && accept !== "image/*,video/*") {
                alert(`Please upload an acceptable file format (${accept}).`);
                return;
            }
        }
        const maxSize = 300 * 1024 * 1024; // 300MB for all files
        if (file.size > maxSize) {
            alert("File is too large. Max size: 300MB");
            return;
        }

        onUpload(file);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
        relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer text-center
        ${isDragActive ? "border-white bg-white/5" : "border-white/10 hover:border-white/30 hover:bg-white/[0.02]"}
        ${isProcessing ? "opacity-90 pointer-events-none" : ""}
      `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept={accept}
                className="hidden"
            />

            <div className={`space-y-2 ${isProcessing ? "opacity-20" : ""}`}>
                <div className="flex justify-center">
                    <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <p className="text-xs font-medium text-white/60">
                    {isDragActive ? "Drop here" : "Click or drag & drop"}
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                    MAX FILE SIZE: 300MB
                </p>
            </div>

            {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3"></div>
                    {typeof progress === "number" && (
                        <div className="space-y-1">
                            <p className="text-[14px] font-black text-white tabular-nums">
                                {progress}%
                            </p>
                            <p className="text-[8px] text-white/40 uppercase tracking-widest font-bold">
                                Uploading to Cloud...
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
