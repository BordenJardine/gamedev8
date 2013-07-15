/*
	HYPERSPACE BETH
*/
ig.module(
	'game.entities.hb'
)
.requires(
	'impact.entity',
	'game.entities.specialnpc'
)
.defines(function(){

EntityHb = EntitySpecialnpc.extend({

	health: 9999,
	animSheet: new ig.AnimationSheet('media/hb.png', 32, 32),

	dialogKeys: {
		0: {
			dialog: 7,
			type: 'default'
		},
		1: {
			dialog: 8,
			type: 'flagCompletion',
			flag: 'cart',
			objective: 'Pick up the cart'
		},
		2: {
			dialog: 9,
			type: 'default',
			hasPopup: true,
			popup: 'Press action (E) while in a dumpster or trash can to scavenge for items'
		},
		3: {
			dialog: 10,
			type: 'itemCompletion',
			questItem: 'box',
			objective: 'Get a box in the city',
			setFlag: 'map'
		},
		4:{
			dialog: 11,
			type: 'itemCompletion',
			questItem: 'Orgone',
			objective: 'Get orgone crystals from soup kitchen'
		}
	},



	init: function( x, y, settings ) {
		this.talkImage = 3;
		this.parent( x, y, settings );
	},

	ready: function() {
		this.showAlert = true;

		this.parent();
	}
});

});
