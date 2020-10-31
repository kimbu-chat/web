const forceDownload = (blob: string, filename: string) => {
	var a = document.createElement('a');
	a.download = filename;
	a.href = blob;
	// For Firefox https://stackoverflow.com/a/32226068
	document.body.appendChild(a);
	a.click();
	a.remove();
};

// Current blob size limit is around 500MB for browsers
export const fileDownload = (url: string, filename: string) => {
	if (!filename) filename = url.split('\\').pop()!.split('/').pop()!;
	fetch(url, {
		headers: new Headers({
			Origin: location.origin,
		}),
		mode: 'cors',
	})
		.then((response) => response.blob())
		.then((blob) => {
			let blobUrl = window.URL.createObjectURL(blob);
			forceDownload(blobUrl, filename);
		})
		.catch((e) => console.error(e));
};
