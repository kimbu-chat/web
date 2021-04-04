import React, { useState, useCallback } from 'react';
import './photo-editor.scss';

import i18nConfiguration from '@localization/i18n';
import { useTranslation } from 'react-i18next';

import { ReactComponent as PhotoSvg } from '@icons/picture.svg';
import { ReactComponent as LeftRotateSvg } from '@icons/left-rotate.svg';
import { ReactComponent as RightRotateSvg } from '@icons/right-rotate.svg';
import { ReactComponent as ReflectSvg } from '@icons/reflect.svg';
import { ReactComponent as PeisageSvg } from '@icons/peisage.svg';

import Cropper from 'react-easy-crop';
import { WithBackground, Modal } from '@components/shared';
import { IAvatarSelectedData } from '@store/common/models';
import { Tooltip } from '@components/shared/tooltip/tooltip';
import { Area } from 'react-easy-crop/types';
import Slider from 'rc-slider/lib/Slider';
import getCroppedImg from './crop-image';

interface IPhotoEditorProps {
  imageUrl: string;
  hideChangePhoto: () => void;
  onSubmit?: (data: IAvatarSelectedData) => void;
}
export const PhotoEditor: React.FC<IPhotoEditorProps> = ({
  imageUrl,
  onSubmit,
  hideChangePhoto,
}) => {
  const { t } = useTranslation(undefined, { i18n: i18nConfiguration });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea, croppedAreaPixelsToSet) => {
      setCroppedAreaPixels(croppedAreaPixelsToSet);
    },
    [setCroppedAreaPixels],
  );

  const submitChange = useCallback(async () => {
    if (onSubmit && croppedAreaPixels) {
      hideChangePhoto();
      const croppedUrl = await getCroppedImg(imageUrl, croppedAreaPixels, rotation, flip);
      onSubmit({
        imagePath: imageUrl,
        croppedImagePath: croppedUrl,
      });
    }
  }, [onSubmit, hideChangePhoto, imageUrl, croppedAreaPixels, rotation, flip]);

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
          <div onClick={(e) => e.stopPropagation()} className="photo-editor">
            <div className="photo-editor__crop-container">
              <Cropper
                image={imageUrl}
                transform={[
                  `translate(${crop.x}px, ${crop.y}px)`,
                  `rotateZ(${rotation}deg)`,
                  `rotateY(${flip.horizontal ? 180 : 0}deg)`,
                  `rotateX(${flip.vertical ? 180 : 0}deg)`,
                  `scale(${zoom})`,
                ].join(' ')}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="photo-editor__slider-section">
              <PeisageSvg className="photo-editor__slider-peisage photo-editor__slider-peisage--little" />
              <div className="photo-editor__slider-container">
                <Slider
                  handleStyle={{
                    background: '#3f8ae0',
                    border: '4px solid #fff',
                    borderRadius: '50%',
                    bottom: '-6px',
                    boxSizing: 'border-box',
                    height: '20px',
                    left: '50%',
                    position: 'absolute',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    cursor: 'pointer',
                  }}
                  railStyle={{
                    background: '#3f8ae0',
                    borderRadius: '6px',
                    boxShadow:
                      'inset -2px 2px 4px rgba(46, 101, 164, 0.2),inset 2px -2px 4px rgba(46, 101, 164, 0.2), inset -2px -2px 4px rgba(80, 175, 255, 0.9),inset 2px 2px 5px rgba(46, 101, 164, 0.9)',
                    height: '10px',
                  }}
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(zoomValue) => setZoom(zoomValue)}
                />
              </div>
              <PeisageSvg className="photo-editor__slider-peisage photo-editor__slider-peisage--big" />
            </div>
            <div className="photo-editor__btn-group">
              <button
                onClick={() => setRotation((old) => old - 90)}
                type="button"
                className="photo-editor__modify-btn">
                <Tooltip>Left Rotation</Tooltip>
                <LeftRotateSvg viewBox="0 0 18 18" />
              </button>
              <button
                onClick={() => {
                  setFlip((prev) => ({ horizontal: !prev.horizontal, vertical: prev.vertical }));
                  setRotation((prev) => 360 - prev);
                }}
                type="button"
                className="photo-editor__modify-btn">
                <Tooltip>Mirror</Tooltip>
                <ReflectSvg viewBox="0 0 18 18" />
              </button>
              <button
                onClick={() => setRotation((old) => old + 90)}
                type="button"
                className="photo-editor__modify-btn">
                <Tooltip>Right Rotation</Tooltip>
                <RightRotateSvg viewBox="0 0 18 18" />
              </button>
            </div>
          </div>
        }
        buttons={[
          <button
            key={0}
            type="button"
            className="photo-editor__btn photo-editor__btn--cancel"
            onClick={hideChangePhoto}>
            {t('changePhoto.reject')}
          </button>,
          <button
            key={1}
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
