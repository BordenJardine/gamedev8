ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

    'game.entities.player',
    'game.levels.testlevel',
    'game.levels.AI',

    // Plug in for better control of level direction
    'plugins.director.director'
)
.defines(function(){

homeless = ig.Game.extend({

    // Overhead
    gravity: 0,

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),

	init: function() {
        // Bind keys
        ig.input.bind( ig.KEY.A, 'left' );
        ig.input.bind( ig.KEY.D, 'right' );
        ig.input.bind( ig.KEY.W, 'up' );
        ig.input.bind( ig.KEY.S, 'down' );
        // To enable mouse tracking
        ig.input.initMouse();

        // Level director in the global scope so we can use a separate entity to change levels
        // (see /entities/changelevel.js)
        // If there's a better way to do this we can change
       this.levelDirector = new ig.Director(this, [LevelTestlevel, LevelAI]);

        // Load the LevelTest as required above ('game.level.test')
        this.levelDirector.firstLevel();
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

        // screen follows the player
        var player = this.getEntitiesByType( EntityPlayer )[0];
        var rotate_to_x = ig.input.mouse.x + this.screen.x;
        var rotate_to_y = ig.input.mouse.y + this.screen.y;

        if( player ) {
            this.screen.x = player.pos.x - ig.system.width/2;
            this.screen.y = player.pos.y - ig.system.height/2;
            player.currentAnim.angle = Math.atan2((rotate_to_y-player.pos.y), (rotate_to_x-player.pos.x));
        }
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();


		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;

		this.font.draw( 'WASD + Mouse', 2, 2 );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', homeless, 60, 640, 480, 1 );

});
