import pop from "../../pop/index.js";
const { Container, Text, Rect } = pop;

class Overlay extends Container {
  constructor() {
    super();
    this.add(new Rect(300, 300, { fill: "rgba(0, 0, 0, 0.9)" }));
    this.add(
      new Text("The ghosts. They will get you.", {
        font: "bold 15pt 'Amatic SC', sans-serif",
        fill: "#fff"
      })
    ).pos.set(100, 100);
  }
}

export default Overlay;
