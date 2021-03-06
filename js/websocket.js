// Функции, обрабатывающие веб-сокет подключение к серверу, отображению изображения по соединению

let websocket;

// веб-сокет подключение к серверу
function wsConnect() {
  websocket = new WebSocket('wss://neto-api.herokuapp.com/pic/' + window.imageID);
  websocket.onopen = function (event) {
    console.log('Соединение установлено');
    shareMode();
    formatError.classList.add('hidden');
    image.style.display = 'block';
    imageUrlEl.value = window.location.protocol + '//' + window.location.host + window.location.pathname + '?id=' + imageID;
  };
  websocket.onclose = function (event) {
    alert('Соединение разорвано');
    console.log(event);
  };
  websocket.onmessage = function (event) {
    let data = JSON.parse(event.data);
    switch (data.event) {
      case 'pic':
        localStorage.setItem('saveImg', data.pic.url);
        image.src = data.pic.url;
        image.onload = function () {
          if (data.pic.mask) {
            placeMask(data.pic.mask);
          };
          if (data.pic.comments) {
            commentsLoad(data.pic.comments);
          };
          setTimeout(function () {
            canvasImageDraw.width = picture.clientWidth;
            canvasImageDraw.height = picture.clientHeight;
            canvasMask.width = picture.clientWidth;
            canvasMask.height = picture.clientHeight;
          }, 2000);
        };
        break;
      case 'comment':
        renderComment(data.comment);
        break;
      case 'mask':
        placeMask(data.url)
        break;
    };
    console.log(data);
  };
  websocket.onerror = function (error) {
    document.getElementById('header').innerHTML = "";
    document.getElementById('content').innerHTML = "";
    document.getElementById('header').appendChild(document.createTextNode('Ошибка'));
    document.getElementById('content').appendChild(document.createTextNode(error.message));
    document.getElementById('modal').style.display = 'block';
  };
};

// работа с маской canvas (помещение изображения)
function placeMask(url) {
  const mask = canvasMask;
  mask.width = pictureWrap.clientWidth;
  mask.height = pictureWrap.clientHeight;
  mask.style.width = '100%';
  mask.style.height = '100%';
  const context = mask.getContext('2d');
  context.clearRect(0, 0, mask.width, mask.height);
  let img = new Image;
  img.onload = function () {
    context.drawImage(img, 0, 0);
  };
  img.src = url;
};

// отображение рисунков у других пользователей
function sendCanvas() {
  let canvas = canvasImageDraw,
      imageData = canvas.toDataURL('image/png'),
      byteArray = convertDataURIToBinary(imageData);
  websocket.send(byteArray.buffer);
};

// форматируем отправление данных по веб-сокет соединению
function convertDataURIToBinary(dataURI) {
  const marker = ';base64,';
  let markerIndex = dataURI.indexOf(marker) + marker.length,
      base64 = dataURI.substring(markerIndex),
      raw = window.atob(base64),
      rawLength = raw.length,
      byteArray = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    byteArray[i] = raw.charCodeAt(i);
  };

  return byteArray;
};
