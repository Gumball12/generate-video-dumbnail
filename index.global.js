"use strict";
var generateVideoThumbnail = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    generateVideoThumbnail: () => generateVideoThumbnail
  });
  var DEFAULT_FORMAT = "image/jpeg";
  var DEFAULT_QUALITY = 0.3;
  var generateVideoThumbnail = async (videoElementOrSrc, thumbnailPosition, options) => {
    const src = getVideoSrc(videoElementOrSrc);
    const correctedThumbnailPosition = thumbnailPosition || 1e-3;
    if (isHTTPUrl(src)) {
      return await generateVideoThumbnailWithHTTPUrl(
        src,
        correctedThumbnailPosition,
        options
      );
    }
    if (isBlobUrl(src)) {
      return await generateVideoThumbnailWithBlobUrl(
        src,
        correctedThumbnailPosition,
        options
      );
    }
    throw new Error("Unsupported URL, only HTTP and Blob URLs are supported");
  };
  var getVideoSrc = (videoElementOrSrc) => {
    if (typeof videoElementOrSrc === "string") {
      return videoElementOrSrc;
    }
    if (!isHTTPUrl(videoElementOrSrc.src)) {
      throw new Error("Cannot find the video source URL");
    }
    return videoElementOrSrc.src;
  };
  var isHTTPUrl = (src) => {
    if (src.startsWith("http://") && !src.startsWith("http://localhost")) {
      throw new Error("HTTP cannot be used");
    }
    return src.startsWith("https://") || src.startsWith("http://localhost");
  };
  var isBlobUrl = (src) => src.startsWith("blob:");
  var generateVideoThumbnailWithHTTPUrl = (src, thumbnailPosition, options) => new Promise((resolve) => {
    const videoElement = createVideoElement(
      addTimeToSrc(src, thumbnailPosition)
    );
    videoElement.addEventListener("seeked", async () => {
      const ctx = createCanvasCtx(calcCanvasSize(videoElement, options?.size));
      ctx.drawImage(videoElement, 0, 0, ctx.canvas.width, ctx.canvas.height);
      const blob = await canvasToBlob(
        ctx.canvas,
        options?.format || DEFAULT_FORMAT,
        options?.quality || DEFAULT_QUALITY
      );
      const url = URL.createObjectURL(blob);
      options?.onBlobCreated?.({ blob, blobUrl: url, thumbnailPosition });
      resolve(url);
    });
  });
  var addTimeToSrc = (src, time) => {
    const url = new URL(src);
    url.hash = `t=${time}`;
    return url.toString();
  };
  var generateVideoThumbnailWithBlobUrl = (src, thumbnailPosition, options) => new Promise((resolve) => {
    const videoElement = createVideoElement(src);
    videoElement.addEventListener("seeked", async () => {
      await new Promise((resolve2) => setTimeout(resolve2, 100));
      const ctx = createCanvasCtx(calcCanvasSize(videoElement, options?.size));
      ctx.drawImage(videoElement, 0, 0, ctx.canvas.width, ctx.canvas.height);
      const blob = await canvasToBlob(
        ctx.canvas,
        options?.format || DEFAULT_FORMAT,
        options?.quality || DEFAULT_QUALITY
      );
      const url = URL.createObjectURL(blob);
      options?.onBlobCreated?.({ blob, blobUrl: url, thumbnailPosition });
      resolve(url);
    });
    videoElement.addEventListener("loadedmetadata", () => {
      videoElement.currentTime = thumbnailPosition;
    });
  });
  var createVideoElement = (src) => {
    const videoElement = document.createElement("video");
    videoElement.src = src;
    videoElement.crossOrigin = "anonymous";
    videoElement.preload = "metadata";
    return videoElement;
  };
  var createCanvasCtx = ({ width, height }) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2d context");
    }
    return ctx;
  };
  var calcCanvasSize = (video, size) => {
    if (!size) {
      return { width: video.videoWidth, height: video.videoHeight };
    }
    if (size.width && size.height) {
      return size;
    }
    const aspectRatio = video.videoWidth / video.videoHeight;
    if (size.width) {
      return { width: size.width, height: size.width / aspectRatio };
    }
    if (size.height) {
      return { width: size.height * aspectRatio, height: size.height };
    }
    throw new Error("Invalid size option");
  };
  var canvasToBlob = (canvas, format, quality) => new Promise(
    (resolve) => canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error("Failed to create a blob");
        }
        resolve(blob);
      },
      format,
      quality
    )
  );
  return __toCommonJS(src_exports);
})();
