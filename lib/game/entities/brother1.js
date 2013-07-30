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
			type: 'othersItemCompletion',
			questItem: 'Orgone'
		},
		1: {
			dialog: 14,
			type: 'flagCompletion',
			flag: 'rescue',
			objective: 'Get metro pass, find hideout, and rescue the brother'
		},
        2: {
            dialog: 15,
            type: 'flagCompletion',
            flag: 'rescuehb',
            setFlag: 'brown',
            objective: 'Infiltrate NSA and rescue Hyperspace Beth'
        }
	},


	init: function( x, y, settings ) {
		this.talkImage = 0;
		this.parent( x, y, settings );
	},

	ready: function() {
		this.showAlert = true;
		if(ig.game.state.flags.indexOf("soupComplete") < 0) this.kill();

		this.parent();
	}
});

});
