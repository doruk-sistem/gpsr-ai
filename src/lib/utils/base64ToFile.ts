export function base64ToFile(
  base64Data: string,
  fileName: string,
  mimeType: string
) {
  const byteString = atob(base64Data.split(",")[1]); // Decode Base64 content
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
}
