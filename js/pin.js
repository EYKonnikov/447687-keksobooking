'use strict';

(function () {

  var LOCATION_MIN_X = -32;
  var LOCATION_MAX_X = 1230;
  var LOCATION_MIN_Y = 90;
  var LOCATION_MAX_Y = 685;

  window.makePinsElements = function (data) {
    var mapPinsList = document.querySelector('.map__pins');
    var fragmentPin = document.createDocumentFragment();

    for (var i = 0; i < data.length && i < 5; i++) {
      var newPin = window.makeElement('button', 'map__pin');
      newPin.style = 'left: ' + (data[i].location.x - 20) + 'px; top: '
        + (data[i].location.y - 40) + 'px;';

      var newPinAvatar = window.makeElement('img');
      newPinAvatar.width = '40';
      newPinAvatar.height = '40';
      newPinAvatar.src = data[i].author.avatar;

      newPinAvatar.alt = data[i].offer.title;

      newPin.appendChild(newPinAvatar);

      var index = data[i].id;

      // Добавляем аттрибут с индексом
      newPin.setAttribute('adIndex', index);
      // Вешаем обработчик события
      newPin.addEventListener('click', pinClickHundler, false);
      // Добавляем класс map__pin--active на пин
      newPin.addEventListener('click', addActivePinHandler, false);
      // Добавляем созданный элемент во фрагмент
      fragmentPin.appendChild(newPin);
    }

    mapPinsList.appendChild(fragmentPin);
  };

  // Функция добавления класса на активный Пин
  var addActivePinHandler = function (evt) {
    var target = evt.target;
    var pastActivePin = document.querySelector('.map__pin--active');

    if (pastActivePin !== null) {
      pastActivePin.classList.remove('map__pin--active');
    }

    if (target.tagName !== 'BUTTON') {
      target.parentNode.classList.add('map__pin--active');
    } else {
      target.classList.add('map__pin--active');
    }
  };

  var pinClickHundler = function (evt) {
    var target = evt.target;
    var clickedPinIndex = target.getAttribute('adIndex');

    if (target.tagName !== 'BUTTON') {
      clickedPinIndex = target.parentNode.getAttribute('adIndex');
    }
    // Проверям наличие похожих элементов на странице
    var popupElements = document.querySelectorAll('.popup');
    var similarElement = document.querySelector('[docindex="' + clickedPinIndex + '"]');

    // Добавляем/Удаляем класс visually-hidden
    if (document.contains(similarElement) === false) {
      window.makeAdElement(clickedPinIndex);
    }
    for (var i = 0; i < popupElements.length; i++) {
      if (popupElements[i] === similarElement) {
        similarElement.classList.remove('visually-hidden');
      } else {
        popupElements[i].classList.add('visually-hidden');
      }
    }
  };

  // Функция перетаскивания главной метки
  var dragAndDropMainPin = function () {
    var mainPin = document.querySelector('.map__pin--main');
    var adFormAddress = document.querySelector('input[name=address]');

    // Точки главной метки при загрузки страницы
    var pointOfPinX = Math.round(mainPin.offsetLeft);
    var pointOfPinY = Math.round(mainPin.offsetTop);

    // Координаты до активации страницы
    adFormAddress.value = pointOfPinX + ', ' + pointOfPinY;


    // Передвижение главной метки по карте
    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      // Начальные координаты
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      // Метод перемещения
      var pinMouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();
        // Нахождение смещения главной метки
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };
        // Переопределение начальных точек
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        //
        if (mainPin.offsetTop - shift.y < LOCATION_MAX_Y - mainPin.offsetHeight && mainPin.offsetTop - shift.y > LOCATION_MIN_Y) {
          mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
        }

        if (mainPin.offsetLeft - shift.x < LOCATION_MAX_X - mainPin.offsetWidth && mainPin.offsetLeft - shift.x > LOCATION_MIN_X) {
          mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
        }

        // Передача координат в строку адреса
        adFormAddress.value = (mainPin.offsetLeft - shift.x) + ', ' + (mainPin.offsetTop - shift.y);
      };
      // Удаляем обработчики
      var pinMouseUpHandler = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', pinMouseMoveHandler);
        document.removeEventListener('mouseup', pinMouseUpHandler);


      };

      document.addEventListener('mousemove', pinMouseMoveHandler);
      document.addEventListener('mouseup', pinMouseUpHandler);

    });
  };

  dragAndDropMainPin();

})();
