import Vec from "./utils/Vec.js";

class Text {
  constructor(text = "", style = {}) {
    this.pos = new Vec(0, 0);
    this.text = text;
    this.style = style;
  }
}

export default Text;
