import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ChangePhoto.scss';
import { Button } from '@material-ui/core';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { AvatarSelectedData } from 'app/store/user/interfaces';
import ReactDOM from 'react-dom';

namespace ChangePhoto {
  export interface Props {
    imageUrl: string | null | ArrayBuffer;
    hideChangePhoto: () => void;
    onSubmit?: (data: AvatarSelectedData) => Promise<any>;
  }

  export interface Coords {
    x: number;
    y: number;
  }

  export enum Stage {
    imageCrop,
    imagePreview
  }
}

const pixelRatio = 4;

const ChangePhotoComponent = ({ imageUrl, onSubmit, hideChangePhoto }: ChangePhoto.Props) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    aspect: 1,
    x: 0,
    y: 0,
    unit: 'px'
  });
  const [completedCrop, setCompletedCrop] = useState<ReactCrop.Crop>();

  const [stage, setStage] = useState<ChangePhoto.Stage>(ChangePhoto.Stage.imageCrop);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = (crop?.width || 500) * pixelRatio;
    canvas.height = (crop?.height || 500) * pixelRatio;

    ctx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    ctx ? (ctx.imageSmoothingEnabled = false) : '';

    ctx?.drawImage(
      image,
      (crop?.x || 0) * scaleX,
      (crop?.y || 0) * scaleY,
      (crop?.width || 100) * scaleX,
      (crop?.height || 100) * scaleY,
      0,
      0,
      crop?.width || 0,
      crop?.height || 0
    );
    console.log('reached');
  }, [completedCrop]);

  if (typeof imageUrl === 'string') {
    return (
      <div>
        <div className="crop-container">
          <ReactCrop
            className={stage === ChangePhoto.Stage.imageCrop ? 'visible' : 'hidden'}
            src={imageUrl}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c: ReactCrop.Crop) => setCrop(c)}
            circularCrop={true}
            onComplete={(c) => setCompletedCrop(c)}
          />
          <canvas
            className={
              stage === ChangePhoto.Stage.imagePreview
                ? 'crop-container__canvas visible'
                : 'crop-container__canvas hidden'
            }
            ref={previewCanvasRef}
            style={{
              width: completedCrop?.width || 0,
              height: completedCrop?.height || 0
            }}
          />
        </div>
        <div className="change-photo__btn-group">
          <Button
            onClick={() => {
              if (stage === ChangePhoto.Stage.imageCrop) {
                return setStage(ChangePhoto.Stage.imagePreview);
              }

              if (onSubmit && stage === ChangePhoto.Stage.imagePreview) {
                hideChangePhoto();
                onSubmit({
                  offsetY: crop.y || 250,
                  offsetX: crop.x || 250,
                  width: crop.width || 500,
                  imagePath: imageUrl,
                  croppedImagePath: imageUrl
                }).then(() => alert('Uploaded successfull'));
              }
            }}
            variant="contained"
            color="primary"
          >
            Подтвердить
          </Button>
          <Button onClick={hideChangePhoto} variant="contained" color="secondary">
            Отменить
          </Button>
        </div>
      </div>
    );
  }

  return <div></div>;
};

const ChangePhotoPortal = (props: ChangePhoto.Props) => {
  return ReactDOM.createPortal(
    <ChangePhotoComponent {...props} />,
    document.getElementById('root') || document.createElement('div')
  );
};

export default ChangePhotoPortal;
