'use strict';

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
