export const path = (object, currentPath) => {
  if (currentPath.length === 0) {
    return object;
  }
  const propName = currentPath[0];
  if (!object[propName]) {
    return null;
  }
  return path(object[propName], currentPath.slice(1));
};
