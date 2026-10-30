import sharp from "sharp";

const input = "public/brand/logo-source.png";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const seen = new Uint8Array(w * h);
const stack = [0, w - 1, (h - 1) * w, (h - 1) * w + (w - 1)];

while (stack.length) {
  const p = stack.pop();
  if (p == null || seen[p]) continue;
  const x = p % w;
  const y = Math.floor(p / w);
  const i = p * 4;
  const max = Math.max(data[i], data[i + 1], data[i + 2]);
  if (max > 40) continue;
  seen[p] = 1;
  data[i + 3] = 0;
  if (x > 0) stack.push(p - 1);
  if (x + 1 < w) stack.push(p + 1);
  if (y > 0) stack.push(p - w);
  if (y + 1 < h) stack.push(p + w);
}

await sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim().png().toFile("public/brand/logo.png");
const meta = await sharp("public/brand/logo.png").metadata();
const iconHeight = Math.round((meta.height || 1) * 0.58);
await sharp("public/brand/logo.png")
  .extract({ left: 0, top: 0, width: meta.width || 1, height: iconHeight })
  .trim()
  .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile("src/app/icon.png");
console.log("logo", meta.width, meta.height);
