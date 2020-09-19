import React from 'react';
import ReactDOM from 'react-dom';

import './modal.scss';

namespace Modal {
	export interface Button {
		text: string;
		style: React.CSSProperties;
		position: 'left' | 'right';
		onClick: () => void;
	}
	export interface Props {
		title: string;
		contents: string;
		highlightedInContents: string;
		buttons: Modal.Button[];
	}
}

const Modal = ({ title, contents, buttons, highlightedInContents }: Modal.Props) => {
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
			<div className='modal__title'>{title}</div>
			<div className='modal__contents'>
				{contents.split(highlightedInContents).map((text, index, arr) => (
					<React.Fragment key={index}>
						<span className='modal__contents__text'>{text}</span>
						{index < arr.length - 1 && (
							<span className='modal__contents__text modal__contents__text--highlighted'>
								{highlightedInContents}
							</span>
						)}
					</React.Fragment>
				))}
				<span></span>
			</div>
			<div className='modal__btn-block'>
				{leftBtns.map((btn, index, arr) => (
					<button
						className='modal__btn-base'
						key={index}
						onClick={btn.onClick}
						style={{ marginRight: index === arr.length - 1 ? 'auto' : '0', ...btn.style }}
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
