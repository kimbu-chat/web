import { AuthService } from 'app/services/auth-service';
import axios from 'axios';

export interface FileUploadRequest<TResponseBody = object> {
  uploadId?: string;
  path: string;
  url: string;
  fileName: string;
  parameters?: {
    [index: string]: string;
  };
  progressCallback?(response: ProgressUploadResponse): void;
  errorCallback?(response: ErrorUploadResponse): void;
  completedCallback?(response: CompletedUploadResponse<TResponseBody>): void;
  cancelledCallback?(uploadId: string): void;
}

export interface ProgressUploadResponse {
  progress: number;
  uploadId: string;
}

export interface ErrorUploadResponse {
  error: string;
  uploadId: string;
}

export interface CompletedUploadResponse<T> {
  httpResponseCode: string;
  httpResponseBody: T;
  uploadId: string;
}

export function* uploadFileSaga<T>(request: FileUploadRequest<T>): any {
  const imagePath: string = request.path.replace('file://', '');

  const userAccessToken = new AuthService().auth.accessToken;

  function fileUpload(canvas: any) {
    let data = new FormData();
    canvas.toBlob(function (blob: any) {
      data.append('file', blob, request.fileName);

      for (let i in request.parameters) {
        data.append(i, request.parameters[i]);
      }

      axios
        .post(request.url, data, {
          headers: {
            Authorization: `bearer ${userAccessToken}`,
            'content-type': 'multipart/form-data'
          }
        })
        .then((res: any) => {
          console.log(res);
        });
    });
  }

  fileUpload(imagePath);
}
