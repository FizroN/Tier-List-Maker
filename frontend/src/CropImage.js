export default function getCroppedImg(imageSrc, croppedAreaPixels) {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // important if loading external image URLs
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const base64Image = canvas.toDataURL("image/jpeg");
      resolve(base64Image); // return base64 image string
    };
  });
}
