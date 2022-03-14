import { funcSwitch } from "./colorFns";
import { options } from "./options";

const RUN = 32;

// this function sorts array from left index to
// to right index which is of size atmost RUN
function insertionSort<T>(arr: T[], left: i32, right: i32): void {
  const fn = funcSwitch.get(options.sortFunction);

  for (let i = left + 1; i <= right; i++) {
    const temp = arr[i];
    let j = i - 1;
    // @ts-expect-error
    while (fn(arr[j]) > fn(temp) && j >= left) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
}

function merge<T>(arr: T[], l: i32, m: i32, r: i32): void {
  const fn = funcSwitch.get(options.sortFunction);

  const len1 = m - l + 1,
    len2 = r - m;
  const left = new Array<T>(len1),
    right = new Array<T>(len2);

  for (let i = 0; i < len1; i++) left[i] = arr[l + i];
  for (let i = 0; i < len2; i++) right[i] = arr[m + 1 + i];

  let i = 0;
  let j = 0;
  let k = l;

  while (i < len1 && j < len2) {
    // @ts-expect-error
    if (fn(left[i]) <= fn(right[j])) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
  }

  while (i < len1) {
    arr[k] = left[i];
    k++;
    i++;
  }

  while (j < len2) {
    arr[k] = right[j];
    k++;
    j++;
  }
}

export function timSort<T>(arr: T[], n: i32): void {
  // Sort individual subarrays of size RUN
  for (let i = 0; i < n; i += RUN) insertionSort<T>(arr, i, min(i + 31, n - 1));

  // start merging from size RUN (or 32). It will merge
  // to form size 64, then 128, 256 and so on ....
  for (let size = RUN; size < n; size = 2 * size) {
    // pick starting point of left sub array. We
    // are going to merge arr[left..left+size-1]
    // and arr[left+size, left+2*size-1]
    // After every merge, we increase left by 2*size
    for (let left = 0; left < n; left += 2 * size) {
      // find ending point of left sub array
      // mid+1 is starting point of right sub array
      const mid = left + size - 1;
      const right = min(left + 2 * size - 1, n - 1);

      // merge sub array arr[left.....mid] &
      // arr[mid+1....right]
      merge<T>(arr, left, mid, right);
    }
  }
}
