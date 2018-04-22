import pop from "../pop/index.js";
const { Container, Text } = pop;

class TitleScreen extends Container {
  constructor(w, h, controls, onPlay) {
    super();
    [...document.querySelectorAll(".ui")].forEach(e => e.style.display = "none");
    const t = this.add(new Text("LD41 by Mr Speaker", { fill: "#fff", font: "bold 40pt 'Amatic SC', sans-serif" }));
    t.pos.set(100, 100);
    const t2 = this.add(new Text("press space", { fill: "#fff", font: "bold 20pt 'Amatic SC', sans-serif" }));
    t2.pos.set(100, 200);
    this.controls = controls;
    this.onPlay = onPlay;
    controls.reset();
  }
  update (dt, t) {
    const {controls} = this;
    if (controls.action) {
      this.onPlay();
      [...document.querySelectorAll(".ui")].forEach(e => e.style.display = "");
    }
  }
}
export default TitleScreen;
