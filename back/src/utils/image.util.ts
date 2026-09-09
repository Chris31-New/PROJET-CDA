import sharp from 'sharp';
import axios, { AxiosResponse } from 'axios';

export async function imageUrlToBase64(imageUrl: string) {
  try {
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    const maxWidth = 1200;
    const quality = 75;
    // Récupère l'image depuis l'URL
    const response: AxiosResponse<ArrayBuffer> = await axios.get<ArrayBuffer>(
      imageUrl,
      { responseType: 'arraybuffer' },
    );

    const buffer: Buffer = Buffer.from(response.data);

    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Redimensionne
    const processed = image.resize({
      width: maxWidth,
      withoutEnlargement: true,
    });

    // Convertit selon le type original
    let outputBuffer: Buffer;
    let mimeType: string;

    switch (metadata.format) {
      case 'jpeg':
      case 'jpg':
        outputBuffer = await processed.jpeg({ quality }).toBuffer();
        mimeType = 'image/jpeg';
        break;
      case 'png':
        outputBuffer = await processed.png({ quality }).toBuffer();
        mimeType = 'image/png';
        break;
      case 'webp':
        outputBuffer = await processed.webp({ quality }).toBuffer();
        mimeType = 'image/webp';
        break;
      default:
        outputBuffer = await processed.jpeg({ quality }).toBuffer();
        mimeType = 'image/jpeg';
    }
    return `data:${mimeType};base64,${outputBuffer.toString('base64')}`;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.warn('Failed to fetch or process image:', err.message);
    } else {
      console.warn('Failed to fetch or process image:', err);
    }
    return undefined;
  }
}
