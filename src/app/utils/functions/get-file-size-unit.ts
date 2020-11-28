export const getRawAttachmentsizeUnit = (byteSize: number) => {
  let name = '';
  if (byteSize > 1048576) {
    name = `${(byteSize / 1048576).toFixed(2)} Mb`;
  } else if (byteSize > 1024) {
    name = `${(byteSize / 1024).toFixed(2)} Kb`;
  } else {
    name = `${byteSize.toFixed(2)} bytes`;
  }

  return name;
};
