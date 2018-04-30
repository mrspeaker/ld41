# Obaké: a Ludum Dare 41 entry by Mr Speaker

[Play Obaké right now!](https://mrspeaker.github.io/ld41/) or see the [Ludum Dare entry page](https://ldjam.com/events/ludum-dare/41/obake).

[![obake in action](https://user-images.githubusercontent.com/129330/39125294-7d5b500c-46cc-11e8-9aed-2522e8797ea8.gif)](https://mrspeaker.github.io/ld41/)

Through no fault of your own, the spirits have risen. Well, not risen - but inflated - into the third dimension. They are not happy and will seek to drag you forever into their flat lands.

**Defend** yourself with your De-mension Gun (tm). If an obaké should touch you - it’s fine, don’t worry about it. BUT. It will materialize in the 2nd dimension: the only place it can destroy you.

Yes, 2D is dangerous: but it’s your only real hope. **Collect** enough co-planar totems from the second dimension to force the hapless obaké back to their home forever.

## Controls

Fighting cross-dimensional phantoms is no walk in the park, so why should the controls be easy?

In the **2nd Dimension**: W A S D will move you around the ladder-infested crypt.

In the **3rd Dimension**: W A S D will move you, mouse will look and shoot, and space to jump (or SMC: Standard Minecraft Controls)

[![obake2](https://user-images.githubusercontent.com/129330/39103902-9942d502-467b-11e8-8a9a-e911641d4c31.png)](https://mrspeaker.github.io/ld41/)

## Notes to self

here were my in-progress notes during the game... ignore them! *ALSO NOTE: very important!* The code you find here is more zombified than the walking dead. It was mashed together extremely quickly and will little regard for the find history of the art of computer science. I'm sorry.  

two games overlaayed on each other.
minecraft in background, pitfall II in foreground

Foreground is pitfall 2 - explore caverns, avoid obstacles, get gold etc, find the magic thingo that kills all the zombies above. Find the thingo, climb your way up to the top to get to your 3d self and merge.

Background is mineraft zombie (shooter?). collect health/food/resources that you can use in the foreground game. You can't stand still too long in the 3d world, baddies gather (stops you from just wedging yourself).

If you get near a zombie in minecraft, it emerges from the ground (like how skeletons appear in Ghost n Goblins).

Issue: platformer is moving left and right primarily. Minecraft is forward and backward. This encourages/requires player to be strafing a lot. Need to make this a feature of the background game...
  * make obvious "spawn areas" - if you go near them then things will spawn, but otherwise it's pretty safe to concentrate on the foreground game. If you are going to run into somethig bad then you'll have to mouse around and strafe accordingly.
  * foreground should lock to edge if walking off - fall down holes though.
  * background shouldn't "auto fall" on edges, else it will be annoying.
  * Going up === going forward, so should be the norm. Going down == going backwards so is dangerous and hard in minecraft

Maybes:
  * pickups in foreground that teleport you in background.
  * geographical (and/or weather) features appeared in both games at the same time.

Hard parts:
  * too long to make/integrate animated 3d models. Need to figure out billboard sprites for background.
  * Making terrain that is lets player concetrate on foreground for long enough
  * proc-gen the foregraound map?

## TODO

### Super high
  * Do gameover
  * can't go out edges in 2d, can't go on straight ladders.

### Pretty High  
  * intro - teach... pretty important cause this is HARD
  * some kind of fix for sitting on a ladder?

### High
  * make spawn tweaker: balance
  * Theme song: GnG rip
  * pickup in 3d gives temporary zombie smasher shield in 2d.

### Low
  * Add graveyard effects.
  * Seriously fix some cavern gfx.
  * HOly crap refactor this garbage.
  * theres some gnarly ladder climb bugs - breaks if ladderTop has no neihbor on one side, also, see player.update: hard limit on right side of screen!
