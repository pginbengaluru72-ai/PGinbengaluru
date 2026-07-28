"use client"

import React, { useCallback, useState } from "react"
import { UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MediaUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
}

export function MediaUpload({ onFilesSelected, maxFiles = 5 }: MediaUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleFiles = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    
    if (selectedFiles.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`)
      return
    }

    const newFiles = [...selectedFiles, ...validFiles]
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)

    // Generate previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }, [selectedFiles, maxFiles, onFilesSelected])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)

    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click or drag images here to upload</p>
        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB (Max {maxFiles} files)</p>
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept="image/*" 
          multiple 
          onChange={onFileChange} 
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative group rounded-lg overflow-hidden border">
              <img src={preview} alt="Preview" className="w-full h-24 object-cover" />
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
