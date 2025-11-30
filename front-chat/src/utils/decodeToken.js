// simple JWT payload decode (no signature check): used only for extracting username from token
export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.sub || decoded.username || null;
  } catch (e) {
    console.warn("Failed to decode token", e);
    return null;
  }
}
