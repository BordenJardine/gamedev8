/*
	HYPERSPACE BETH
*/
ig.module(
	'game.entities.sidequestdude2'
)
.requires(
	'impact.entity',
	'game.entities.specialnpc'
)
.defines(function(){

EntitySidequestdude2 = EntitySpecialnpc.extend({

	health: 9999,
	animSheet: new ig.AnimationSheet('media/npc.png', 32, 32),

	dialogKeys: {
		0: {
			dialog: 40,
			type: 'default'
		},
		1: {
			dialog: 41,
			type: 'itemCompletion',
			questItem: 'tinfoil',
			objective: 'OPTIONAL: Find and return the extra tinfoil to Mole Man Sam',
			reward: 'item',
      rewardItem: {name: 'tinfoilhat', image: 9, type: 'equippable'}
		}
	},


	init: function( x, y, settings ) {
		this.talkImage = 0;
		this.parent( x, y, settings );
	},

	ready: function() {
		this.showAlert = true;

		this.parent();
	}
});

});
