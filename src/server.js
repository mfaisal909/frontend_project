// Central API configuration.
//
// Every request in the app is built from `server`, so the backend URL is
// normalised here exactly once. The value can come from the Vite build-time
// env vars (VITE_API_URL / VITE_BACKEND_URL) or the production fallbacks.
//
// Env vars that carry a trailing slash (or duplicate slashes such as
// "...vercel.app//api/v2") are collapsed so that a request can never hit
// Vercel with a double slash, which the platform would otherwise answer with
// a 308 redirect.

const collapseSchemeAndSlashes = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  const match = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*:\/\/)(.*)$/);
  if (!match) return trimmed.replace(/\/{2,}/g, "/").replace(/\/+$/, "");

  const rest = match[2].replace(/\/{2,}/g, "/").replace(/\/+$/, "");
  return `${match[1]}${rest}`;
};

const PROD_API_URL = "https://vercel-backend-umber-eta.vercel.app/api/v2";

const rawServer = collapseSchemeAndSlashes(
  import.meta.env.VITE_API_URL || PROD_API_URL
);

// The API is always mounted at /api/v2 (see backend/app.js). If an env var
// points at the bare origin, keep the prefix attached so no request loses it.
export const server = /\/api\/v\d+\/?$/i.test(rawServer)
  ? rawServer
  : `${rawServer.replace(/\/+$/, "")}/api/v2`;

// Backend origin used to resolve /uploads images and for socket.io.
export const backendOrigin = collapseSchemeAndSlashes(
  import.meta.env.VITE_BACKEND_URL || server.replace(/\/api\/v\d+\/?$/, "")
);

const backend_url = `${backendOrigin}/`;
export default backend_url;

// Uploads are stored as root-relative paths (e.g. "/uploads/products/x.jpg")
// unless Cloudinary is configured, so they must be resolved against the
// backend origin. Absolute URLs and data URIs are passed through untouched.
export const resolveImageUrl = (url) => {
  if (typeof url !== "string" || url === "") {
    return "";
  }

  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  return url.startsWith("/") ? `${backendOrigin}${url}` : url;
};