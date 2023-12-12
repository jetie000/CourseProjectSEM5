import React, { ChangeEvent, useState } from 'react'
import { variables } from '@/variables'
import { Toast as bootstrapToast } from 'bootstrap'
import Cropper, { Area } from "react-easy-crop";
import { cropImage } from "@/utils/cropUtils";
import { useActions } from '@/hooks/useActions';
import './MyCropper.scss'

function MyCropper({croppedImage, setCroppedImage}: {croppedImage: string | undefined, setCroppedImage: Function}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | undefined>(undefined);
    const [imageSrc, setImageSrc] = useState<string>();
    const { setToastChildren } = useActions();
    
    function readFile(file: File) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    const writeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setCroppedImage(undefined);
        if (!e.target.files?.length) return;
        if (e.target.files[0].size >= variables.MAX_COLLECTION_PHOTO_SIZE) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            e.target.value = '';
            setToastChildren('Максимальный размер фото - 5 МБ');
            myToast.show();
            return;
        }
        console.log(e.target.files[0]);
        
        let imageDataUrl = (await readFile(e.target.files[0])) as string;
        setImageSrc(imageDataUrl);
    }

    const setCroppedImgFunc = async () => {
        if (imageSrc) {
            const croppedImageResponse = await cropImage(imageSrc, croppedAreaPixels, console.log);
            console.log(croppedImageResponse);
            
            setCroppedImage(croppedImageResponse)
        }
    }

    return (
        <>
            <input onChange={(e) => writeFile(e)} type="file" className="form-control mb-3" id="inputFile" />
            {
                imageSrc && !croppedImage &&
                <>
                    <div className='img-fluid border rounded-2 mb-1 position-relative my-cropper'>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={variables.ASPECT_COLLECTIONS_IMG}
                            onCropChange={setCrop}
                            onCropComplete={(_, croppedAreaPixels) => {
                                setCroppedAreaPixels(croppedAreaPixels);
                            }}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <button onClick={() => setCroppedImgFunc()} className='btn btn-secondary mb-3'>Обрезать</button>
                </>
            }
        </>
    );
}

export default MyCropper;