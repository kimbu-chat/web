import React, { useState, useCallback } from 'react';

import classNames from 'classnames';
import Slider from 'rc-slider/lib/Slider';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { useTranslation } from 'react-i18next';

import { Modal } from '@components/modal';
import { Tooltip } from '@components/tooltip';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as LeftRotateSvg } from '@icons/left-rotate.svg';
import { ReactComponent as PeisageSvg } from '@icons/peisage.svg';
import { ReactComponent as PhotoSvg } from '@icons/picture.svg';
import { ReactComponent as ReflectSvg } from '@icons/reflect.svg';
import { ReactComponent as RightRotateSvg } from '@icons/right-rotate.svg';
import { Button } from '@shared-components/button';
import { IAvatarSelectedData } from '@store/common/models';
import { cancelAvatarUploadingRequestAction } from '@store/my-profile/actions';

import getCroppedImg from './crop-image';

import './photo-editor.scss';

const handleStyle: React.CSSProperties = {
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
};

const railStyle: React.CSSProperties = {
  background: '#3f8ae0',
  borderRadius: '6px',
  boxShadow:
    'inset -2px 2px 4px rgba(46, 101, 164, 0.2),inset 2px -2px 4px rgba(46, 101, 164, 0.2), inset -2px -2px 4px rgba(80, 175, 255, 0.9),inset 2px 2px 5px rgba(46, 101, 164, 0.9)',
  height: '10px',
};

interface IPhotoEditorProps {
  imageUrl: string;
  hideChangePhoto: () => void;
  onSubmit?: (data: IAvatarSelectedData) => Promise<void>;
}

interface ICrop {
  x: number;
  y: number;
}

const BLOCK_NAME = 'photo-editor';

const PhotoEditor: React.FC<IPhotoEditorProps> = ({ imageUrl, onSubmit, hideChangePhoto }) => {
  const { t } = useTranslation();

  const cancelAvatarUploading = useActionWithDispatch(cancelAvatarUploadingRequestAction);

  const [crop, setCrop] = useState<ICrop>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const changeCrop = useCallback(
    (newCrop: ICrop) => {
      if (crop.x !== newCrop.x || newCrop.y !== crop.y) {
        setCrop(newCrop);
      }
    },
    [setCrop, crop],
  );

  const onCropComplete = useCallback(
    (_croppedArea, croppedAreaPixelsToSet) => {
      if (
        croppedAreaPixels?.width !== croppedAreaPixelsToSet.width ||
        croppedAreaPixels?.height !== croppedAreaPixelsToSet.height ||
        croppedAreaPixels?.x !== croppedAreaPixelsToSet.x ||
        croppedAreaPixels?.y !== croppedAreaPixelsToSet.y
      ) {
        setCroppedAreaPixels(croppedAreaPixelsToSet);
      }
    },
    [croppedAreaPixels, setCroppedAreaPixels],
  );

  const submitChange = useCallback(async () => {
    if (onSubmit && croppedAreaPixels) {
      const croppedUrl = await getCroppedImg(imageUrl, croppedAreaPixels, rotation, flip);
      setSubmitLoading(true);
      onSubmit({
        imagePath: imageUrl,
        croppedImagePath: croppedUrl,
      })
        .then(() => {
          setSubmitLoading(false);
          hideChangePhoto();
        })
        .catch(() => {
          setSubmitLoading(false);
        });
    }
  }, [onSubmit, hideChangePhoto, imageUrl, croppedAreaPixels, rotation, flip]);

  const cancelUpload = useCallback(() => {
    cancelAvatarUploading();
    hideChangePhoto();
  }, [cancelAvatarUploading, hideChangePhoto]);

  const mirrorImage = useCallback(() => {
    setFlip((prev) => ({ horizontal: !prev.horizontal, vertical: prev.vertical }));
    setRotation((prev) => 360 - prev);
  }, [setFlip, setRotation]);

  const rotateLeft = useCallback(() => setRotation((old) => old - 90), [setRotation]);

  const rotateRight = useCallback(() => setRotation((old) => old + 90), [setRotation]);

  return (
    <Modal unclickableBackground closeModal={cancelUpload}>
      <>
        <Modal.Header>
          <>
            <PhotoSvg className={`${BLOCK_NAME}__icon`} />

            <span> {t('changePhoto.title')} </span>
          </>
        </Modal.Header>
        <div onClick={(e) => e.stopPropagation()} className={BLOCK_NAME}>
          <div className={`${BLOCK_NAME}__crop-container`}>
            <Cropper
              image={imageUrl}
              aspect={1}
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
              onCropChange={changeCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className={`${BLOCK_NAME}__slider-section`}>
            <PeisageSvg
              className={classNames(
                `${BLOCK_NAME}__slider-peisage`,
                `${BLOCK_NAME}__slider-peisage--little`,
              )}
            />
            <div className={`${BLOCK_NAME}__slider-container`}>
              <Slider
                handleStyle={handleStyle}
                railStyle={railStyle}
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={setZoom}
              />
            </div>
            <PeisageSvg
              className={classNames(
                `${BLOCK_NAME}__slider-peisage`,
                `${BLOCK_NAME}__slider-peisage--big`,
              )}
            />
          </div>
          <div className={`${BLOCK_NAME}__btn-group`}>
            <button onClick={rotateLeft} type="button" className={`${BLOCK_NAME}__modify-btn`}>
              <Tooltip>Left Rotation</Tooltip>
              <LeftRotateSvg />
            </button>
            <button onClick={mirrorImage} type="button" className={`${BLOCK_NAME}__modify-btn`}>
              <Tooltip>Mirror</Tooltip>
              <ReflectSvg />
            </button>
            <button onClick={rotateRight} type="button" className={`${BLOCK_NAME}__modify-btn`}>
              <Tooltip>Right Rotation</Tooltip>
              <RightRotateSvg />
            </button>
          </div>

          <div className={`${BLOCK_NAME}__btn-block`}>
            <Button
              type="button"
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
              onClick={cancelUpload}>
              {t('changePhoto.reject')}
            </Button>
            <Button
              loading={submitLoading}
              type="button"
              className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}
              onClick={submitChange}>
              {t('changePhoto.confirm')}
            </Button>
          </div>
        </div>
      </>
    </Modal>
  );
};

export default PhotoEditor;
