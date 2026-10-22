export function checkHeading(str) {
  if (!str) return false;
  return str.includes("###") || str.includes("**") || str.includes("*");
}

export function replaceHeadingStars(str) {
  if (!str) return "";
  // This replaces:
  // 1. ### (hashtags)
  // 2. ** (double asterisks)
  // 3. * (single asterisks used for italics)
  return str.replace(/###|\*\*|\*/g, "").trim();
}

export function formatListText(str) {
  if (!str || typeof str !== 'string') return str;
  let formatted = str.replace(/([.?!])\s+(\d+\.)\s+/g, '$1\n\n$2 ');
  formatted = formatted.replace(/\s+(\d+\.)\s+/g, '\n\n$1 ');
  formatted = formatted.replace(/>\s*/g, '');
  return formatted;
}

// Helper function to convert a file to Base64
export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract base64 string without the prefix (e.g., "data:image/jpeg;base64,")
      const base64String = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type
        }
      });
    };
    reader.onerror = (error) => reject(error);
  });
};