import entity from "../utils/entity.js";

// Corner directions
const TL = 0;
const TR = 1;
const BL = 2;
const BR = 3;

function wallslideWithLadders(ent, map, x = 0, y = 0) {
  let tiles;
  let tileEdge;
  let walkable;
  let climbable;
  const bounds = entity.bounds(ent);

  // Final amounts of movement to allow
  let xo = x;
  let yo = 0;

  // Check vertical movement
  if (y) {
    tiles = map.tilesAtCorners(bounds, 0, y);
    walkable = tiles.map(t => t && t.frame.walkable);
    climbable = tiles.map(t => t && t.frame.climbable);

    ent.wasOnLadder = ent.onLadder;
    ent.onLadder =
      (climbable[TL] && climbable[TR]) ||
      (climbable[BL] && climbable[BR]);
    const feetInGround = !(walkable[BL] && walkable[BR]);
    const headInGround = !(walkable[TL] && walkable[TR]);
    if (feetInGround) {
      // snap up to ground
      tileEdge = tiles[BL].pos.y - 1;
      yo = tileEdge - (bounds.y + bounds.h);
      ent.onLadder = false;
    } else if (headInGround) {
      // snap down to below ground
      tileEdge = tiles[TL].pos.y + tiles[TL].h;
      yo = tileEdge - bounds.y;
    } else if (ent.onLadder) {
      yo = y;
    } else if (ent.wasOnLadder) {
      if (y < 0) {
        // trying to move up... snap to above ground
        tileEdge = tiles[BL].pos.y + tiles[BL].h - 1;
        yo = tileEdge - (bounds.y + bounds.h);
      }
    }
  }

  // Check horizontal movement
  if (x) {
    tiles = map.tilesAtCorners(bounds, xo, yo);
    walkable = tiles.map(t => t && t.frame.walkable);
    climbable = tiles.map(t => t && t.frame.climbable);
    let blocked;

    // Test left edge
    if (x < 0) {
      blocked = ent.onLadder
        ? !climbable[TL] && !climbable[BL]
        : !(walkable[TL] && walkable[BL]);
      if (blocked) {
        tileEdge = tiles[TL].pos.x + tiles[TL].w + 1;
        xo = tileEdge - bounds.x;
      }
    } else {
      // Test right edge
      blocked = ent.onLadder
        ? !climbable[TR] && !climbable[BR]
        : !(walkable[TR] && walkable[BR]);
      if (blocked) {
        tileEdge = tiles[TR].pos.x;
        xo = tileEdge - (bounds.x + bounds.w);
      }
    }

    const inTheAir = walkable.every(t => !!t);
    if (inTheAir) {
      // Check if we're standing on solid ground
      [tiles[BL], tiles[BR]].forEach(t => {
        const tile = map.pixelToMapPos(t.pos);
        const feet = map.tileAtMapPos({ x: tile.x, y: tile.y + 1 }).frame;
        if (feet.walkable && !feet.climbable) {
          // Would be falling!
          xo = 0;
        }
      });
    }
  }

  // xo & yo contain the amount we're allowed to move by.
  return { x: xo, y: yo };
}

export default wallslideWithLadders;
