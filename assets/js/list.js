export const partition = (predicate, list) => [
  list.filter(predicate),
  list.filter(el => !predicate(el))
];
