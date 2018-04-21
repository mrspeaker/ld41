# LD41

two games overlaayed on each other.
minecraft in background, pitfall II in foreground

Foreground is pitfall 2 - explore caverns, avoid obstacles, get gold etc.

Foreground is the "below ground caverns": climb your way up to the top to get to your 3d self and merge.

Background is mineraft zombie (shooter?). collect health/food/resources that you can use in the foreground game.

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

TODO:
  * Move level to Tiled (don't think theres time for proc gen?)
  * Pick palletes for fore vs background. weird because caverns should be dark, but i need them to be light
  * quick refactor of my frankenstein prototype
  * Add win screen/restart when get to top of ladders.
  * add gravity to ladders:
    * but stop at edges.
  * billboard sprites in back.
