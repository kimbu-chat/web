export const containsFiles = (event: React.DragEvent<HTMLDivElement> | DragEvent) => {
  if (event.dataTransfer?.types) {
    for (let i = 0; i < event.dataTransfer.types.length; i += 1) {
      if (event.dataTransfer.types[i] === 'Files') {
        return true;
      }
    }
  }

  return false;
};
