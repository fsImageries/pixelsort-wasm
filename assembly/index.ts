import { NdArray } from "../node_modules/ndarray-wasm/assembly";

import { quickSort } from "./quicksort";
import { options } from "./options";
import { setRange, getPixel } from "./utils";
import { funcSwitch } from "./colorFns";

export {
  setVertical,
  setThreshhold,
  setReverse,
  setSortFunction,
  setThreshholdFunction
} from "./options";

export function sortAll(pixels: u8[], shape: i32[]): u8[] {
  const image = new NdArray<u8>(StaticArray.fromArray(pixels), shape);

  const xaxis = shape[0],
    yaxis = shape[1],
    depth = shape[2];

  const vertical = !options.vertical;

  const outerBand = vertical ? yaxis : xaxis;
  const innerBand = vertical ? xaxis : yaxis;

  const sortarr = new Array<u8[]>(vertical ? xaxis : yaxis);
  for (let outer = 0; outer < outerBand; outer++) {
    for (let inner = 0; inner < innerBand; inner++) {
      const x = vertical ? inner : outer;
      const y = vertical ? outer : inner;

      const color = new Array<u8>(depth);

      for (let z = 0; z < depth; z++) {
        color[z] = image.get([x, y, z]);
      }
      sortarr[vertical ? x : y] = color;
    }

    quickSort(sortarr, 0, sortarr.length - 1);
    if (options.reverse) sortarr.reverse();

    for (let inner = 0; inner < innerBand; inner++) {
      const x = vertical ? inner : outer;
      const y = vertical ? outer : inner;
      for (let z = 0; z < depth; z++) {
        image.set(sortarr[vertical ? x : y][z], [x, y, z]);
      }
    }
  }
  return image.data.slice(0);
}

export function sortRanges(pixels: u8[], shape: i32[]): u8[] {
  const image = new NdArray<u8>(StaticArray.fromArray(pixels), shape);

  const outerBand = !options.vertical ? shape[0] : shape[1];
  const innerBand = !options.vertical ? shape[1] : shape[0];

  for (let outer = 0; outer < outerBand; outer++) {
    let pixelRange = new Array<u8[]>(0);
    let rangeIndex = 0;

    for (let inner = 0; inner < innerBand; inner++) {
      const idxs = !options.vertical ? [outer, inner] : [inner, outer];
      let c = getPixel(image, idxs, 3);

      if (funcSwitch.get(options.thresholdFunction)(c) >= options.lowerThreshhold) {
        if (pixelRange.length < 1) {
          rangeIndex = inner;
        }
        pixelRange.push(c);
      }

      if (
        (pixelRange.length > 0 && funcSwitch.get(options.thresholdFunction)(c) < options.lowerThreshhold) ||
        rangeIndex + pixelRange.length >= innerBand
      ) {
        // timsort.sort(pixelRange, compareOptions.function);
        quickSort(pixelRange, 0, pixelRange.length - 1);
        if (options.reverse) pixelRange.reverse();

        if (!options.vertical) setRange(image, outer, rangeIndex, pixelRange);
        else setRange(image, rangeIndex, outer, pixelRange);
        pixelRange = new Array<u8[]>(0);
      }
    }
  }

  return image.data.slice(0);
}
