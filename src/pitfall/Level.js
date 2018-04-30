import pop from "../../pop/index.js";
const { Texture, TileMap, math } = pop;

const tiles = new Texture("res/images/ld41-tiles.png");

var tileIndexes = [
  { idx: 0, id: "empty", x: 0, y: 0, walkable: true },
  { idx: 1, id: "platform", x: 1, y: 0 },
  {
    idx: 2,
    id: "ladder_top",
    x: 2,
    y: 0,
    walkable: true,
    climbable: true,
    cloud: true
  },
  { idx: 3, id: "ladder", x: 3, y: 0, walkable: true, climbable: true },
  { idx: 4, id: "platform_ground", x: 1, y: 1 },
  { idx: 5, id: "ground", x: 1, y: 2 },
  { idx: 6, id: "bedrock", x: 1, y: 3 },
  { idx: 7, id: "platform_left", x: 0, y: 1 },
  { idx: 8, id: "platform_right", x: 2, y: 1 }
];

const _ = 0;

// prettier-ignore
const data = [
  5, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5,
  5, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5,
  5, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5,
  5, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5,
  4, 1, 1, 1, 1, 1, 1, 2, 8, _, 7, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 2, 1, 1, 1, 1, 2, 8, _, _, 7, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 4,
  5, _, _, _, _, _, _, 3, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _,  _, _, 3, _, _, _, _, 3, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, 3, _, 5,
  5, _, _, _, _, _, _, 3, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _,  _, _, 3, _, _, _, _, 3, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, 3, _, 5,
  5, _, _, _, _, _, _, 3, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _,  _, _, 3, _, _, _, _, 3, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, 3, _, 5,
  5, _, _, _, _, _, _, 3, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _,  _, _, 3, _, _, _, _, 3, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, 3, _, 5,
  4, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 8, _, _, 1, 1, 1, 1, 2, 1, 1,  1, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 8, _, _, 7, 2, 1, 1, 1, 1, 1, 4,
  5, _, 3, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, 3, _, _,  _, _, 5, 5, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, 3, _, _, _, _, _, 5,
  5, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, 3, _, _,  _, _, 5, 5, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, 3, _, _, _, _, _, 5,
  5, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, 3, _, _,  _, _, 5, 5, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, 3, _, _, _, _, _, 5,
  5, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, 3, _, _,  _, _, 5, 5, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, 3, _, _, _, _, _, 5,
  4, 1, 1, 1, 2, _, 7, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, _, _, 7, 1, 1, 2,  1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 8, _, _, _, 5,
  5, _, _, _, 3, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3,  _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5,
  5, _, _, _, 3, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3,  _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5,
  5, _, _, _, 3, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3,  _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5,
  5, _, _, _, 3, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3,  _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 5,
  4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 4,
  5, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, 3, _, 5,
  5, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, 3, _, 5,
  5, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, 3, _, 5,
  5, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, _, _, _, _, _, _, _, 3, _, 5,
  4, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, _, _, 7, 1, 1, 1,  1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, _, _, 2, 1, 1, 4,
  5, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, 5,
  5, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, 5,
  5, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, 5,
  5, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _,  _, _, 3, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 3, _, _, 5,
  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
];

class Level extends TileMap {
  constructor() {
    super(data.map(i => tileIndexes[i]), 50, 34, 32, 32, tiles);
  }
  getPlatformSpot() {
    const { mapW, mapH, tileW, tileH } = this;
    let found = false;
    let x;
    let y;
    while (!found) {
      x = math.rand(mapW - 1);
      y = math.rand(mapH - 1);
      const cell = this.tileAtMapPos({ x, y });
      if (cell && !cell.frame.walkable) {
        y -= 1;
        const cell2 = this.tileAtMapPos({ x, y });
        if (cell2 && cell2.frame.id === "empty") {
          found = true;
        }
      }
    }
    return { x: x * tileW, y: y * tileH };
  }
  // Gets closest free spot - might not always work if no paltform next ot ladder.
  getLadderExit(pos) {
    let { x, y } = this.pixelToMapPos(pos);
    for (let i = 0; i < 5; i++) {
      // Check up
      let cell = this.tileAtMapPos({ x, y: y - i });
      if (cell.frame.id === "platform" || cell.frame.id === "ladder_top") {
        // Found the top. Is above it free?
        const cell2 = this.tileAtMapPos({ x, y: y - i - 1 });
        if (cell2 && (cell2.frame.id === "empty" || cell2.frame.id === "ladder")) {
          return this.mapToPixelPos({ x, y: y - i - 1 });
        }
      }

      // Check down
      cell = this.tileAtMapPos({ x, y: y + i });
      if (cell.frame.id === "platform" || cell.frame.id === "platform_ground" || cell.frame.id === "ground") {
        // Found the top. Is above it free?
        const cell2 = this.tileAtMapPos({ x, y: y + i - 1 });
        if (cell2 && (cell2.frame.id === "empty" || cell2.frame.id === "ladder")) {
          return this.mapToPixelPos({ x, y: y + i - 1 });
        }
      }
    }
  }
}

export default Level;
