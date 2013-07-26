ig.module(
	'game.entities.npcgen'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityNpcgen = ig.Entity.extend({

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,

	_wmScalable: false,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 150, 150, 0.7)',

	npcSpawned: false,

	size: {x:32,y:32},
	friction: { x:0, y:0 },

	init: function( x, y, settings ){
		this.parent(x,y,settings);
	},

	ready: function() {
		this.parent();
	},

	update: function() {
		if (!this.npcSpawned && Math.random() > .9) {
			ig.game.spawnEntity(EntitySpawnednpc, this.pos.x, this.pos.y, {owner: this, route: this.route});
			ig.game.sortEntitiesDeferred();
			this.npcSpawned = true;
		}

		this.parent();
	}

});

});
