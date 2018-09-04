'use strict';

(function () {

  var form = document.querySelector('.ad-form');
  var success = document.querySelector('.success');
  var formFieldset = form.querySelectorAll('fieldset');
  var select = form.querySelectorAll('select');
  var formElements = form.querySelectorAll('input');
  var mapPinInfo = document.querySelector('.map');
  var resetButton = form.querySelector('.ad-form__reset');
  var mainPin = mapPinInfo.querySelector('.map__pin--main');
  var formAddress = form.querySelector('#address');
  var accommodationType = form.querySelector('#type');
  var accommodationPrice = form.querySelector('#price');


  var changePriceSelectHandler = function () {
    switch (accommodationType.value) {
      case 'bungalo':
        accommodationPrice.placeholder = 0;
        accommodationPrice.min = 0;
        break;
      case 'flat':
        accommodationPrice.placeholder = 1000;
        accommodationPrice.min = 1000;
        break;
      case 'house':
        accommodationPrice.placeholder = 5000;
        accommodationPrice.min = 5000;
        break;
      case 'palace':
        accommodationPrice.placeholder = 10000;
        accommodationPrice.min = 10000;
        break;
    }
  };
  accommodationType.addEventListener('change', changePriceSelectHandler);

  // Синхронизация времени заезда и выезда
  var timeCheckIn = form.querySelector('#timein');
  var timeCheckOut = form.querySelector('#timeout');

  var changeTimeInSelectHandler = function () {
    timeCheckOut.value = timeCheckIn.value;
  };

  var changeTimeOutSelectHandler = function () {
    timeCheckIn.value = timeCheckOut.value;
  };

  timeCheckIn.addEventListener('change', changeTimeInSelectHandler);
  timeCheckOut.addEventListener('change', changeTimeOutSelectHandler);


  // Синхронизация количества комнат и количество мест
  var rooms = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');

  var roomsSelectHandler = function () {
    if (capacity.value === '0' && rooms.value === '100') {
      capacity.setCustomValidity('');
      rooms.setCustomValidity('');
    } else if (rooms.value === '100' && capacity.value !== '0') {
      capacity.setCustomValidity('Такое количество комнат не для гостей');
    } else if (capacity.value === '0' && rooms.value !== '100') {
      rooms.setCustomValidity('Не для гостей только 100 комнат');
    } else if (rooms.value >= capacity.value) {
      capacity.setCustomValidity('');
    } else {
      capacity.setCustomValidity('В каждой комнате максимум по одному гостю');
    }
  };

  form.addEventListener('change', roomsSelectHandler);

  // Функция закрытия popup
  var closePopup = function () {
    success.classList.add('hidden');
    success.removeEventListener('mousedown', closePopup);
  };

  // Фукнкция возврата главной метки
  var returnMainPin = function () {
    mainPin.style = 'left: 570px; top: 375px;';
    formAddress.value = 570 + ', ' + 375;
  };


  // Деактивация страницы
  var buttonResetHandler = function () {
    var allPin = mapPinInfo.querySelectorAll('.map__pin:not(.map__pin--main)');
    var allCard = mapPinInfo.querySelectorAll('.map__card');

    mapPinInfo.classList.add('map--faded');

    form.classList.add('ad-form--disabled');

    // Прячем все Пины
    allPin.forEach(function (pin) {
      pin.classList.add('visually-hidden');
    });
    // Прячем все Карточки
    allCard.forEach(function (card) {
      card.classList.add('visually-hidden');
    });
    // Убираем доступ к полям
    formFieldset.forEach(function (fieldset) {
      fieldset.setAttribute('disabled', '');
    });
    // Очищаем поля ввода
    select.forEach(function (sel) {
      sel.value = '';
    });
    formElements.forEach(function (element) {
      element.value = '';
    });
    form.querySelector('textarea').value = '';

    returnMainPin();
  };

  var buttonSubmitHandler = function () {
    buttonResetHandler();

    success.classList.remove('hidden');
    success.addEventListener('mousedown', closePopup);
    document.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, closePopup);
    });
  };


  window.errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.bottom = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    var closeErrorMessage = function () {
      node.classList.add('hidden');
    };

    setTimeout(closeErrorMessage, 3000);
  };

  form.addEventListener('submit', function (evt) {
    window.backend.sendData(new FormData(form), buttonSubmitHandler, window.errorHandler);
    evt.preventDefault();
  });

  resetButton.addEventListener('click', buttonResetHandler);

})();
