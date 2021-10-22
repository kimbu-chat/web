const MEGABYTE = 1048576;
const KILOBYTE = 1024;

export const getRawAttachmentSizeUnit = (byteSize: number) => {
  let name = '';
  if (byteSize > MEGABYTE) {
    name = `${(byteSize / MEGABYTE).toFixed(2)} Mb`;
  } else if (byteSize > KILOBYTE) {
    name = `${(byteSize / KILOBYTE).toFixed(2)} Kb`;
  } else {
    name = `${byteSize.toFixed(2)} bytes`;
  }

  return name;
};
