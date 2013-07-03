ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

    'game.entities.player',
    'game.levels.testlevel',
    'game.levels.underworld1',
    'game.levels.AI',

    // Plug in for better control of level direction
    'plugins.director.director',
    'plugins.scene_manager'
)
.defines(function(){

    ParentScreen = ig.Game.extend({
        sceneManager: new SceneManager(),

        init: function() {
            // Push the menu scene on to the stack
            this.sceneManager.pushScene( new MenuScene() );
        },

        update: function() {
            // Update the current scene
            this.sceneManager.updateScene();
        },

        draw: function() {
            // Draw the current scene
            this.sceneManager.drawScene();
        }
    });

    MenuScene = Scene.extend({
        init: function( title ) {
            this.parent( 'Menu Scene' );

            this.clearColor = '#126';

            ig.input.bind( ig.KEY.MOUSE1, 'mouseClick' );
        },

        update: function() {
            // Update all entities and backgroundMaps
            this.parent();

            if ( ig.input.pressed( 'mouseClick' ) ) {
                this.sceneManager.pushScene( new homeless() );
            }
        },

        draw: function() {
            // Draw all entities and backgroundMaps
            this.parent();

            // Save the current context
            ig.system.context.save();

            // Set some properties on the context
            ig.system.context.fillStyle = 'white';
            ig.system.context.textAlign = 'center';

            // Menu Text
            ig.system.context.font = 'bold 36px sans-serif';
            ig.system.context.fillText( 'Main Menu', this.center.x, this.center.y - 40);
            ig.system.context.fillText( 'Click this screen to continue', this.center.x, this.center.y + 40);

            // Restore the previous context
            ig.system.context.restore();
        }
    });

    homeless = Scene.extend({

        // Overhead
        gravity: 0,

    	// Load a font
    	font: new ig.Font( 'media/04b03.font.png' ),

        // need to create a dialog box png
        /*
        dialog: {
            image: new ig.Image('media/gui_dialog.png'), // Your image for dialog box
            pages: []
        },
        */

    	init: function() {
            // Bind keys
            ig.input.bind( ig.KEY.A, 'left' );
            ig.input.bind( ig.KEY.D, 'right' );
            ig.input.bind( ig.KEY.W, 'up' );
            ig.input.bind( ig.KEY.S, 'down' );
            // To enable mouse tracking
            ig.input.initMouse();

            /*
            Object that will contain all 'stateful things' that we want to stay the same through
            level changes (i.e. inventory, equipped items, current level, etc)
            Reference with ig.game.state.whatever
            */
            this.state = {
                health: 10,
                inventory: {},
                currentCheckpoint: undefined,
                levelChanged: false,
                equipped: {}
            };

            // Set up dialog position
            /*
            this.dialog.pos = {
                x: (ig.system.width / 2) - (this.dialog.image.width / 2),
                y: ig.system.height - this.dialog.image.height
            };
            */

            this.levelDirector = new ig.Director(this, [LevelTestlevel, LevelAI, LevelUnderworld1]);
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

            // Draw dialog if there's any to draw
            /*
            if(this.dialog.pages.length != 0) {
                this.dialog.pos = {
                    x: (ig.system.width / 2) - (this.dialog.image.width / 2),
                    y: ig.system.height - this.dialog.image.height
                }
                this.dialog.image.draw(this.dialog.pos.x, this.dialog.pos.y);
                var wrapper = new WordWrap(ig.game.dialog.pages[0], 25);
                this.font.draw(wrapper.wrap(), this.dialog.pos.x + 8, ig.system.height - this.dialog.image.height + 8, ig.Font.ALIGN.LEFT);
            }
            */

    		var x = ig.system.width/2,
    			y = ig.system.height/2;

    		this.font.draw( 'WASD + Mouse', 2, 2 );
    	}
    });


    // Start the Game with 60fps, a resolution of 640x480, scaled
    // up by a factor of 1
    ig.main('#canvas', ParentScreen, 60, 640, 480, 1);

});
