import pop from "../pop/index.js";
const { Container, Text, Sound } = pop;

const laugh = new Sound("res/sounds/laugh.mp3", {});

class TitleScreen extends Container {
  constructor(w, h, controls, onPlay) {
    super();
    [...document.querySelectorAll(".ui")].forEach(e => e.style.display = "none");
    const t = this.add(new Text("Obake by Mr Speaker", { fill: "#fff", font: "bold 40pt 'Amatic SC', sans-serif", align: "center" }));
    t.pos.set(w / 2, 100);
    const f1 = { fill: "#fff", font: "bold 20pt 'Amatic SC', sans-serif" };
    const f2 = { fill: "#fff", font: "bold 16pt 'Amatic SC', sans-serif", align: "center" };
    this.add(new Text("The Graveyard", f1)).pos.set(200, 230);
    this.add(new Text("W A S D: Move about", f1)).pos.set(200, 280);
    this.add(new Text("Mouse: Look and shoot", f1)).pos.set(200, 310);
    this.add(new Text("Space: Jump", f1)).pos.set(200, 340);

    this.add(new Text("The Crypt", f1)).pos.set(500, 230);
    this.add(new Text("W A S D: Move about", f1)).pos.set(500, 280);

    this.add(new Text("press space to start", f2)).pos.set(w / 2, 440);
    this.controls = controls;
    this.onPlay = onPlay;
    controls.reset();
    laugh.play();
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
