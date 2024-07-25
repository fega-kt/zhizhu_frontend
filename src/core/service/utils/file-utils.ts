export const readImageFileAsDataUrl = (imageFile: File) => {
  const reader = new FileReader();
  return new Promise<string>((resolve) => {
    reader.onload = (e) => {
      if (e.target) resolve(e.target.result as string);
    };
    reader.readAsDataURL(imageFile);
  });
};

export const readFileAsString = (file: File) => {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.readAsText(file, 'UTF-8');
    reader.onload = (evt) => {
      if (evt.target && evt.target.result) {
        resolve(evt.target.result as string);
      } else {
        reject();
      }
    };
    reader.onerror = () => {
      reject();
    };
  });
};
