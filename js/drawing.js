// Функции, обрабатывающие события рисования на изображении

const initMouse = {
        x: 0,
        y: 0
    },
      curMouse = {
        x: 0,
        y: 0
    };
let canvasContext;

// обрабатываем (отображаем) рисование на картинке
function paintModeHandler() {
  const paintCanvas = $('.canvas_image_draw'),
        picture = $('.picture_wrap');
  canvasContext = paintCanvas.getContext('2d');

  canvasContext.strokeStyle = 'green';
  canvasContext.lineWidth = 5;

  paintCanvas.addEventListener('mousedown', function (event) {
    initMouse.x = event.offsetX;
    initMouse.y = event.offsetY;
    paintCanvas.addEventListener('mousemove', onPaint, false);
  }, false);

  paintCanvas.addEventListener('mouseup', function () {
    paintCanvas.removeEventListener('mousemove', onPaint, false);
    sendCanvas();
  }, false);

  const menuColor = document.getElementsByClassName('menu__color');
  for (let i = 0; i < menuColor.length; i++) {
    menuColor[i].addEventListener('click', changeColor, false);
  };
};

function onPaint(event) {
  curMouse.x = event.offsetX;
  curMouse.y = event.offsetY;
  with(canvasContext) {
    beginPath();
    lineJoin = 'round';
    moveTo(initMouse.x, initMouse.y);
    lineTo(curMouse.x, curMouse.y);
    closePath();
    stroke();
  };
  initMouse.x = curMouse.x;
  initMouse.y = curMouse.y;
};

// изменение цвета
function changeColor(event) {
  canvasContext.strokeStyle = event.target.getAttribute('value');
  canvasContext.globalCompositeOperation = 'source-over';
  canvasContext.lineWidth = 5;
};

// добавляем обработчик события 'click' на eraser-элемент
eraserEl.addEventListener('click', eraser, false);

// рисуем поверх элемента с шириной кисти 10
function eraser() {
  canvasContext.globalCompositeOperation = 'destination-out';
  canvasContext.lineWidth = 10;
};

// сбрасываем нарисованное
function resetCanvas() {
  const resetMask = $('.canvas_mask'),
        canvasContextReset = resetMask.getContext('2d'),
        resetImageDraw = $('.canvas_image_draw'),
        canvasContextResetImg = resetImageDraw.getContext('2d');
  canvasContextReset.clearRect(0, 0, resetMask.width, resetMask.height);
  canvasContextResetImg.clearRect(0, 0, resetImageDraw.width, resetImageDraw.height);
};

// добавляем обработчик события 'resize' на окно браузера
window.addEventListener('resize', resizeCanvas, false);

// изменение размера canvas
function resizeCanvas() {
  const imageDraw = $('.canvas_image_draw'),
        imageDrawContext = imageDraw.getContext('2d'),
        colors = document.getElementsByClassName('menu__color'),
        colorsArr = Array.from(colors);
  imageDraw.width = $('.picture_wrap').clientWidth;
  imageDraw.height = $('.picture_wrap').clientHeight;
  imageDrawContext.clearRect(0, 0, imageDraw.width, imageDraw.height);
  imageDrawContext.strokeStyle = 'green';
  imageDrawContext.lineWidth = 5;
  
  for (let i = 0; i < colorsArr.length; i++) {
    if (colorsArr[i].checked) {
      imageDrawContext.strokeStyle = `${colorsArr[i].defaultValue}`;
    }
  };
};
