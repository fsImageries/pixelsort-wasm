import { timSort } from "./timsort";

export function test(): void {
  const arr = new Array<u8[]>(10);
  for (let i = 0; i < 10; i++) {
    const out = new Array<u8>(3)
    for (let j = 0; j < 3; j++) {
      out[j] = (Math.random() * 255) as u8
    }
    arr[i] = out
  }

  timSort(arr, arr.length);
}
