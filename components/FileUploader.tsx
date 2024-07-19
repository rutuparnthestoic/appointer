"use client"
import { convertFileToUrl } from '@/lib/utils'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import Image from 'next/image'

type FileUploaderProps = {
    files: File[] | undefined,
    onChange: (files: File[]) => void
}

const FileUploader = ({files, onChange}: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    onChange(acceptedFiles);
  }, [onChange]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onError: (err) => console.error('Dropzone error:', err),
  });
  
  return (
    <div {...getRootProps()} className='file-upload'>
      <input {...getInputProps()} />
      {files && files?.length > 0 ?(
        <Image 
        src={convertFileToUrl(files[0])}
        width={1000}
        height={1000}
        alt='uploadedimage'
        className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        <>
        <Image 
        src="/assets/icons/upload.svg"
        width={40}
        height={40}
        alt="upload"
        />
        <div className='file-upload_label'>
            <p className='text-14-regular'>
                <span className='text-green-500'>
                    Upload
                </span> or drag and drop
            </p>
            <p>
                SVG, PNG, JPG or PDF
            </p>
        </div>
        </>
      )}
    </div>
  )
}

export default FileUploader