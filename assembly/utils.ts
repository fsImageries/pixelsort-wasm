import { NdArray } from "../node_modules/ndarray-wasm/assembly";
import { options } from "./options";

export function setRange(
  img: NdArray<u8>,
  startX: i32,
  startY: i32,
  pixels: u8[][]
): void {
  for (let i = 0; i < pixels.length; i++) {
    for (let z = 0; z < pixels[i].length; z++) {
      if (!options.vertical) {
        img.set(pixels[i][z], [startX, startY + i, z]);
      } else {
        img.set(pixels[i][z], [startX + i, startY, z]);
      }
    }
  }
}

export function getPixel<T>(arr: NdArray<T>, indices: i32[], zDepth: i32): T[] {
  const out = new Array<T>(zDepth);
  for (let i = 0; i < zDepth; i++) {
    const idx = indices.slice(0);
    idx.push(i);
    out[i] = arr.get(idx);
  }
  return out;
}

export function arrMax<T>(arr: T[]): T {
  let out = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > out) out = arr[i];
  }
  return out;
}

export function arrMin<T>(arr: T[]): T {
  let out = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < out) out = arr[i];
  }
  return out;
}

export function clamp<T>(num: T, min: T, max: T): T {
  // @ts-expect-error
  return Math.min(Math.max(num as f64, min as f64), max as f64) as T;
}
