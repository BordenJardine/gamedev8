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