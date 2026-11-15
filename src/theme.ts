import {loadFont} from '@remotion/google-fonts/HindSiliguri';

export const {fontFamily: FONT} = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
});

export const W = 1080;
export const H = 1920;

export const COLORS = {
  glow: '#38e8ff',
  gold: '#ffcf5a',
  danger: '#ff4d5e',
  record: '#3ddc97',
  legend: '#ff9f43',
  info: '#5ec8ff',
  land: '#d9c79a',
  landEdge: '#f3e6c0',
};
