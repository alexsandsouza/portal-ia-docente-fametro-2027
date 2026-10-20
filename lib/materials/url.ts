export function isDriveUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return url.hostname === "drive.google.com" || url.hostname === "docs.google.com";
  } catch {
    return false;
  }
}
