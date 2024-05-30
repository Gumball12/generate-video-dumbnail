import { generateVideoThumbnail } from '../../src';

const fileInput = document.querySelector<HTMLInputElement>('input#file-input')!;
const timeInput = document.querySelector<HTMLInputElement>('input#time-input')!;
const generateButton = document.querySelector<HTMLButtonElement>(
  'button#generate-button',
)!;

const thumbnailContainer = document.querySelector<HTMLDivElement>(
  'section#thumbnail-container',
)!;
const thumbnailTemplate = document.querySelector<HTMLTemplateElement>(
  'template#thumbnail-template',
)!;

generateButton.addEventListener('click', async () => {
  const file = fileInput.files?.[0];
  if (!file) {
    alert('Please select a file');
    return;
  }

  const src = URL.createObjectURL(file);
  const fileName = file.name;
  const time = Number(timeInput.value);

  const thumbnailUrl = await generateVideoThumbnail(src, time, {
    format: 'image/jpeg',
    quality: 0.3,
    size: { width: 320 },
  });

  thumbnailContainer.appendChild(
    generateThumbnailElement(thumbnailUrl, time, fileName),
  );
});

const generateThumbnailElement = (src: string, time: number, name: string) => {
  const thumbnail = thumbnailTemplate.content.cloneNode(true) as HTMLElement;

  const img = thumbnail.querySelector<HTMLImageElement>('img')!;
  img.src = src;

  const timeParagraph = thumbnail.querySelector<HTMLSpanElement>('p')!;
  timeParagraph.textContent = `Time: ${time}s (${name})`;

  return thumbnail;
};
