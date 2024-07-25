import dayjs from 'dayjs';
import _ from 'lodash';
import numeral from 'numeral';

import { DEFAULT_DATETIME_FORMAT, DEFAULT_NUMBER_NORMAL_FORMAT } from '@/core/misc/constant';
import { EntityBase } from '@/core/service/entity-base';

export const formatVND = (v: number) => `${numeral(v).format(DEFAULT_NUMBER_NORMAL_FORMAT)}₫`;

export const formatDateTime = (v: dayjs.Dayjs) => v.format(DEFAULT_DATETIME_FORMAT);

export const removeVietnameseTones = (unicode: string) => {
  let str = unicode.normalize();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  return str;
};

export const capitalizeFirstLetter = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};

export const formatJson = (json: string) => {
  const SPACE = 2;
  const result: string[] = [];
  const cleanJson = json.replace(/\n/g, ' ').replace(/\r/g, ' ');
  let d = '';
  let indent = 0;
  for (let charIndex = 0; charIndex < cleanJson.length; charIndex += 1) {
    let char = cleanJson.charAt(charIndex);
    if (d && char === d) {
      if (cleanJson.charAt(charIndex - 1) !== '\\') {
        d = '';
      }
    } else if (!d && (char === '"' || char === "'")) d = char;
    else if (!d && (char === ' ' || char === '\t')) char = '';
    else if (!d && char === ':') char += ' ';
    else if (!d && char === ',') char += `\n${_.repeat(' ', indent * SPACE)}`;
    else if (!d && (char === '[' || char === '{')) {
      indent += 1;
      char += `\n${_.repeat(' ', indent * SPACE)}`;
    } else if (!d && (char === ']' || char === '}')) {
      indent -= 1;
      char = `\n${_.repeat(' ', indent * SPACE)}${char}`;
    }
    result.push(char);
  }
  return result.join('');
};

/**
 * @param json item truyền vào
 * @param fields những fields cần chuyển từ Entity sang string id
 */
export const toStringId = <T extends EntityBase>(json: T, fields: Array<keyof T>) => {
  const result = json;
  fields.forEach((field) => {
    if (_.isArray(json[field])) {
      result[field] = (json[field] as any).map((item: any) => item.id);
    } else {
      result[field] = (json[field] as any).id;
    }
  });
  return result;
};

export const removeTagHTML = (text: string) => {
  return text.replace(/(<([^>]+)>)/gi, '').replaceAll('&nbsp;', '');
};
