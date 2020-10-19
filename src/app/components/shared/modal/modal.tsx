import React from 'react';
import ReactDOM from 'react-dom';

import './modal.scss';

import CloseSVG from 'app/assets/icons/ic-close.svg';

namespace Modal {
	export interface Button {
		text: string;
		style: React.CSSProperties;
		position: 'left' | 'right';
		onClick: () => void;
		disabled?: boolean;
	}
	export interface Props {
		title: string | JSX.Element;
		contents: string | JSX.Element;
		highlightedInContents?: string;
		buttons: Modal.Button[];
		closeModal: () => void;
	}
}

const Modal = ({ title, contents, buttons, highlightedInContents, closeModal }: Modal.Props) => {
	const leftBtns: Modal.Button[] = [],
		rightBtns: Modal.Button[] = [];

	buttons.map((btn) => {
		if (btn.position === 'left') {
			leftBtns.push(btn);
		}

		if (btn.position === 'right') {
			rightBtns.push(btn);
		}
	});

	return ReactDOM.createPortal(
		<div className='modal'>
			<header className='modal__header'>
				<div className='modal__title'>{title}</div>
				<CloseSVG onClick={closeModal} viewBox='0 0 25 25' className='modal__close-btn' />
			</header>
			<div className='modal__contents'>
				{typeof contents === 'string'
					? contents.split(highlightedInContents || '').map((text, index, arr) => (
							<React.Fragment key={index}>
								<span className='modal__contents__text'>{text}</span>
								{index < arr.length - 1 && (
									<span className='modal__contents__text modal__contents__text--highlighted'>
										{highlightedInContents}
									</span>
								)}
							</React.Fragment>
					  ))
					: contents}
				<span></span>
			</div>
			<div className='modal__btn-block'>
				{leftBtns.map((btn, index, arr) => (
					<button
						className='modal__btn-base'
						key={index}
						onClick={btn.onClick}
						style={{ marginRight: index === arr.length - 1 ? 'auto' : '0', ...btn.style }}
						disabled={btn.disabled}
					>
						{btn.text}
					</button>
				))}

				{rightBtns.map((btn, index) => (
					<button
						className='modal__btn-base'
						key={index}
						onClick={btn.onClick}
						style={{ marginLeft: index === 0 ? 'auto' : '0', ...btn.style }}
						disabled={btn.disabled}
					>
						{btn.text}
					</button>
				))}
			</div>
		</div>,
		document.getElementById('root') || document.createElement('div'),
	);
};

export default Modal;
