/*
	HYPERSPACE BETH
*/
ig.module(
	'game.entities.sidequestdude'
)
.requires(
	'impact.entity',
	'game.entities.specialnpc'
)
.defines(function(){

EntitySidequestdude = EntitySpecialnpc.extend({

	health: 9999,
	animSheet: new ig.AnimationSheet('media/npc.png', 32, 32),

	dialogKeys: {
		0: {
			dialog: 34,
			type: 'default'
		},
		1: {
			dialog: 35,
			type: 'itemCompletion',
			questItem: 'ccrock',
			objective: 'OPTIONAL: Retrieve Crazy Carl\'s rock from the shelter',
			reward: 2
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
