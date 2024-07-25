export const isNameInvalid = (name: string) => {
  const n = name.toLowerCase();
  return (
    n.length >= 255 ||
    ["'", '~', '"', '#', '%', '&', '*', ':', '<', '>', '?', '/', '\\', '{', '|', '}', ';'].some(
      (v) => n.includes(v.toLowerCase()),
    ) ||
    ['.lock'].some((v) => n.endsWith(v.toLowerCase())) ||
    [
      'CON',
      'PRN',
      'AUX',
      'NUL',
      'COM0',
      'COM1',
      'COM2',
      'COM3',
      'COM4',
      'COM5',
      'COM6',
      'COM7',
      'COM8',
      'COM9',
      'LPT0',
      'LPT1',
      'LPT2',
      'LPT3',
      'LPT4',
      'LPT5',
      'LPT6',
      'LPT7',
      'LPT8',
      'LPT9',
      '_vti_',
      'desktop.ini',
    ].some((v) => v.toLowerCase() === n)
  );
};
