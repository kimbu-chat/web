export const fileDownload = (url: string, fileName: string, onProgress?: (loaded: number, total: number) => void) => {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.responseType = 'blob';
	if (onProgress) {
		xhr.onprogress = (progressEvent: ProgressEvent<EventTarget>) => {
			onProgress(progressEvent.loaded, progressEvent.total);
		};
	}
	xhr.onload = function () {
		var urlCreator = window.URL || window.webkitURL;
		var imageUrl = urlCreator.createObjectURL(this.response);
		var tag = document.createElement('a');
		tag.href = imageUrl;
		tag.download = fileName;
		document.body.appendChild(tag);
		tag.click();
		document.body.removeChild(tag);
	};
	xhr.send();

	return xhr.abort;
};
