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
	'game.entities.changelevel'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityChangelevel = ig.Entity.extend({
    size: {x: 32, y: 32},
    target: {},
    level: {},

    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

    changeLevel: function() {
        ig.game.levelDirector.jumpTo( ig.global[this.level]);
    }
});

});