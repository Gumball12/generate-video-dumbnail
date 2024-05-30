# generate-video-dumbnail

![npm bundle size](https://img.shields.io/bundlephobia/minzip/generate-video-dumbnail) ![NPM Downloads](https://img.shields.io/npm/dm/generate-video-dumbnail) ![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/generate-video-dumbnail) ![NPM Version](https://img.shields.io/npm/v/generate-video-dumbnail)

Video thumbnail generator for modern browsers. Supports Windows, macOS, AOS, and the ever-pesky iOS Safari(14+).

Blog post: [Generating Video Dumbnails on iOS Safari with JavaScript 💩](https://shj.rip/article/generating-video-dumbnails-on-ios-safari-with-javascript.html)

[Online Demo](https://gumball12.github.io/generate-video-dumbnail/)

Want to contribute? Please read the [CONTRIBUTING.md](./CONTRIBUTING.md).

## Installation

```bash
npm install generate-video-dumbnail
yarn add generate-video-dumbnail
pnpm add generate-video-dumbnail
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/generate-video-dumbnail/dist/index.iife.js"></script>
<script>
  generateVideoThumbnail.generateVideoThumbnail(/* ... */);
</script>
```

## Usage

```ts
import { generateVideoThumbnail } from 'generate-video-dumbnail';

const MY_VIDEO_URL = 'https://example.com/video.mp4';
const THUMBNAIL_POSITION = 1.3;

generateVideoThumbnail(MY_VIDEO_URL, THUMBNAIL_POSITION, {
  size: {
    width: 640,
    height: 200,
  },
  format: 'image/jpeg',
  quality: 0.88,
}).then(thumbnailUrl => {
  const img = document.createElement('img');
  img.src = thumbnailUrl;
  document.body.appendChild(img);
});
```

## API

### `generateVideoThumbnail`

```ts
function generateVideoThumbnail(
  videoUrl: string,
  position: number,
  options?: GenerateVideoThumbnailOptions,
): Promise<string>;
```

- `videoUrl`: The URL of the video.
- `position`: The position in seconds where the thumbnail should be generated.
- `options`: Optional options.

### `GenerateVideoThumbnailOptions`

```ts
type GenerateVideoThumbnailOptions = Partial<{
  size: Partial<{
    width: number;
    height: number;
  }>;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  onBlobCreated: (data: { blob: Blob; blobUrl: string; thumbnailPosition: number }): void;
}>;
```

- `size`: The size of the thumbnail. Defaults to the original video size.
  - `width` and `height` are optional. If only one is specified, the other will be calculated to maintain the aspect ratio.
- `format`: The format of the thumbnail. Default is `'image/jpeg'`.
- `quality`: The quality of the thumbnail. Default is 0.3. Applies only if the format is `'image/jpeg'`.
- `onBlobCreated`: A callback function that is called when the thumbnail blob is created.
  - `blob`: The thumbnail blob.
  - `blobUrl`: The URL of the thumbnail blob.
  - `thumbnailPosition`: The position of the thumbnail in seconds.

## LICENSE

[MIT](./LICENSE)
