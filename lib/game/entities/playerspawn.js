/*

    Playerspawn

    This entity  spawns a player after the level has loaded
     MUST be placed in all levels -- do not place player entity through the level editor

    This allows us to set checkpoints to respawn a player when they die
    It also allows us to spawn a player at the correct 'entrace' / 'exit' to areas

*/
ig.module(
	'game.entities.playerspawn'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayerspawn= ig.Entity.extend({
    size: {x: 32, y: 32},
    target: {},
    checkAgainst: ig.Entity.TYPE.BOTH,
    checkpt: undefined,

    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

    // Once everything is loaded in the level, we check the players current checkpoint
    // If its undefinied (first load), it sets the checkpoint as itself
    // It then spawns the player on the x and y of the current checkpoint
    ready: function() {
        if(ig.game.state.currentCheckpoint === undefined) {
            this.checkpt = this;
        } else {
            this.checkpt = ig.game.getEntityByName(ig.game.state.currentCheckpoint);
        }

        ig.game.spawnEntity(EntityPlayer, this.checkpt.pos.x, this.checkpt.pos.y, {flip:1});
    }
});

});