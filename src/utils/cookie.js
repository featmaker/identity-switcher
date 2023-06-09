/* eslint-disable no-undef */
export default class Cookie {
  static async get(url, name) {
    const cookie = await chrome.cookies.get({
      url,
      name,
    });
    return cookie;
  }

  static async remove(url, name) {
    return chrome.cookies.remove({ url, name });
  }

  static async set(cookie) {
    return chrome.cookies.set(cookie);
  }

  static async syncToTarget(cookie) {
    return Cookie.set(cookie);
  }
}
