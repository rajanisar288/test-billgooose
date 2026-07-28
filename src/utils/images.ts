export function getImageAltText(
  imageName: string,
  context: string,
  isDecorative: boolean = false,
): string {
  // Decorative images should have empty alt text
  if (isDecorative) {
    return '';
  }

  // Format the image name: replace underscores/hyphens with spaces, remove extension
  const formattedName = imageName
    .replace(/[_-]/g, ' ')
    .replace(/\.[^/.]+$/, '')
    .trim();

  return `${formattedName} - ${context}`;
}
