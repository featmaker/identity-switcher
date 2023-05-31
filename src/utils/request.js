const parseJSON = (response) => {
  return new Promise((resolve) => {
    response.json().then((json) => {
      resolve({
        ok: response.ok,
        status: response.status,
        data: json || null,
        message: (json || {}).message,
      });
    });
  });
};

export default class Request {
  static async get(url, params) {
    return fetch(url, {
      method: "GET",
      credentials: "include",
      body: JSON.stringify(params),
    })
      .then(parseJSON)
      .then((response) => response)
      .catch((error) => ({ ok: false, error: error.message }));
  }

  static async post(url, params) {
    return fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(params),
    })
      .then(parseJSON)
      .then((response) => response)
      .catch((error) => ({ ok: false, data: null, error: error.message }));
  }

  static async delete(url, params) {
    return fetch(url, {
      method: "Delete",
      credentials: "include",
    })
      .then(parseJSON)
      .then((response) => response)
      .catch((error) => ({ ok: false, data: null, error: error.message }));
  }
}
