'use strict';

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
