export const deleteLineFromPath = (path: string, line: string) => {
  const preparedPath = path.split('');
  preparedPath.splice(path.indexOf(line), line.length);
  return preparedPath.join('');
};
