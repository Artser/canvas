const tick = () => {
  if (needsRendering) {
    draw(ctx);
    needsRendering = false;
  }

  let crntMenuLeftPos = menu.getBoundingClientRect().left;
  while (menu.offsetHeight > defaultMenuHeight) {
    menu.style.left = (--crntMenuLeftPos) + "px";
  }

  window.requestAnimationFrame(tick);
};
tick();
