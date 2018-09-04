'use strict';


//back

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

  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    }
  };
})();

//card

(function () {

  // Поиск шаблона
  var mapPinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__card');

  var mapFilterContainer = document.querySelector('.map__filters-container');
  var mapPinInfo = document.querySelector('.map');

  window.makeAdElement = function (index) {
    var i = index;
    var adElement = mapPinTemplate.cloneNode(true);

    var fragmentCardElement = document.createDocumentFragment();

    // Поиск кнопки закрытия объявления
    var buttonClose = adElement.querySelector('.popup__close');

    //  Функция закрытия объявления
    var closePopup = function () {
      adElement.classList.add('visually-hidden');
    };

    // Вешаем обработчик на объявления
    buttonClose.addEventListener('click', function () {
      closePopup();
    });

    document.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, closePopup);
    });

    adElement.setAttribute('docIndex', i);

    adElement.querySelector('.popup__avatar')
      .src = window.newData[i].author.avatar;

    adElement.querySelector('.popup__title')
      .textContent = window.newData[i].offer.title;

    adElement.querySelector('.popup__text--address')
      .textContent = window.newData[i].offer.address;

    adElement.querySelector('.popup__text--price')
      .textContent = window.newData[i].offer.price + '₽';

    adElement.querySelector('.popup__type')
      .textContent = window.newData[i].offer.type;

    if (window.newData[i].offer.rooms !== 0 || window.newData[i].offer.guests !== 0) {
      adElement.querySelector('.popup__text--capacity')
        .textContent = window.newData[i].offer.rooms + ' комнаты для ' +
        window.newData[i].offer.guests + ' гостей';
    } else {
      adElement.querySelector('.popup__text--capacity').remove();
    }

    adElement.querySelector('.popup__text--time')
      .textContent = 'Заезд после ' + window.newData[i].offer.checkin + ' выезд до ' +
      window.newData[i].offer.checkout;

    var popupFeatures = adElement.querySelector('.popup__features');
    var popupFeature = adElement.querySelectorAll('.popup__feature');

    for (var j = 0; j < popupFeature.length; j++) {
      popupFeatures.removeChild(popupFeature[j]);
    }

    for (var indexFeature = 0; indexFeature < window.newData[i].offer.features.length; indexFeature++) {
      var featureList = window.makeElement('li', 'popup__feature');
      featureList.classList.add('popup__feature--' + window.newData[i].offer.features[indexFeature]);
      popupFeatures.appendChild(featureList);
    }

    adElement.querySelector('.popup__description')
      .textContent = window.newData[i].offer.description;


    var photoList = adElement.querySelector('.popup__photos');
    var photoItem = adElement.querySelector('.popup__photo');

    if (window.newData[i].offer.photos.length !== 0) {
      photoItem.src = window.newData[i].offer.photos[0];
      for (var indexPhoto = 1; indexPhoto < window.newData[i].offer.photos.length; indexPhoto++) {
        var addPhoto = photoItem.cloneNode();
        addPhoto.src = window.newData[i].offer.photos[indexPhoto];
        photoList.appendChild(addPhoto);
      }
    } else {
      photoList.remove();
    }

    fragmentCardElement.appendChild(adElement);
    mapPinInfo.insertBefore(fragmentCardElement, mapFilterContainer);
  };

})();


//data

(function () {
  var OFFER_TITLE = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];


  var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var OFFER_CHECKIN = ['12:00', '13:00', '14:00'];
  var OFFER_CHECKOUT = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var offerPhotos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  // Если  i > количества, то отсчет с 0
  var offerTypeIndex = function (i) {
    if (i > 3) {
      i = i - 4;
    }
    return i;
  };

  window.arrayObjects = [];
  for (var i = 0; i < 8; i++) {
    var locationX = window.random.getRandomInt(300, 900);
    var locationY = window.random.getRandomInt(130, 630);

    var objectName = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },

      location: {
        x: locationX,
        y: locationY
      },

      offer: {
        title: OFFER_TITLE[i],
        address: locationX + ', ' + locationY,
        price: window.random.getRandomInt(1000, 1000000),
        type: OFFER_TYPE[offerTypeIndex(i)],
        rooms: window.random.getRandomInt(1, 5),
        guests: window.random.getRandomInt(1, 10),
        checkin: OFFER_CHECKIN[window.random.getRandomInt(0, 2)],
        checkout: OFFER_CHECKOUT[window.random.getRandomInt(0, 2)],
        features: window.random.getRandomFeatures(OFFER_FEATURES),
        description: '',
        photos: offerPhotos
      }
    };
    window.arrayObjects.push(objectName);
  }
})();


//debounce

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var lastTimout;
  window.debounce = function (set) {
    if (lastTimout) {
      window.clearTimeout(lastTimout);
    }
    lastTimout = window.setTimeout(set, DEBOUNCE_INTERVAL);
  };
})();

//filter

(function () {
  var filterForm = document.querySelector('.map__filters');
  var type = filterForm.querySelector('#housing-type');
  var price = filterForm.querySelector('#housing-price');
  var rooms = filterForm.querySelector('#housing-rooms');
  var guests = filterForm.querySelector('#housing-guests');
  var features = filterForm.querySelector('#housing-features');

  var removePins = function () {
    var allButtons = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < allButtons.length; i++) {
      allButtons[i].remove();
    }

    var allCards = document.querySelectorAll('.map__card');
    for (var j = 0; j < allCards.length; j++) {
      allCards[j].remove();
    }
  };

  // фильтр по типу
  var typeFilter = function (newData) {
    return type.value === 'any' || newData.offer.type === type.value;
  };

  // фильтр по цене
  var priceFilter = function (newData) {
    switch (price.value) {
      case 'low':
        return newData.offer.price < 10000;

      case 'middle':
        return newData.offer.price > 10000 && newData.offer.price < 50000;

      case 'high':
        return newData.offer.price > 50000;

      default:
        return true;
    }
  };

  // фильтр по кол-ву гостей
  var guestsFilter = function (newData) {
    return (guests.value === newData.offer.guests.toString()) || (guests.value === 'any');
  };

  // фильтр по количеству комнат
  var roomsFilter = function (newData) {
    return rooms.value === 'any' || newData.offer.rooms.toString() === rooms.value;
  };

  // фильтр по преимуществам
  var featuresFilter = function (newData) {
    var checkedElements = features.querySelectorAll('input[type=checkbox]:checked');
    var selectedFeatures = [].map.call(checkedElements, function (item) {
      return item.value;
    });
    return selectedFeatures.every(function (currentFeature) {
      return newData.offer.features.includes(currentFeature);
    });
  };

  var filterChangeHundler = function () {
    window.debounce(function () {
      var sortedArr = window.newData.filter(typeFilter).filter(priceFilter).filter(guestsFilter).filter(roomsFilter).filter(featuresFilter);
      removePins();
      window.makePinsElements(sortedArr);
    });
  };
  filterForm.addEventListener('change', filterChangeHundler);
})();


//form

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

//map


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

//pin

(function () {

  window.makePinsElements = function (data) {
    var mapPinsList = document.querySelector('.map__pins');
    var fragmentPin = document.createDocumentFragment();

    for (var i = 0; i < data.length && i < 5; i++) {
      var newPin = window.makeElement('button', 'map__pin');
      newPin.style = 'left: ' + (data[i].location.x - 20) + 'px; top: ' +
        (data[i].location.y - 40) + 'px;';

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

    var LOCATION_MIN_X = -32;
    var LOCATION_MAX_X = 1230;
    var LOCATION_MIN_Y = 90;
    var LOCATION_MAX_Y = 685;

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
