ig.module(
	'game.entities.brother1'
)
.requires(
	'impact.entity',
	'game.entities.specialnpc'
)
.defines(function(){

EntityBrother1 = EntitySpecialnpc.extend({

	health: 9999,
	animSheet: new ig.AnimationSheet('media/npc.png', 32, 32),

	dialogKeys: {
		0: {
			dialog: 13,
			type: 'default'
		},
		1: {
			dialog: 14,
			type: 'flagCompletion',
			flag: 'rescue',
			objective: 'Get metro pass, find hideout, and rescue the brother'
		}
	},


	init: function( x, y, settings ) {
		this.talkImage = 0;
		this.parent( x, y, settings );
	},

	ready: function() {
		this.showAlert = true;
		if(!ig.game.state.flags.indexOf("soupComplete") > -1) this.kill();

		this.parent();
	}
});

});
