export default (sel, trigSel) => {
  const d = document;
  if (
    d.fullscreenEnabled ||
    d.mozFullScreenEnabled ||
    d.documentElement.webkitRequestFullScreen
  ) {
    const el = d.querySelector(sel);
    const trig = d.querySelector(trigSel);
    const set = () => {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    };
    trig.addEventListener("click", set, false);
  }
};
