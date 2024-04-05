export function pickRandomElements<T>(number: number, array: T[]) {
  const result: T[] = [];
  const usedIndices = new Set();

  while (result.length < number) {
    const randomIndex = Math.floor(Math.random() * array.length);

    if (!usedIndices.has(randomIndex)) {
      result.push(array[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  return result;
}
