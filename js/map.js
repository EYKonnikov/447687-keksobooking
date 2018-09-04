'use strict';

(function () {
  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var mapPinInfo = document.querySelector('.map');
  var mapFilter = mapPinInfo.querySelectorAll('.map__filter');
  var mapFilterFeatures = mapPinInfo.querySelector('#housing-features');

  // Функция сохранения данных в массив
  window.newData = [];

  var successHandler = function (data) {
    for (var i = 0; i < data.length; i++) {
      data[i].id = i + '';
    }
    window.newData = data;
    window.makePinsElements(window.newData);

    mapFilterFeatures.removeAttribute('disabled');

    mapFilter.forEach(function (element) {
      element.removeAttribute('disabled');
    });
  };

  // Активация страницы
  var adFormFieldset = adForm.querySelectorAll('fieldset');
  var activationPage = function () {
    mapPinInfo.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    adFormFieldset.forEach(function (fieldset) {
      fieldset.removeAttribute('disabled');
    });

    var allPin = mapPinInfo.querySelectorAll('.map__pin:not(.map__pin--main)');

    // Показываем все Пины
    allPin.forEach(function (pin) {
      pin.classList.remove('visually-hidden');
    });
  };

  // Активация страницы
  var activationPageHandler = function () {
    activationPage();
  };

  var downloadHandler = function () {
    window.backend.getData(successHandler, window.errorHandler);
    mainPin.removeEventListener('mouseup', downloadHandler);
  };

  mainPin.addEventListener('mouseup', downloadHandler);
  mainPin.addEventListener('mouseup', activationPageHandler);

  // Создание елементов
  window.makeElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) {
      element.classList.add(className);
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  window.random = {
    // Функция рандомизации
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    // Функция создания случайной длины массива
    getRandomFeatures: function (arr) {
      var arr2 = arr.slice(this.getRandomInt(0, arr.length - 1));
      return arr2;
    }
  };
})();
