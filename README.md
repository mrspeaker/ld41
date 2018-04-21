# LD41

two games overlaayed on each other.
minecraft in background, pitfall II in foreground


Foreground is pitfall 2 - explore caverns, avoid obstacles, get gold etc.

Background is mineraft zombie shooter. collect health/food/resources that you can use in the foreground game.

If you get near a zombie in minecraft, it emerges from the ground (like how skeletons appear in Ghost n Goblins).

Issue: platformer is moving left and right primarily. Minecraft is forward and backward. This encourages/requires player to be strafing a lot. Need to make this a feature of the background game...
  * make obvious "spawn areas" - if you go near them then things will spawn, but otherwise it's pretty safe to concentrate on the foreground game. If you are going to run into somethig bad then you'll have to mouse around and strafe accordingly.

Would be great if geographical/weather features appeared in both games at the same time.

Maybe: pickups in foreground that teleport you in background.

Hard parts:
  * too long to make/integrate animated 3d models. Need to figure out billboard sprites for background.
  * Making terrain that is lets player concetrate on foreground for long enough
  * proc-gen the foregraound map?


TODO:

  * port ladders example into game: file:///home/mrspeaker/Documents/book/gamedevbook/v1/ch05-09b-tilemap-ladders-cut/index-native.html
  * add gravity to ladders.
  * add camera/pan to Foreground
