import gumImg from '../gum.jpg';
import hilalImg from '../hilal.jpg';
import pyraImg from '../pyra.jpg';
import omdImg from '../omd.jpg';
import oilImg from '../oil.jpg';
import sustImg from '../sust.jpg';
import wrstImg from '../wrst.jpg';
import mrkImg from '../mrk.jpg';
import sntImg from '../snt.jpeg';
import sttImg from '../stt.jpg';
import chsImg from '../chs.jpg';
import bskImg from '../bsk.jpeg';
import afuImg from '../afu.jpeg';

/**
 * Resolves an image path string to either a remote URL or a bundled local image asset.
 * Works with full URLs or relative paths pointing to the files in src (e.g. "gum.jpg", "src/gum.jpg", "/src/gum.jpg").
 */
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

  const filename = imagePath.split('/').pop() || '';

  switch (filename) {
    case 'gum.jpg':
      return gumImg;
    case 'hilal.jpg':
      return hilalImg;
    case 'pyra.jpg':
      return pyraImg;
    case 'omd.jpg':
      return omdImg;
    case 'oil.jpg':
      return oilImg;
    case 'sust.jpg':
    case 'sust.jpeg':
      return sustImg;
    case 'wrst.jpg':
      return wrstImg;
    case 'mrk.jpg':
      return mrkImg;
    case 'snt.jpeg':
      return sntImg;
    case 'stt.jpg':
      return sttImg;
    case 'chs.jpg':
      return chsImg;
    case 'bsk.jpeg':
      return bskImg;
    case 'afu.jpeg':
      return afuImg;
    default:
      return imagePath;
  }
}

