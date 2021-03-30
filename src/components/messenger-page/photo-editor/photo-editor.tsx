import React, { useState, useCallback, useRef, useContext } from 'react';
import './photo-editor.scss';

import { LocalizationContext } from '@contexts';

import PhotoSvg from '@icons/picture.svg';
import LeftRotateSvg from '@icons/left-rotate.svg';
import RightRotateSvg from '@icons/right-rotate.svg';
import ReflectSvg from '@icons/reflect.svg';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { WithBackground, Modal } from '@components/shared';
import { IAvatarSelectedData } from '@store/common/models';
import { Tooltip } from '@components/shared/tooltip/tooltip';

interface IPhotoEditorProps {
  imageUrl: string;
  hideChangePhoto: () => void;
  onSubmit?: (data: IAvatarSelectedData) => void;
}

function generateDownload(image?: HTMLImageElement, crop?: ReactCrop.Crop): string {
  if (!crop || !crop.x || !crop.y || !crop.width || !crop.height || !image) {
    return '';
  }

  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width as number;
  canvas.height = crop.height as number;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
  }

  return canvas.toDataURL('image/png');
}

export const PhotoEditor: React.FC<IPhotoEditorProps> = ({
  imageUrl,
  onSubmit,
  hideChangePhoto,
}) => {
  const { t } = useContext(LocalizationContext);

  const imgRef = useRef<HTMLImageElement>();
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    aspect: 1,
    x: 0,
    y: 0,
    unit: 'px',
  });
  const [completedCrop, setCompletedCrop] = useState<ReactCrop.Crop>();
  const [rotated, setRotated] = useState<number>(0);
  const [mirrored, setMirrored] = useState<boolean>(false);

  const rotateRight = useCallback(() => {
    setRotated((oldRotation) => oldRotation + 90);
  }, [setRotated]);

  const rotateLeft = useCallback(() => {
    setRotated((oldRotation) => oldRotation - 90);
  }, [setRotated]);

  const mirror = useCallback(() => {
    setMirrored((oldMirrored) => !oldMirrored);
  }, [setMirrored]);

  const submitChange = useCallback(() => {
    if (onSubmit) {
      hideChangePhoto();
      const croppedUrl = generateDownload(imgRef.current, completedCrop);
      onSubmit({
        offsetY: crop.y,
        offsetX: crop.x,
        width: crop.width,
        imagePath: imageUrl,
        croppedImagePath: croppedUrl,
      });
    }
  }, [onSubmit, hideChangePhoto, completedCrop, crop.y, crop.x, crop.width, imageUrl]);

  const onLoad = useCallback((img) => {
    imgRef.current = img;

    const aspect = 1;
    const width = img.width < img.height ? img.width : img.height;
    const height = img.width < img.height ? img.width : img.height;

    const y = (img.height - height) / 2;
    const x = (img.width - width) / 2;

    setCrop({
      unit: 'px',
      width,
      height,
      x,
      y,
      aspect,
    });

    setCompletedCrop({
      unit: 'px',
      width,
      height,
      x,
      y,
      aspect,
    });

    return false;
  }, []);

  return (
    <WithBackground onBackgroundClick={hideChangePhoto}>
      <Modal
        title={
          <>
            <PhotoSvg viewBox="0 0 18 19" className="photo-editor__icon" />

            <span> {t('changePhoto.title')} </span>
          </>
        }
        closeModal={hideChangePhoto}
        content={
          <div className="photo-editor">
            <div className="photo-editor__crop-container">
              <ReactCrop
                src={imageUrl}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c: ReactCrop.Crop) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                imageStyle={{
                  transform: `rotate(${rotated}deg) scaleX(${mirrored ? -1 : 1})`,
                }}
                ruleOfThirds
              />
            </div>
            <div className="photo-editor__btn-group">
              <button type="button" onClick={rotateLeft} className="photo-editor__modify-btn">
                <Tooltip>Left Rotation</Tooltip>
                <LeftRotateSvg viewBox="0 0 18 18" />
              </button>
              <button type="button" onClick={mirror} className="photo-editor__modify-btn">
                <Tooltip>Mirror</Tooltip>
                <ReflectSvg viewBox="0 0 18 18" />
              </button>
              <button type="button" onClick={rotateRight} className="photo-editor__modify-btn">
                <Tooltip>Right Rotation</Tooltip>
                <RightRotateSvg viewBox="0 0 18 18" />
              </button>
            </div>
          </div>
        }
        buttons={[
          <button
            type="button"
            className="photo-editor__btn photo-editor__btn--cancel"
            onClick={hideChangePhoto}>
            {t('changePhoto.reject')}
          </button>,
          <button
            type="button"
            className="photo-editor__btn photo-editor__btn--confirm"
            onClick={submitChange}>
            {t('changePhoto.confirm')}
          </button>,
        ]}
      />
    </WithBackground>
  );
};
