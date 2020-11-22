import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import './change-photo.scss';

import { AvatarSelectedData } from 'app/store/my-profile/models';
import { LocalizationContext } from 'app/app';

import CloseSVG from 'app/assets/icons/ic-close.svg';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import WithBackground from 'app/components/shared/with-background';
import { stopPropagation } from 'app/utils/functions/stop-propagation';
import BaseBtn from 'app/components/shared/base-btn/base-btn';

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

	export enum Stage {
		imageCrop = 'imageCrop',
		imagePreview = 'imagePreview',
	}
}

const pixelRatio = 4;

function getResizedCanvas(canvas: HTMLCanvasElement, newWidth?: number, newHeight?: number) {
	const tmpCanvas = document.createElement('canvas');
	tmpCanvas.width = newWidth || 0;
	tmpCanvas.height = newHeight || 0;

	const ctx = tmpCanvas.getContext('2d');
	ctx?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth || 0, newHeight || 0);

	return tmpCanvas;
}

function generateDownload(previewCanvas: HTMLCanvasElement | null, crop: ReactCrop.Crop): string {
	if (!crop || !previewCanvas) {
		return '';
	}

	const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);
	let previewUrl = canvas.toDataURL('image/png');

	return previewUrl;
}

const ChangePhotoComponent = ({ imageUrl, onSubmit, hideChangePhoto }: ChangePhoto.Props) => {
	const { t } = useContext(LocalizationContext);

	const imgRef = useRef<HTMLImageElement | null>(null);
	const [crop, setCrop] = useState<ReactCrop.Crop>({
		aspect: 1,
		x: 0,
		y: 0,
		unit: 'px',
	});
	const [completedCrop, setCompletedCrop] = useState<ReactCrop.Crop>();
	const [rotated, setRotated] = useState<number>(0);
	const [mirrored, setMirrored] = useState<boolean>(false);

	const rotate = useCallback(() => {
		setRotated((oldRotation) => oldRotation + 90);
	}, [setRotated]);
	const mirror = useCallback(() => {
		setMirrored((oldMirrored) => !oldMirrored);
	}, [setMirrored]);

	const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const submitChange = useCallback(() => {
		if (onSubmit) {
			hideChangePhoto();
			const croppedUrl = generateDownload(previewCanvasRef.current, completedCrop || {});
			onSubmit({
				offsetY: crop.y,
				offsetX: crop.x,
				width: crop.width,
				imagePath: imageUrl as string,
				croppedImagePath: croppedUrl,
			});
		}
	}, [onSubmit]);

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
			crop?.height || 0,
		);
	}, [completedCrop]);

	return (
		<WithBackground onBackgroundClick={hideChangePhoto}>
			<div onClick={stopPropagation}>
				<CloseSVG onClick={hideChangePhoto} className='change-photo__close' viewBox='0 0 25 25' />
				<div className='crop-container'>
					<ReactCrop
						src={imageUrl as string}
						onImageLoaded={onLoad}
						crop={crop}
						onChange={(c: ReactCrop.Crop) => setCrop(c)}
						circularCrop={true}
						onComplete={(c) => setCompletedCrop(c)}
						imageStyle={{
							transform: `rotate(${rotated}deg) scaleX(${mirrored ? -1 : 1})`,
						}}
					/>
				</div>
				<div className='change-photo__btn-group'>
					<span className='change-photo__preview'>Prewiew photo </span>
					<div className='change-photo__modify-btns'>
						<button onClick={mirror} className='change-photo__modify-btn'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									fillRule='evenodd'
									d='M7.2 2.8V1.2a.8.8 0 011.6 0v1.6a.8.8 0 11-1.6 0zm5.8 3a.8.8 0 01-.8-.8v-.19h-.13l-.93-.01a.8.8 0 01.02-1.6h.93l.53.02c.65 0 1.18.54 1.18 1.2V5a.8.8 0 01-.8.8zm-9.2-.98v6.38H5.6a.8.8 0 010 1.6H3.58a1.39 1.39 0 01-1.38-1.38V4.6a1.39 1.39 0 011.38-1.39h2.03a.8.8 0 110 1.6H3.8zm8.29 6.4l-.93-.02a.8.8 0 00-.02 1.6l.92.01h.53a1.2 1.2 0 001.21-1.2v-.58a.8.8 0 00-1.6 0v.18h-.11zm.11-2.6v-1.2a.8.8 0 011.6 0v1.2a.8.8 0 01-1.6 0zm-5 4.51v1.6a.8.8 0 001.6 0v-1.6a.8.8 0 00-1.6 0zm0-7.92v1.6a.8.8 0 001.6 0V5.2a.8.8 0 10-1.6 0zm0 5.58V9.2a.8.8 0 011.6 0v1.6a.8.8 0 01-1.6 0z'
									clipRule='evenodd'
								></path>
							</svg>
						</button>
						<button onClick={rotate} className='change-photo__modify-btn'>
							<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
								<path
									fillRule='evenodd'
									d='M11.79 10.2H14a.8.8 0 010 1.6H11.8V14a.8.8 0 01-1.6 0v-2.2h-4.2A1.8 1.8 0 014.2 10V5.78H2a.8.8 0 110-1.6h2.2v-2.2a.8.8 0 111.6 0v2.2H10c.99 0 1.8.8 1.8 1.8v4.22zm-1.6 0V5.98a.2.2 0 00-.2-.2h-4.2V10a.2.2 0 00.2.2h4.2zM2.8 11.53a.8.8 0 00-1.6 0v1.94a1.33 1.33 0 001.33 1.33H4.5a.8.8 0 000-1.6H2.8v-1.67zM14 5.33a.8.8 0 01-.8-.8V2.8h-1.7a.8.8 0 010-1.6h1.96a1.33 1.33 0 011.33 1.33v2a.8.8 0 01-.8.8z'
									clipRule='evenodd'
								></path>
							</svg>
						</button>
					</div>
					<div className='change-photo__confirm-cancel'>
						<BaseBtn
							className='change-photo__confirm'
							variant='contained'
							width='auto'
							color='primary'
							onClick={submitChange}
						>
							{t('changePhoto.confirm')}
						</BaseBtn>
						<BaseBtn
							className='change-photo__cancel'
							variant='contained'
							width='auto'
							color='secondary'
							onClick={hideChangePhoto}
						>
							{t('changePhoto.reject')}
						</BaseBtn>
					</div>
				</div>
			</div>
		</WithBackground>
	);
};

const ChangePhotoPortal = (props: ChangePhoto.Props) => {
	return ReactDOM.createPortal(
		<ChangePhotoComponent {...props} />,
		document.getElementById('root') || document.createElement('div'),
	);
};

export default React.memo(ChangePhotoPortal);
