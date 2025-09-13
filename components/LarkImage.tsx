import { FC } from 'react';
import { Image, ImageProps } from 'react-bootstrap';

import { DefaultImage } from '../models/configuration';

export interface SimpleImageProps extends ImageProps {
  src?: string;
}

export const LarkImage: FC<SimpleImageProps> = ({
  src = DefaultImage,
  alt,
  ...props
}) => (
  <Image
    fluid
    loading="lazy"
    {...props}
    src={src || DefaultImage}
    alt={alt}
    onError={({ currentTarget: image }) => {
      if (image.src !== DefaultImage) {
        image.src = DefaultImage;
      }
    }}
  />
);
