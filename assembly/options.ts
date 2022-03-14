class SortOptions {
  vertical: bool;
  reverse: bool;
  lowerThreshhold: f64;
  upperThreshhold: f64;
  sortFunction: string;
  thresholdFunction: string;

  constructor() {
    this.vertical = false;
    this.reverse = false;
    this.lowerThreshhold = 0.25;
    this.upperThreshhold = 0.8;
    this.sortFunction = "rgb2Luminance";
    this.thresholdFunction = "lightness"
  }
}

export const options = new SortOptions();

export function setVertical(v: bool): void {
  options.vertical = v;
}

export function setReverse(v: bool): void {
  options.reverse = v;
}

export function setThreshhold(v: f64, upper: bool = false): void {
  if (upper) options.upperThreshhold = v;
  else options.lowerThreshhold = v;
}

export function setSortFunction(sortFunction: string): void {
  options.sortFunction = sortFunction;
}

export function setThreshholdFunction(sortFunction: string): void {
  options.thresholdFunction = sortFunction;
}
