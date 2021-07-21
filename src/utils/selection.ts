const MAX_NESTING_PARENTS = 5;

export function isSelectionInsideInput(selectionRange: Range, inputId: string) {
  const { commonAncestorContainer } = selectionRange;
  let parentNode: HTMLElement | null = commonAncestorContainer as HTMLElement;
  let iterations = 1;
  while (parentNode && parentNode.id !== inputId && iterations < MAX_NESTING_PARENTS) {
    parentNode = parentNode.parentElement;
    iterations += 1;
  }

  return Boolean(parentNode && parentNode.id === inputId);
}
