//Функции, обрабатывающие события, связанные с комментариями/комментированием

// добавляем обработчика события 'click' на commentsEl
commentsEl.addEventListener('click', commentsVisibleChange, false);

// показывает все комментарии
function commentsVisibleChange() {
  const comments = picture.querySelectorAll('[data-top]');

  for (let i = 0; i < comments.length; i++) {
    if (commentsOn.checked) {
      comments[i].classList.remove('hidden');
    } else {
      comments[i].classList.add('hidden');
    };
  };
};

// добавляем обработчика события 'click' на маску объекта
canvasMask.addEventListener('click', commentAdd, false);

// открывает окно добавления комментария
// добавляет комментарий, если нажали на кнопку "добавить"
function commentAdd(event) {
  newCommentForm.style.left = `${event.offsetX - 22}px`;
  newCommentForm.style.top = `${event.offsetY - 14}px`;
  newCommentForm.classList.remove('hidden');
  
  const submitLoader = newCommentForm.querySelector('.comment_loader'),
        checkbox = newCommentForm.querySelector('.comments__marker-checkbox'),
        textField = newCommentForm.querySelector('.comments__input'),
        closeBtn = newCommentForm.querySelector('.comments__close');
        
  submitLoader.classList.add('hidden');
  checkbox.checked = true;
  checkbox.disabled = true;
  textField.focus();
  closeBtn.addEventListener('click', () => newCommentForm.classList.add('hidden'), false);
  
  newCommentForm.reset();
};

// добавляем обработчика события 'submit' на блок с картинкой
pictureWrap.addEventListener('submit', sendCommentDateAfterSubmit, false);

// добавляет комментарий к остальным комментариям
function sendCommentDateAfterSubmit(event) {
  event.preventDefault();
  newCommentForm.classList.add('hidden');
  
  let imageID = window.imageID;
  const textField = event.target.querySelector('.comments__input'),
        commentData = {
         'message': textField.value,
         'left': parseInt(event.target.style.left),
         'top': parseInt(event.target.style.top)
        },
        checkbox = event.target.querySelector('.comments__marker-checkbox'),
        submitLoader = event.target.querySelector('.comment_loader');
  
  checkbox.checked = true;
  checkbox.disabled = false;
  sendComment(commentData);
  submitLoader.classList.remove('hidden');
};

// взаимодействие с сервером
// отправляем комментарий на сервер
function sendComment(data) {
  newCommentForm.reset();
  let bodyRequest = [];
  for (let property in data) {
    let encodedKey = encodeURIComponent(property),
        encodedValue = encodeURIComponent(data[property]);
    bodyRequest.push(encodedKey + '=' + encodedValue);
  };
  bodyRequest = bodyRequest.join('&');
  const request = new XMLHttpRequest();
  // если ошибка запроса - отправляет в лог
  request.addEventListener('error', () => console.log(request.responseText));
  request.addEventListener('load', () => {
    if (request.status === 200) {
      let response = JSON.parse(request.responseText);
    } else {
      alert(request.responseText);
    };
  });
  request.open('POST', 'https://neto-api.herokuapp.com/pic/' + imageID + '/comments', true);
  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  request.send(bodyRequest);
};

// загружаем комментарий
function commentsLoad(comments) {
  for (let comment in comments) {
    let curComment = {
      message: comments[comment].message,
      left: comments[comment].left,
      top: comments[comment].top
    };
    renderComment(curComment);
  };
};

// обрабатываем коммент, помещаем в форму
function renderComment(comment) {
  const currentFormNode = document.querySelector(`.comments__form[data-left="${comment.left}"][data-top="${comment.top}"]`);
  if (currentFormNode) {
    const submitLoader = currentFormNode.querySelector('.comment_loader');
    submitLoader.classList.add('hidden');
    renderNewCommentElement(currentFormNode, comment);
  } else {
    placeComment(comment);
  };
};

// размещение комментария
function placeComment(comment) {
  const commentsFormSimple = newCommentForm,
        commentElement = commentsFormSimple.cloneNode(true);
  
  commentElement.classList.remove('hidden');
  commentElement.classList.remove('new_comment');
  commentElement.querySelector('.comments__submit').classList.add('on_place');
  commentElement.style.top = `${comment.top}px`;
  commentElement.style.left = `${comment.left}px`;
  commentElement.dataset.top = comment.top;
  commentElement.dataset.left = comment.left;
  
  const submitLoader = commentElement.querySelector('.comment_loader'),
        checkbox = commentElement.querySelector('.comments__marker-checkbox');
  submitLoader.classList.add('hidden');
  checkbox.checked = true;
  checkbox.disabled = false;
  // добавляем обработчик события 'click' на чекбокс
  checkbox.addEventListener('click', event => {
    let commentsForm = $$('.comments__form');
    for (let i = 0; i < commentsForm.length; i++) {
      commentsForm[i].style.zIndex = '100';
    }
    event.currentTarget.parentNode.style.zIndex = '110';
  });
  let date = new Date(),
      time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  const commentDatetime = commentElement.querySelector('.comment__time'),
        commentMessage = commentElement.querySelector('.comment__message'),
        closeBtn = commentElement.querySelector('.comments__close');
  
  commentDatetime.textContent = time;
  commentMessage.setAttribute('style', 'white-space: pre;');
  commentMessage.textContent = comment.message;
  closeBtn.addEventListener('click', () => commentElement.querySelector('.comments__marker-checkbox').checked = false, false)
  picture.appendChild(commentElement);
  commentsVisibleChange();
};

// обрабатываем вид отображения, формируем новый блок для комментария
function renderNewCommentElement(currentFormNode, comment) {
  const currentFormNodeCommentsBody = currentFormNode.querySelector('.comments__body'),
        currentFormNodeLoader = currentFormNode.querySelector('.comment_loader'),
        commentsFormSimple = currentFormNodeCommentsBody.querySelector('.comment'),
        commentElement = commentsFormSimple.cloneNode(true),
        commentDatetime = commentElement.querySelector('.comment__time'),
        commentMessage = commentElement.querySelector('.comment__message');
  let date = new Date(),
      time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  
  commentDatetime.textContent = time;
  commentMessage.setAttribute('style', 'white-space: pre;');
  commentMessage.textContent = comment.message;
  currentFormNodeCommentsBody.insertBefore(commentElement, currentFormNodeLoader);
  currentFormNode.reset();
  commentsVisibleChange();
};

// сбрасываем комментарий
function resetComment() {
  let curCommentsArr = pictureWrap.querySelectorAll('[data-top]'),
      elemArr = Array.from(curCommentsArr);
  for (let i = 0; i < elemArr.length; i++) {
    pictureWrap.removeChild(elemArr[i]);
  };
};