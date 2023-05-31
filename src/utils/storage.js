/* eslint-disable no-undef */
export default class Storage {
  static async get(key) {
    return chrome.storage.local.get([key]).then((result) => result)
  }

  static async set(key, value) {
    return chrome.storage.local.set({
      [key]: value
    })
  }
}
