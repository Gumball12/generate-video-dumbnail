type VideoElementOrSrc = HTMLVideoElement | string;
type Size = {
    width: number;
    height: number;
};
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
declare const generateVideoThumbnail: (videoElementOrSrc: VideoElementOrSrc, thumbnailPosition: number, options?: GenerateVideoThumbnailOptions) => Promise<string>;

export { generateVideoThumbnail };
