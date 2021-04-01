export const fileDownload = (
  url: string,
  fileName: string,
  onProgress?: (loaded: number, total: number) => void,
  onEnd?: () => void,
) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.responseType = 'blob';
  if (onProgress) {
    xhr.onprogress = (progressEvent: ProgressEvent<EventTarget>) => {
      onProgress(progressEvent.loaded, progressEvent.total);
    };
  }
  xhr.onload = function onLoad() {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement('a');
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
    if (onEnd) {
      onEnd();
    }
  };
  xhr.send();

  return xhr;
};
