# LD41

*NOTE: very important!* The code you find here is more zombified than the walking dead. It was mashed together extremely quickly and will little regard for the find history of the art of computer science. I'm sorry.  

## Notes

two games overlaayed on each other.
minecraft in background, pitfall II in foreground

Foreground is pitfall 2 - explore caverns, avoid obstacles, get gold etc, find the magic thingo that kills all the zombies above. Find the thingo, climb your way up to the top to get to your 3d self and merge.

Background is mineraft zombie (shooter?). collect health/food/resources that you can use in the foreground game. You can't stand still too long in the 3d world, baddies gather (stops you from just wedging yourself).

If you get near a zombie in minecraft, it emerges from the ground (like how skeletons appear in Ghost n Goblins).

Issue: platformer is moving left and right primarily. Minecraft is forward and backward. This encourages/requires player to be strafing a lot. Need to make this a feature of the background game...
  * make obvious "spawn areas" - if you go near them then things will spawn, but otherwise it's pretty safe to concentrate on the foreground game. If you are going to run into somethig bad then you'll have to mouse around and strafe accordingly.
  * foreground should lock to edge if walking off - fall down holes though.
  * backgroudn shouldn't "auto fall" on edges, else it will be annoying.
  * Going up === going forward, so should be the norm. Going down == going backwards so is dangerous and ahrd in minecraft

Maybes:
  * pickups in foreground that teleport you in background.
  * geographical (and/or weather) features appeared in both games at the same time.

Hard parts:
  * too long to make/integrate animated 3d models. Need to figure out billboard sprites for background.
  * Making terrain that is lets player concetrate on foreground for long enough
  * proc-gen the foregraound map?

## TODO

### Super high
  * Do end screen
  * what to do when 2d spawn on ladder?
  * 2D collision hits: gameover.
  * Fix edges of world: hard stop, or make bigger, or whateves.

### Pretty High  
  * health pickups from
  * ghosties walk up blocks.
  * "danger" warning when 3d baddie near (maybe sound - zmob)
  * screen flash when new baddie

### High
  * Move level to Tiled if there's time
  * Theme song: GnG rip
  * Rotoscope more ghosts
  * intro - teach... pretty important cause this is HARD
  * pickup in 3d gives temporary zombie smasher shield in 2d.

### Low
  * Seriously fix some gfx.
  * HOly crap refactor this garbage.
