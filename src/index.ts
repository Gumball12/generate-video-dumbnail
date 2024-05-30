type VideoElementOrSrc = HTMLVideoElement | string;

type Size = { width: number; height: number };

type SizeOption = Partial<Size>;
type FormatOption = 'image/jpeg' | 'image/png' | 'image/webp';
type QualityOption = number;

type GenerateVideoThumbnailOptions = Partial<{
  size: SizeOption;
  format: FormatOption;
  quality: QualityOption;
  onBlobCreated: (data: {
    blob: Blob;
    blobUrl: string;
    thumbnailPosition: number;
  }) => void;
}>;

const DEFAULT_FORMAT: FormatOption = 'image/jpeg';
const DEFAULT_QUALITY: QualityOption = 0.3;

export const generateVideoThumbnail = async (
  videoElementOrSrc: VideoElementOrSrc,
  thumbnailPosition: number,
  options?: GenerateVideoThumbnailOptions,
): Promise<string> => {
  const src = getVideoSrc(videoElementOrSrc);
  const correctedThumbnailPosition = thumbnailPosition || 0.001;

  if (isHTTPUrl(src)) {
    return await generateVideoThumbnailWithHTTPUrl(
      src,
      correctedThumbnailPosition,
      options,
    );
  }

  if (isBlobUrl(src)) {
    return await generateVideoThumbnailWithBlobUrl(
      src,
      correctedThumbnailPosition,
      options,
    );
  }

  throw new Error('Unsupported URL, only HTTP and Blob URLs are supported');
};

const getVideoSrc = (videoElementOrSrc: VideoElementOrSrc): string => {
  if (typeof videoElementOrSrc === 'string') {
    return videoElementOrSrc;
  }

  if (!isHTTPUrl(videoElementOrSrc.src)) {
    throw new Error('Cannot find the video source URL');
  }

  return videoElementOrSrc.src;
};

const isHTTPUrl = (src: string): boolean => {
  if (src.startsWith('http://') && !src.startsWith('http://localhost')) {
    throw new Error('HTTP cannot be used');
  }

  return src.startsWith('https://') || src.startsWith('http://localhost');
};

const isBlobUrl = (src: string): boolean => src.startsWith('blob:');

const generateVideoThumbnailWithHTTPUrl = (
  src: string,
  thumbnailPosition: number,
  options?: GenerateVideoThumbnailOptions,
): Promise<string> =>
  new Promise(resolve => {
    const videoElement = createVideoElement(
      addTimeToSrc(src, thumbnailPosition),
    );

    videoElement.addEventListener('seeked', async () => {
      const ctx = createCanvasCtx(calcCanvasSize(videoElement, options?.size));
      ctx.drawImage(videoElement, 0, 0, ctx.canvas.width, ctx.canvas.height);

      const blob = await canvasToBlob(
        ctx.canvas,
        options?.format || DEFAULT_FORMAT,
        options?.quality || DEFAULT_QUALITY,
      );

      const url = URL.createObjectURL(blob);
      options?.onBlobCreated?.({ blob, blobUrl: url, thumbnailPosition });
      resolve(url);
    });
  });

const addTimeToSrc = (src: string, time: number): string => {
  const url = new URL(src);
  url.hash = `t=${time}`;
  return url.toString();
};

const generateVideoThumbnailWithBlobUrl = (
  src: string,
  thumbnailPosition: number,
  options?: GenerateVideoThumbnailOptions,
): Promise<string> =>
  new Promise(resolve => {
    console.log('>> 1');
    const videoElement = createVideoElement(src);

    videoElement.addEventListener('seeked', async () => {
      console.log('>> 4');
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('>> 5');

      const ctx = createCanvasCtx(calcCanvasSize(videoElement, options?.size));
      ctx.drawImage(videoElement, 0, 0, ctx.canvas.width, ctx.canvas.height);

      const blob = await canvasToBlob(
        ctx.canvas,
        options?.format || DEFAULT_FORMAT,
        options?.quality || DEFAULT_QUALITY,
      );

      const url = URL.createObjectURL(blob);
      options?.onBlobCreated?.({ blob, blobUrl: url, thumbnailPosition });
      resolve(url);
    });

    console.log('>> 2', src);
    videoElement.addEventListener('loadedmetadata', () => {
      console.log('>> 3');
      videoElement.currentTime = thumbnailPosition;
    });
  });

const createVideoElement = (src: string): HTMLVideoElement => {
  const videoElement = document.createElement('video');
  videoElement.src = src;
  videoElement.crossOrigin = 'anonymous';
  videoElement.preload = 'metadata';

  return videoElement;
};

const createCanvasCtx = ({ width, height }: Size): CanvasRenderingContext2D => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context');
  }

  return ctx;
};

const calcCanvasSize = (video: HTMLVideoElement, size?: SizeOption): Size => {
  if (!size) {
    return { width: video.videoWidth, height: video.videoHeight };
  }

  if (size.width && size.height) {
    return size as Size;
  }

  const aspectRatio = video.videoWidth / video.videoHeight;

  if (size.width) {
    return { width: size.width, height: size.width / aspectRatio };
  }

  if (size.height) {
    return { width: size.height * aspectRatio, height: size.height };
  }

  throw new Error('Invalid size option');
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: FormatOption,
  quality: QualityOption,
): Promise<Blob> =>
  new Promise(resolve =>
    canvas.toBlob(
      blob => {
        if (!blob) {
          throw new Error('Failed to create a blob');
        }

        resolve(blob);
      },
      format,
      quality,
    ),
  );
