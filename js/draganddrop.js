// Функции, обрабатывающие события, связанные с загрузкой файлов через перетаскивание на страницу

// Начальное значение драг(целевого) элемента
let movedPiece = null,
    minY,
    minX,
    maxX,
    maxY,
    shiftX = 0,
    shiftY = 0;

// добавляем обработчика события 'mousedown' на dragElement
dragElement.addEventListener('mousedown', dragStart, false);

// срабатывает, когда зажата левая клавиша мыши
// размещает объект в середине экрана
function dragStart(event) {
  if (event.which !== 1) {
    return;
  };

  movedPiece = menu;
  minY = wrap.offsetTop + 1;
  minX = wrap.offsetLeft + 1;
  maxX = wrap.offsetLeft + wrap.offsetWidth - movedPiece.offsetWidth - 1;
  maxY = wrap.offsetTop + wrap.offsetHeight - movedPiece.offsetHeight - 1;
  shiftX = event.pageX - event.target.getBoundingClientRect().left - window.pageXOffset;
  shiftY = event.pageY - event.target.getBoundingClientRect().top - window.pageYOffset;
};

// добавляем обработчика события 'mousemove' на всю страницу
document.addEventListener('mousemove', event => drag(event.pageX, event.pageY));

// перемещаем драг элемент
function drag(x, y) {
  if (wrap.offsetWidth === menu.offsetWidth + parseInt(menu.style.left) + 1) {
    drop();
    menu.style.left = (parseInt(menu.style.left) - 2) + 'px';
  } else if (menu.style.left === '1px') {
      drop();
      menu.style.left = (parseInt(menu.style.left) + 2) + 'px';
  } else if (menu.style.top === '1px') {
      drop();
      menu.style.top = (parseInt(menu.style.top) + 2) + 'px';
  } else if (wrap.offsetHeight === menu.offsetHeight + parseInt(menu.style.top) + 1) {
      drop();
      menu.style.top = (parseInt(menu.style.top) - 2) + 'px';
  };

  if (movedPiece) {
    x = x - shiftX;
    y = y - shiftY;
    x = Math.min(x, maxX);
    y = Math.min(y, maxY);
    x = Math.max(x, minX);
    y = Math.max(y, minY);
    movedPiece.style.left = x + 'px';
    movedPiece.style.top = y + 'px';
  } else {
    return;
  }
};

// добавляем обработчика события 'mouseup' на dragElement
dragElement.addEventListener('mouseup', drop, false);

// возвращаемся в начальное значение драг эл-та
function drop() {
  movedPiece = null;
};

// добавляем обработчика события 'dragover' на тело страницы
bodyEl.addEventListener('dragover', dragOverHandler, false);

// отменяет событие
function dragOverHandler(event) {
  event.preventDefault();
};

// добавляем обработчика события 'dragend' на тело страницы
bodyEl.addEventListener('dragend', dragEndHandler, false);

// работа с перетаскиваемыми файлами
function dragEndHandler(event) {
  const data = event.dataTransfer;
  if (data.items) {
    for (let i = 0; i < data.items.length; i++) {
      data.items.remove(i);
    }
  } else {
    event.dataTransfer.clearData();
  };
};

// добавляем обработчика события 'drop' на тело страницы
bodyEl.addEventListener('drop', dropHandler, false);

// проверяет расширение перетаскиваемого файла, отправляет на сервер
function dropHandler(event) {
  event.preventDefault();
  const data = event.dataTransfer;

  if (data.items[0].kind === "file" && 
     (data.items[0].type === "image/png" || data.items[0].type === "image/jpeg")) {
    const dropDateItem = data.items[0].getAsFile();
    formatError.classList.add('hidden');
    checkForReDownloadThroughDrop(dropDateItem);
  } else {
    formatError.classList.remove('hidden');
  };
};

// проверяет на идентичность загружаемого файла
function checkForReDownloadThroughDrop(dropDateItem) {
  if (image.getAttribute('src') === './pic/image.png') {
    sendImage(dropDateItem);
  } else {
    repeatDownloadErr.classList.remove('hidden');
  };
};
