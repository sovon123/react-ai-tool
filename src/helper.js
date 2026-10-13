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