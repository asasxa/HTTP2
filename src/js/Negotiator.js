export default class Negotiator {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  createRequest(options) {
    if (!options) {
      throw new Error('Параметр options функции createRequest не задан');
    }

    const { method, data, callback, headers = {} } = options;
    let url = this.baseURL;
    if (options.url) {
      url += options.url;
    }

    const xhr = new XMLHttpRequest();

    xhr.timeout = 10000;
    xhr.onerror = () => {
      console.error('Network error: request failed');
    };
    xhr.ontimeout = () => {
      console.error('Request timeout');
    };

    try {
      xhr.open(method, url);

      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }

      xhr.onloadend = () => {
        if (String(xhr.status).startsWith('2')) {
          console.log('Сервер принял и обработал запрос.');
          if (callback) {
            try {
              const response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
              callback(response);
            } catch (e) {
              callback(xhr.responseText);
            }
          }
        } else {
          let content = 'Сервер не принял запрос. ';
          content += `Ошибка ${xhr.status}: ${xhr.statusText}.`;
          console.error(content);
        }
      };

      let sendData = data;
      if (data !== undefined && typeof data === 'object' && !(data instanceof FormData)) {
        sendData = JSON.stringify(data);
        if (!headers['Content-Type'] && !headers['content-type']) {
          xhr.setRequestHeader('Content-Type', 'application/json');
        }
      }

      xhr.send(sendData);
    } catch (e) {
      console.error(e);
    }
  }
}
