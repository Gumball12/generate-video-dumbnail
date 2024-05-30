import movSrc from './mock/video/mov.mov';
import mp4Src from './mock/video/mp4.mp4';
import webmSrc from './mock/video/webm.webm';

import { generateVideoThumbnail } from '..';

import { describe, expect, it } from 'vitest';

const movUrl = new URL(movSrc, import.meta.url).href;
const mp4Url = new URL(mp4Src, import.meta.url).href;
const webmUrl = new URL(webmSrc, import.meta.url).href;

const movBlob = new Blob([
  new Uint8Array(await (await fetch(movUrl)).arrayBuffer()),
]);
const movBlobUrl = URL.createObjectURL(movBlob);

describe('generateVideoThumbnail with HTTP Url', () => {
  it('should generate a video thumbnail from a MOV file', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/png',
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov.png')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail from a MP4 file', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(mp4Url, 1, {
        format: 'image/png',
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mp4.png')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail from a WEBM file', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(webmUrl, 1, {
        format: 'image/png',
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-webm.png')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('generateVideoThumbnail with Blob Url', () =>
    new Promise<void>(done => {
      generateVideoThumbnail(movBlobUrl, 1, {
        format: 'image/png',
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov.png')).resolves.toBeTruthy();
          done();
        },
      });
    }));
});

describe('Time property', () => {
  it('should generate a video thumbnail at 0 second', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 0, {
        format: 'image/png',
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '0s-mov.png')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail at 2 seconds', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 2, {
        format: 'image/png',
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '2s-mov.png')).resolves.toBeTruthy();
          done();
        },
      }),
    ));
});

describe('Format option', () => {
  it('should generate a video thumbnail in JPEG format', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/jpeg',
        quality: 0.3,
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov-q0_3.jpeg')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail in PNG format', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/png',
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov.png')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail in WEBP format', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/webp',
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov.webp')).resolves.toBeTruthy();
          done();
        },
      }),
    ));
});

describe('Quality option (for JPEG)', () => {
  it('should generate a video thumbnail with a quality of 0.5', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/jpeg',
        quality: 0.5,
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov-q0_5.jpeg')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail with a quality of 1', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/jpeg',
        quality: 1,
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov-q1.jpeg')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail with a quality of 0.1', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/jpeg',
        quality: 0.1,
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov-q0_1.jpeg')).resolves.toBeTruthy();
          done();
        },
      }),
    ));
});

describe('Size option', () => {
  it('should generate a video thumbnail with a width of 320px', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/png',
        size: { width: 320 },
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov-w320.png')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail with a height of 240px', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/png',
        size: { height: 240 },
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov-h240.png')).resolves.toBeTruthy();
          done();
        },
      }),
    ));

  it('should generate a video thumbnail with a width of 320px and a height of 240px', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/png',
        size: { width: 320, height: 240 },
        onBlobCreated: ({ blob }) => {
          expect(
            isSameBlob(blob, '1s-mov-w320-h240.png'),
          ).resolves.toBeTruthy();
          done();
        },
      }),
    ));
});

describe('True negative check', () => {
  it('should generate different video thumbnails with different times', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '2s-mov.png')).resolves.toBeFalsy();
          done();
        },
      }),
    ));

  it('should generate different video thumbnails with different qualities', () =>
    new Promise<void>(done =>
      generateVideoThumbnail(movUrl, 1, {
        format: 'image/jpeg',
        quality: 0.1,
        onBlobCreated: ({ blob }) => {
          expect(isSameBlob(blob, '1s-mov-q0_5.jpeg')).resolves.toBeFalsy();
          done();
        },
      }),
    ));
});

describe('Error handling', () => {
  it('Unsupported URL, only HTTP and Blob URLs are supported', () =>
    expect(generateVideoThumbnail('not-found.mov', 1)).rejects.toThrow());

  it('Cannot find the video source URL', () =>
    expect(
      generateVideoThumbnail(document.createElement('video'), 1),
    ).rejects.toThrow());

  it('HTTP cannot be used', () =>
    expect(generateVideoThumbnail('http://example.com', 1)).rejects.toThrow());
});

const isSameBlob = async (blob: Blob, fileName: string) => {
  const url = new URL(`./mock/frame/${fileName}`, import.meta.url).href;
  const expectedBlob = await (await fetch(url)).blob();
  const isSameBlob = blob.size === expectedBlob.size;
  return isSameBlob;
};
