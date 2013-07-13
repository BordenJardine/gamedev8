/*

	Trigger Entity

	This entity triggers whatever it is 'targeting' in Weltmeister whenever
	ANYTHING collides with it (note: this may be the source of a bug; may want to
	change checkAgainst to ig.Entity.TYPE.A)

	Use by placing a Trigger in Weltmeister, then setting  (key, values) for keys of target.1, target.2, et al
	and values as the names of other entities placed on the map

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
	checkAgainst: ig.Entity.TYPE.A,
	type: undefined,

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',

	check: function( other ) {
		// Iterate over all targets
		for( var t in this.target ) {
			var ent = ig.game.getEntityByName( this.target[t] );

			// Check if we got a "door" entity with the given name
			if( ent && ent instanceof EntityChangelevel  && this.changingLevel != true) {
				ent.startLevelChange();
				this.changingLevel = true;
			}
		}
		if(other && other instanceof EntityPlayer) {
			if(this.popupTrigger !== undefined) ig.game.newPopup(this.popupTrigger);
		}
	}
});

});