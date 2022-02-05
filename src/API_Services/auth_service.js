export function getAccessToken() {
  return localStorage.getItem('access-token');
}

export function setAccessToken(token) {
  return localStorage.setItem('access-token', token);
}
