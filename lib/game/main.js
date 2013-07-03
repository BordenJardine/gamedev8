ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
               'impact.debug.debug',

    'game.entities.player',
    'game.levels.testlevel',
    'game.levels.underworld1',
    'game.levels.AI',

    'game.classes.dialog',

    // Plug in for better control of level direction
    'plugins.director.director',
    // and scene management
    'plugins.scene_manager',
    // annd gui
    'plugins.gui'
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

        },

        update: function() {
            // Update all entities and backgroundMaps
            this.parent();

            if ( ig.input.pressed( 'mouse1' ) ) {
                this.sceneManager.pushScene( new IntroScreen() );
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

    /*
        To think about:
        Do we want to extend this to a cutscene class or just copy and paste this code
        for intro / ending / middle cutscene?
    */
    IntroScreen = Scene.extend ({
        introScreenImages: ['media/intro1.png', 'media/intro2.png'],
        init: function() {
            var self = this;
            this.cutsceneImages = [];
            this.cutsceneDraw = [];
            this.numCutsceneImages = this.introScreenImages.length;
            this.cutsceneImagesIdx = 0;
            this.sceneLength = 2;
            for (var i = 0; i < this.numCutsceneImages; i++) {
                this.cutsceneImages.push(new ig.Image(self.introScreenImages[i]));
                this.cutsceneDraw.push(false);
            }

            this.introChain = EventChain(this)
                .wait(.1)
                .then(function() {
                    self.cutsceneDraw[self.cutsceneImagesIdx] = true;
                })
                .wait(self.sceneLength)
                .then(function() {
                    self.cutsceneDraw[self.cutsceneImagesIdx] = false;
                    self.cutsceneImagesIdx += 1;
                    if(self.cutsceneImagesIdx === self.numCutsceneImages) {
                        self.sceneManager.pushScene( new homeless() );
                    }
                })
                .repeat(self.numCutsceneImages);
        },

        update: function() {
            this.parent();
            this.introChain();
        },

        draw: function() {
            this.parent()
            for(var j = 0; j < this.numCutsceneImages; j++) {
                if(this.cutsceneDraw[j] === true) {
                    this.cutsceneImages[j].draw(0, 0);
                }
            }
        }
    });

    homeless = Scene.extend({

        // Overhead
        gravity: 0,

    	// Load a font
    	font: new ig.Font( 'media/04b03.font.png' ),

        // need to create a dialog box png

        dialog: {
            image: new ig.Image('media/gui_dialog.png'),
            pages: [],
            fillPages: new DialogGenerator()
        },
        inventory: {
            image: new ig.Image('media/gui_inventory.png'),
            pos: {x:0, y:0},
            open: false
        },

    	init: function() {
            var self = this;
            // Bind keys
            ig.input.bind( ig.KEY.A, 'left' );
            ig.input.bind( ig.KEY.D, 'right' );
            ig.input.bind( ig.KEY.W, 'up' );
            ig.input.bind( ig.KEY.S, 'down' );
            ig.input.bind( ig.KEY.SPACE, 'action' );
            // To enable mouse tracking
            ig.input.initMouse();

            /*
            Object that will contain all 'stateful things' that we want to stay the same through
            level changes (i.e. inventory, equipped items, current level, etc)
            Reference with ig.game.state.whatever
            */
            this.state = {
                health: 10,
                inventory: [],
                currentCheckpoint: undefined,
                levelChanged: false,
                equipped: []
            };

            // Set up inventory button and screen
            ig.gui.element.add({
                name: 'InventoryOpen',
                title: 'Inventory',
                group: 'inv',
                icon: new ig.Image('media/icon.png'),
                size: { x: 32, y: 32 },
                pos: { x: (ig.system.width -42), y:  (ig.system.height-42)},
                disabled: false,
                alpha: 0.7,
                toggle: false,
                active: true,
                state: {
                    normal: {
                        image: new ig.Image('media/buttons.png'),
                        tile: 0,
                        tileSize: 32
                    },
                    hover: {
                        image: new ig.Image('media/buttons.png'),
                        tile: 1,
                        tileSize: 32
                    },
                    active: {
                        image: new ig.Image('media/buttons.png'),
                        tile: 2,
                        tileSize: 32
                    }
                },
                click: function() {
                    self.inventory.open = !self.inventory.open;
                }
            });

            // Set up dialog position

            this.dialog.pos = {
                x: (ig.system.width / 2) - (this.dialog.image.width / 2),
                y: ig.system.height - this.dialog.image.height - 10
            };
            this.inventory.pos = {
                x: (ig.system.width / 2) - (this.inventory.image.width / 2),
                y: (ig.system.height / 2) - (this.inventory.image.height /2)
            };

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
                            if(ig.gui.show) ig.gui.draw();

            // Draw dialog if there's any to draw
            if(this.dialog.pages.length != 0) {
                this.dialog.pos = {
                    x: (ig.system.width / 2) - (this.dialog.image.width / 2),
                    y: ig.system.height - this.dialog.image.height - 10
                }
                this.dialog.image.draw(this.dialog.pos.x, this.dialog.pos.y);
                var wrapper = new WordWrap(ig.game.dialog.pages[0], 125);
                this.font.draw(wrapper.wrap(), this.dialog.pos.x + 8, ig.system.height - this.dialog.image.height + 8, ig.Font.ALIGN.LEFT);
            }
            if(this.inventory.open) {
                this.inventory.pos = {
                    x: (ig.system.width / 2) - (this.inventory.image.width / 2),
                    y: (ig.system.height / 2) - (this.inventory.image.height /2)
                };
                this.inventory.image.draw(this.inventory.pos.x, this.inventory.pos.y);
                var invenCount = 0
                for(var inv = 0; inv < this.state.inventory.length; inv++) {
                    var item = this.state.inventory[inv];
                    // TODO - fix magic numbers here maybe
                    this.font.draw(item.name, this.inventory.pos.x + 8, this.inventory.pos.y + 40 + (inv*8), ig.Font.ALIGN.LEFT);
                }
            }


    		var x = ig.system.width/2,
    			y = ig.system.height/2;

    		this.font.draw( 'WASD + Mouse', 2, 2 );
    	}
    });


    // Start the Game with 60fps, a resolution of 640x480, scaled
    // up by a factor of 1
    ig.main('#canvas', ParentScreen, 60, 640, 480, 1);

});
