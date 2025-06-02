import { Image } from 'react-native';

export const lazyLoadImage = (uri: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Image.prefetch(uri)
      .then(() => resolve())
      .catch(reject);
  });
};

export const compressImage = async (uri: string): Promise<string> => {
  // Aqui você pode integrar uma biblioteca de compressão de imagens
  // Exemplo: react-native-image-compressor
  return uri; // Retorna a URI original por enquanto
};

export const getCDNUrl = (uri: string): string => {
  // Aqui você pode integrar um CDN (ex: Cloudinary, AWS CloudFront)
  return uri; // Retorna a URI original por enquanto
}; 