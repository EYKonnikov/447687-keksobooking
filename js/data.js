'use strict';

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
