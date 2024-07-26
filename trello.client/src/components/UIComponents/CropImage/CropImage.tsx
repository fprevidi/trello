import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import './CropImage.css';

interface CropImageProps {
    src: string;
    onCropComplete: (croppedImage: Blob) => void;
}

const CropImage: React.FC<CropImageProps> = ({ src, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropCompleteCallback = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropComplete = useCallback(async () => {
        if (!croppedAreaPixels) return;
        const croppedImage = await getCroppedImg(src, croppedAreaPixels);
        onCropComplete(croppedImage);
    }, [croppedAreaPixels, onCropComplete, src]);

    return (
        <div className="crop-container">
            <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropCompleteCallback}
            />
            <button onClick={handleCropComplete}>Applica Ritaglio</button>
        </div>
    );
};

export default CropImage;

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // Needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

export const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get canvas context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas is empty'));
            }
        }, 'image/jpeg');
    });
};
