const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Returns the full URL for a product image.
 * If the image path is already a full URL (starts with http), it returns it as is.
 * Otherwise, it prepends the backend base URL from the .env file.
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Ensure we don't have double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};
