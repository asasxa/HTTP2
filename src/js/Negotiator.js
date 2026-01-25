export default class Negotiator {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  createRequest(options) {
    if (!options) {
      throw new Error('Параметр options функции createRequest не задан');
    }

    const { method, data, callback, url: requestUrl = '' } = options;
    const fullUrl = this.baseURL + requestUrl;

    const xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.onerror = () => console.error('Network error');
    xhr.ontimeout = () => console.error('Request timeout');

    xhr.open(method, fullUrl);

    let sendData = data;
    if (data !== undefined && typeof data === 'object' && !(data instanceof FormData)) {
      sendData = JSON.stringify(data);
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response = null;
        try {
          response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
        } catch (e) {
          response = xhr.responseText;
        }
        if (callback) callback(response);
      } else {
        console.error(`Ошибка ${xhr.status}: ${xhr.statusText}`);
      }
    };

    xhr.send(sendData);
  }
}
