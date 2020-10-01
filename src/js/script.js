const WEB_P_HEIGHT = 2;

const defineWebpSupport = (cb) => {
  const webp = new Image();

  webp.onload = webp.onerror = () => {
    cb(webp.height == WEB_P_HEIGHT);
  };
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
};

defineWebpSupport((support) => {
  if (support) {
    document.querySelector('body').classList.add('webp');
  } else {
    document.querySelector('body').classList.add('no-webp');
  }
});
