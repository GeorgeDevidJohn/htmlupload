const SESSION_KEY = "html_upload_session_token";

export function readStoredSessionToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(SESSION_KEY);
}

export function writeStoredSessionToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(SESSION_KEY, token);
}

export function clearStoredSessionToken() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(SESSION_KEY);
}
