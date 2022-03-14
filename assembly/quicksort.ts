import { funcSwitch } from "./colorFns";
import { options } from "./options";

function swap(items: u8[][], left: i32, right: i32): void {
  let tmp = items[left];
  items[left] = items[right];
  items[right] = tmp;
}

function partition(items: u8[][], left: i32, right: i32): i32 {
  const fn = funcSwitch.get(options.sortFunction);

  let pivot = items[Math.floor(((right + left) / 2) as f64) as i32], //middle element
    i = left, //left pointer
    j = right; //right pointer
  while (i <= j) {
    while (fn(items[i]) < fn(pivot)) {
      i++;
    }
    while (fn(items[j]) > fn(pivot)) {
      j--;
    }
    if (i <= j) {
      swap(items, i, j); //swap two elements
      i++;
      j--;
    }
  }
  return i;
}

export function quickSort(items: u8[][], left: i32, right: i32): u8[][] {
  let index: i32;
  if (items.length > 1) {
    index = partition(items, left, right); //index returned from partition
    if (left < index - 1) {
      //more elements on the left side of the pivot
      quickSort(items, left, index - 1);
    }
    if (index < right) {
      //more elements on the right side of the pivot
      quickSort(items, index, right);
    }
  }
  return items;
}
