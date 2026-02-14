import { setAuthToken } from "./api";

const KEY = "giis_token_v1";
const ME = "giis_me_v1";

export function loadToken() {
  const t = localStorage.getItem(KEY);
  if (t) setAuthToken(t);
  return t;
}
export function saveToken(t) {
  localStorage.setItem(KEY, t);
  setAuthToken(t);
}
export function clearToken() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(ME);
  setAuthToken(null);
}
export function saveMe(me) {
  localStorage.setItem(ME, JSON.stringify(me || {}));
}
export function loadMe() {
  try { return JSON.parse(localStorage.getItem(ME) || "null"); }
  catch { return null; }
}
