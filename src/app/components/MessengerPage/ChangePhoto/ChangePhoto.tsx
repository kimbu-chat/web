import React, { useState, useCallback } from 'react';
import Slider from '@material-ui/core/Slider';
import Cropper from 'react-easy-crop';
import './ChangePhoto.scss';
import { Button } from '@material-ui/core';
import { AvatarSelectedData } from 'app/store/user/interfaces';

namespace ChangePhoto {
  export interface Props {
    imageUrl: string | null | ArrayBuffer;
    hideChangePhoto: () => void;
    onSubmit?: (data: AvatarSelectedData) => void;
  }

  export interface Coords {
    x: number;
    y: number;
  }
}

const ChangePhoto = ({ imageUrl, onSubmit }: ChangePhoto.Props) => {
  const [crop, setCrop] = useState<ChangePhoto.Coords>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels);
  }, []);

  if (typeof imageUrl === 'string') {
    return (
      <div>
        <div className="crop-container">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={true}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className="controls">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e: any, value: number | number[]) => {
              if (typeof value === 'number') setZoom(value);
            }}
          />
        </div>
        <div className="change-photo__btn-group">
          <Button
            onClick={() => {
              if (onSubmit)
                onSubmit({
                  offsetY: crop.y,
                  offsetX: crop.x,
                  width: 500,
                  imagePath: imageUrl,
                  croppedImagePath: imageUrl
                });
            }}
            variant="contained"
            color="primary"
          >
            Подтвердить
          </Button>
          <Button variant="contained" color="secondary">
            Отменить
          </Button>
        </div>
      </div>
    );
  }

  return <div></div>;
};

export default ChangePhoto;
