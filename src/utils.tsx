import {
  lens,
  prop,
  assoc,
  reduce,
  length,
  append,
  tail,
  pipe,
  map,
  view,
  set,
  last,
  zip,
  Lens,
  slice,
  keys,
} from "ramda";

/**
 * Iterates a list from left to right collecting (size) previous values within a list.
 * Output list will always equal the length of the input. Useful for calculating values that
 * depend on a specific number of previous values.
 *
 * Example: `[1, 2, 3, 4]` with size 3 produces `[[1], [1, 2], [1, 2, 3], [2, 3, 4]]`.
 */
export function trail<T>(size: number, list: readonly T[]): T[][] {
  return reduce(
    (acc, curr) => {
      if (length(acc) === 0) return [[curr]];
      const prev = last(acc);
      if (length(prev) < size) return append(append(curr, prev), acc);
      return append(tail(append(curr, prev)), acc);
    },
    [],
    list,
  );
}

/**
 * For an list of objects, applies a lens, `lens`, over each item in the list to create a new list
 * which is input for the given function, `fn`. The output values of `fn` are then applied to the
 * input list using the lense. Allows for the application of `reduce` and other transformations
 * within a deeply nested property.
 *
 * `fn` must return the a list the same length as the input.
 */
export function overList<T, V>(
  lens: Lens,
  fn: (input: T[]) => V[],
  list: T[],
): T[] {
  const res = pipe(
    map((obj: T) => view(lens, obj)),
    fn,
    zip(list),
    map(([obj, value]) => set(lens, value, obj)),
  )(list);

  return res;
}

export const keysASC = (o: { [key: string]: unknown }) =>
  (keys(o) as string[]).sort();

export const keysIndexMap = (keysInOrder: string[]) => {
  return keysInOrder.reduce((acc, k, i) => ({ ...acc, [k]: i }), {});
};

export const valuesASC = (o: { [key: string]: any }) => {
  const keysInOrder = keysASC(o);
  return map((k) => o[k], keysInOrder);
};

export function WithKeysInOrder<T>(o: { [key: string]: T }) {
  const keysInOrder = keysASC(o);
  const indexMap = keysIndexMap(keysInOrder);

  const prevKeysOf = (key: string, prevNum: number) => {
    const currIndex = indexMap[key];

    if (prevNum > currIndex) return slice(0, currIndex, keysInOrder);
    return slice(currIndex - prevNum, currIndex, keysInOrder);
  };

  const prevValuesOf = (key: string, prevNum: number) =>
    prevKeysOf(key, prevNum).map((k) => o[k]);

  return {
    keysInOrder,
    lastKey: last(keysInOrder),
    indexOf: (key: string) => indexMap[key],
    prevKeysOf,
    prevValuesOf,
    prevValuesOfInc: (key: string, prevNumber: number) =>
      append(o[key], prevValuesOf(key, prevNumber)),
  };
}
