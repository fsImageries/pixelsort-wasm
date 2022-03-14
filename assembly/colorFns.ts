import { arrMax, arrMin } from "./utils";

export const funcSwitch = new Map<string, (pixels: u8[]) => f64>();
funcSwitch.set("rgb2Luminance", rgb2Luminance);
funcSwitch.set("intensity", intensity);
funcSwitch.set("brightness", brightness);
funcSwitch.set("lightness", lightness);
funcSwitch.set("hue", hue);
funcSwitch.set("saturation", saturation);
funcSwitch.set("negativeLuminace", negativeLuminace);

//* Single Component return

export function lightness(pixel: u8[]): f64 {
  return rgb2Hsv(pixel)[2] / 255.0;
}

export function hue(pixel: u8[]): f64 {
  return rgb2Hsv(pixel)[0];
}

export function saturation(pixel: u8[]): f64 {
  return rgb2Hsv(pixel)[1];
}

export function negativeLuminace(pixel: u8[]): f64 {
  const c = 182.376;
  return 1 - rgb2Luminance(pixel) / c;
}

export function rgb2Luminance(pixel: u8[]): f64 {
  // 0.2126*R + 0.7152*G + 0.0722*B

  return (((((0.2126 * pixel[0]) as f64) + 0.7152 * pixel[1]) as f64) +
    0.0722 * pixel[2]) as f64 as f64;
}

export function intensity(pixel: u8[]): f64 {
  return (pixel[0] + pixel[1] + pixel[2]) as f64;
}

export function brightness(pixel: u8[]): f64 {
  //   if (!isInteger<T>() && !isFloat<T>())
  //     throw new Error("Only numbers are accepted.");

  let sum: u8 = 0;
  for (let i = 0; i < pixel.length; i++) {
    sum += pixel[i];
  }
  return (sum / pixel.length) as f64;
}

//* Multi Component return

export function rgb2Hsv(pixel: u8[]): f64[] {
  const r = pixel[0],
    b = pixel[1],
    g = pixel[2];

  let h: f64;

  const maxc = arrMax<f64>([r, g, b]);
  const minc = arrMin<f64>([r, g, b]);
  const rangec = maxc - minc;
  const v = maxc;

  if (minc == maxc) {
    return [0.0, 0.0, v];
  }
  const s = rangec / maxc;
  const rc = (maxc - r) / rangec;
  const gc = (maxc - g) / rangec;
  const bc = (maxc - b) / rangec;

  if (r == maxc) h = bc - gc;
  else if (g == maxc) h = 2.0 + rc - bc;
  else h = 4.0 + gc - rc;

  h = (h / 6.0) % 1.0;

  return [h, s, v];
}
