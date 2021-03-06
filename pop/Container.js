import Sprite from "./Sprite.js";
import Texture from "./Texture.js";
import TileSprite from "./TileSprite.js";
import Vec from "./utils/Vec.js";

class Container {
  constructor() {
    this.pos = new Vec();
    this.children = [];
  }

  add(child) {
    this.children.push(child);
    return child;
  }

  remove(child) {
    this.children = this.children.filter(c => c !== child);
    return child;
  }

  map(f) {
    return this.children.map(f);
  }

  update(dt, t) {
    this.children = this.children.filter(child => {
      if (child.update) {
        child.update(dt, t, this);
      }
      return child.dead ? false : true;
    });
  }

  // TODO: is this a good idea? Not really common outside of very simple entities
  get make() {
    return {
      sprite: path => this.add(
        new Sprite(new Texture(path))
      ),
      tileSprite: (path, w, h) => {
        return this.add(
          new TileSprite(new Texture(path), w, h)
        );
      }
    };
  }
}

export default Container;
