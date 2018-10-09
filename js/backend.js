'use strict';


(function () {
  var Code = {
    SUCCESS: 200,
    CASHED: 302,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500
  };

  window.backend = {
    getData: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        var error;
        switch (xhr.status) {
          case Code.SUCCESS:
            onLoad(xhr.response);
            break;

          case Code.BAD_REQUEST:
            error = 'Неверный запрос';
            break;

          case Code.UNAUTHORIZED:
            error = 'Проблемы с авторизацией';
            break;
          case Code.NOT_FOUND_ERROR:
            error = 'Ничего не найдено';
            break;
          case Code.SERVER_ERROR:
            error = 'Ошибка сервера';
            break;

          default:
            error = 'Статус ответа: ' + xhr.status + ' ' + xhr.status.text;
        }
        if (error) {
          onError(error);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('GET', URL);
      xhr.send();
    },

    sendData: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/keksobooking';

      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 5000;

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };

})();
