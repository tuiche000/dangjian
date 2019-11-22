import { parse } from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function setAuthority(authority: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) {
  return localStorage.setItem('access_token', authority.access_token);
}
