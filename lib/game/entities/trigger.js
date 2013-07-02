/*
This entity passes through all calls to triggeredBy() to its own targets
after a delay of n seconds.

E.g.: Set an EntityDelay as the target of an EntityTrigger and connect the
entities that should be triggered after the delay as targets to the
EntityDelay.


Keys for Weltmeister:

delay
	Delay in seconds after which the targets should be triggered.
	default: 1

target.1, target.2 ... target.n
	Names of the entities whose triggeredBy() method will be called after
	the delay.
*/

ig.module(
	'game.entities.trigger'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTrigger= ig.Entity.extend({
    size: {x: 32, y: 32},
    target: {},
    checkAgainst: ig.Entity.TYPE.BOTH,

    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

    check: function( other ) {
        // Iterate over all targets
        for( var t in this.target ) {
            var ent = ig.game.getEntityByName( this.target[t] );

            // Check if we got a "door" entity with the given name
            if( ent && ent instanceof EntityChangelevel ) {
                ent.changeLevel();
            }
        }
    }
});

});