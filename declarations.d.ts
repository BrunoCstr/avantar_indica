declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-svg' {
  export interface SvgProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    [key: string]: any;
  }
}
