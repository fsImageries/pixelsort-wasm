// import { NdArray } from "../node_modules/ndarray-wasm/assembly"; // build
import { NdArray } from "../../ndarray-wasm/assembly"; 

import { options } from "./options";
import { setRange, getPixel } from "./utils";
import { funcSwitch } from "./colorFns";


export {
  setVertical,
  setThreshhold,
  setReverse,
  setSortFunction,
  setThreshholdFunction,
} from "./options";

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

      if (
        funcSwitch.get(options.thresholdFunction)(c) >= options.lowerThreshhold
      ) {
        if (pixelRange.length < 1) {
          rangeIndex = inner;
        }
        pixelRange.push(c);
      }

      if (
        (pixelRange.length > 0 &&
          funcSwitch.get(options.thresholdFunction)(c) <
            options.lowerThreshhold) ||
        rangeIndex + pixelRange.length >= innerBand
      ) {
        pixelRange.sort(comparator);
        if (options.reverse) pixelRange.reverse();

        if (!options.vertical) setRange(image, outer, rangeIndex, pixelRange);
        else setRange(image, rangeIndex, outer, pixelRange);
        pixelRange = new Array<u8[]>(0);
      }
    }
  }

  return image.data.slice(0);
}

function comparator(a: u8[], b: u8[]): i32 {
  const fn = funcSwitch.get(options.sortFunction);
  if (fn(a) < fn(b)) return -1;
  else if (fn(a) > fn(b)) return 1;
  return 0;
}
