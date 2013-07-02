ig.module(
	'game.entities.checkpoint'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCheckpoint = ig.Entity.extend({
    size: {x: 32, y: 32},
    target: {},
    checkAgainst: ig.Entity.TYPE.BOTH,
    name: '',

    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

    check: function( other ) {
        ig.game.state.currentCheckpoint = this;
    }
});

});