const screenCapture = canvas => {
  document.addEventListener("keydown", ({which}) => {
    if (which === 192 /* ~ key */) {
      const img = new Image();
      img.src = canvas.toDataURL("image/png");
      img.style.width = "150px.js";
      img.style.height = "100px.js";
      document.body.appendChild(img);
    }
  }, false);
};

export default screenCapture;
