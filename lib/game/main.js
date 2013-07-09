ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'impact.debug.debug',

	'game.entities.player',
	'game.entities.waypoint',
	'game.levels.testlevel',
	'game.levels.uberwelt',
	'game.levels.underworld1',
	'game.levels.tutorial',
	'game.levels.soupkitchen',
	'game.levels.AI',

	// Plug in for better control of level direction
	'plugins.director.director',
	'plugins.scene_manager',

	'plugins.astar-for-entities',

	'game.classes.dialog',

	// Plug in for better control of level direction
	'plugins.director.director',
	// and scene management
	'plugins.scene_manager',
	// annd gui
	'plugins.gui',
	// for drag 'n drop / crafting
	'plugins.game_utilities',
	'plugins.entity_utilities'
)
.defines(function(){

	ig.global.TO_RADS = 180/Math.PI,
	ig.global.NPC_SCRIPT = [
		'waitForItem',
		'moveToLocation'
	],

	ig.global.ITEM_USES = {
		box: {
			use: function(player) {
				if(!player.inBox) {
					player.inBox = true;
					player.maxVel = {x:ig.game.state.equipped.itemStrength*2,y:ig.game.state.equipped.itemStrength*2};
					player.currentAnim = player.anims.boxHide;
				} else {
					player.inBox = false;
					player.maxVel = player.baseMaxVel;
					player.currentAnim = player.anims.boxAway;
				}
			}
		},
		gun: {
			use: function(player) {
				var rotated_angle = player.currentAnim.angle;
				x_to_spawn = player.pos.x + (player.size.x/2);
				y_to_spawn = player.pos.y + (player.size.y/2);
				ig.game.spawnEntity(EntityBullet, x_to_spawn, y_to_spawn,{angle:rotated_angle});
			}
		}
	},

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

			this.clearColor = '#000';

		},

		update: function() {
			// Update all entities and backgroundMaps
			this.parent();

			if ( ig.input.pressed( 'mouse1' ) ) {
				// BY PASS INTRO SCENE (TO RESTORE, CHANGE THIS TO new IntroScreen())
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

	/*
		To think about:
		Do we want to extend this to a cutscene class or just copy and paste this code
		for intro / ending / middle cutscene?
	*/
	IntroScreen = Scene.extend ({
		introScreenImages: ['media/intro1.png', 'media/intro2.png'],
		init: function() {
			var self = this;

			/*
				this may seem complicated, but to extend or change anything, all you have to touch is the
				introScreenImages array above. the rest is handled automagically
			*/

			this.cutsceneImages = [];   // array that will contain all of the loaded images for the cutscene
			this.cutsceneDraw = []; // array that will hold true or false values for each loaded image
			this.numCutsceneImages = this.introScreenImages.length; // number of cutscene images
			this.cutsceneImagesIdx = 0; // current cutscene image index
			this.sceneLength = 2; // number of seconds to remain on each scene

			// loop through each image
			// load it, then  add false to the 'draw' array in its corresponding location
			for (var i = 0; i < this.numCutsceneImages; i++) {
				this.cutsceneImages.push(new ig.Image(self.introScreenImages[i]));
				this.cutsceneDraw.push(false);
			}

			// set up the EventChain; basically draw the image, wait X seconds, remove that scene and draw a new one
			// note that we're only setting booleans here, the actual drawing happens in the draw function
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
			// update the chain every frame
			this.introChain();
		},

		draw: function() {
			this.parent()

			// iterates through the array and draws whichever images corresponding boolean is set to true
			for(var j = 0; j < this.numCutsceneImages; j++) {
				if(this.cutsceneDraw[j] === true) {
					this.cutsceneImages[j].draw(0, 0);
				}
			}
		}
	});

	/*
		MAIN GAME SCENE

		Globals:
			- ig.game.state
			- ig.game.dialog
			- ig.game.inventory

	*/

homeless = Scene.extend({

	gravity: 0,

	font: new ig.Font( 'media/helv.font.png' ),

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
	hud: {
		image: new ig.Image('media/gui_hud.png'),
		hpimg: new ig.Image('media/gui_hpbar.png'),
		pos: {x:5, y:5}
	},
	map: {
		image: new ig.Image('media/map.png'),
		pos: {x: 0, y: 0},
		open: false
	},

	counter: 0,

	equipFrame: new ig.Image('media/gui_equipframe.png'),
	invImages: new ig.Image('media/invitems.png'),
	itemImages: new ig.AnimationSheet('media/items.png', 16, 16),
	dialogImages: new ig.Image('media/portraits.png'),
	buttonImages: new ig.Image('media/gui_buttons.png'),

	talker: undefined,

	init: function() {
		var self = this;

		this.setupMusic();
		this.bindKeys();
		this.setupGUI();

		/*
		Object that will contain all 'stateful things' that we want to stay the same through
		level changes (i.e. inventory, equipped items, current level, etc)

		This section will be helpful for saving. Write this.state to localStorage and presto
		Reference with ig.game.state.whatever
		*/
		this.state = {
			health: 10,
			inventory: [],
			inventoryGUI: [],
			currentCheckpoint: undefined,
			equipped: undefined,
			map: false,
			objectives: []
		};
		this.npcState = [];
		this.questNpcState = [];
		this.itemState = [];

		/*
			Set up the levelDirector
			Every level has to go in the array contained here
			This lets us jump to any level -- very useful for the overworld / underworld stuff
		*/
		this.levelDirector = new ig.Director(this, [LevelTestlevel, LevelSoupkitchen, LevelAI, LevelUnderworld1, LevelTutorial, LevelUberwelt]);
		this.levelDirector.firstLevel();
	},

	unbindKeys: function() {
		ig.input.unbind( ig.KEY.A, 'left' );
		ig.input.unbind( ig.KEY.D, 'right' );
		ig.input.unbind( ig.KEY.W, 'up' );
		ig.input.unbind( ig.KEY.S, 'down' );
		ig.input.unbind( ig.KEY.SPACE, 'use');
		ig.input.unbind( ig.KEY.I, 'inventory');
		ig.input.unbind( ig.KEY.M, 'map');
	},

	bindKeys: function() {
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.SPACE, 'use' );
		ig.input.bind( ig.KEY.E, 'action');
		ig.input.bind( ig.KEY.I, 'inventory');
		ig.input.bind( ig.KEY.M, 'map');
		ig.input.initMouse();
	},

	setupGUI: function() {
		var self = this;

		ig.gui.element.add({
			name: 'InventoryOpen',
			title: 'Inventory',
			group: 'inv',
			size: { x: 32, y: 32 },
			pos: { x: (ig.system.width -42), y:  (ig.system.height-42)},
			disabled: false,
			alpha: 0.7,
			toggle: false,
			active: true,
			state: {
				normal: {
					image: ig.game.buttonImages,
					tile: 0,
					tileSize: 32
				},
				hover: {
					image: ig.game.buttonImages,
					tile: 1,
					tileSize: 32
				},
				active: {
					image: ig.game.buttonImages,
					tile: 2,
					tileSize: 32
				}
			},
			click: function() {
				self.inventory.open = !self.inventory.open;
				if(!self.inventory.open){
					ig.gui.element.action('hideGroup', 'invItems');
					ig.gui.element.action('disableGroup', 'invItems');
				}
			}
		});

		// Set up dialog and inventory (GUI, basically) positions
		this.dialog.pos = {
			x: (ig.system.width / 2) - (this.dialog.image.width / 2),
			y: ig.system.height - this.dialog.image.height - 10
		};
		this.inventory.pos = {
			x: (ig.system.width / 2) - (this.inventory.image.width / 2),
			y: (ig.system.height / 2) - (this.inventory.image.height /2)
		};
		this.map.pos = {
			x: (ig.system.width / 2) - (this.map.image.width / 2),
			y:(ig.system.height / 2) - (this.map.image.height /2)
		}
	},

	setupMusic: function() {
		ig.music.add('media/music/chill.ogg', 'LevelTestlevel');
		ig.music.add('media/music/mw0h.ogg', 'LevelAI');
		ig.music.volume = 0.0;
		ig.music.loop = true;
		ig.music.play('LevelTestlevel');
	},

	addInventoryGUIButton: function(item) {
		ig.gui.element.add({
			name: item.name,
			title: item.name,
			group: 'invItems',
			size: { x: 32, y: 32 },
			pos: {x:0, y:0},
			disabled: false,
			state: {
				normal: {
					image: ig.game.invImages,
					tile: item.image,
					tileSize: 32
				},
			},
			click: function() {
				var inven = ig.game.state.inventory;
				for(var i = 0; i < inven.length; i++) {
					if (inven[i].name == this.name) {
						ig.game.state.equipped = inven[i];
					}
				}

				// Hide everything when something was clicked
				// or equipped
				ig.gui.element.action('disableGroup', 'invItems');
				ig.gui.element.action('hideGroup', 'invItems');
				ig.game.inventory.open = false;
			}
		});
		ig.game.state.inventoryGUI.push(ig.gui.element.action('getByName', item.name));
		ig.gui.element.action('hideGroup', 'invItems');
		ig.gui.element.action('disableGroup', 'invItems');
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		//  Get the player entity
		var player = this.getEntitiesByType( EntityPlayer )[0];

		// have the screen following the player, and rotate the players sprite to whereever the mouse is
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}

		this.checkKeys();
	},


	checkKeys: function(){
		var inv = ig.game.inventory.open;
		var map = ig.game.map.open;

		if(ig.input.pressed('inventory')) ig.game.inventory.open = !inv;
		if(!inv) {
			ig.gui.element.action('disableGroup', 'invItems');
			ig.gui.element.action('hideGroup', 'invItems');
		}
		if(ig.input.pressed('map')) ig.game.map.open = !map;
	},

	newObjective: function(objective) {
		if(this.state.objectives.indexOf(objective) > -1) return;
		this.state.objectives.push(objective);
	},

	completedObjective: function(objective) {
		var splice = this.state.objectives.indexOf(objective);
		this.state.objectives.splice(splice, 1);
	},

	drawGUI: function() {
		// Draw dialog if there's any to draw
		if(this.dialog.pages.length != 0) {
			if(this.counter != this.wrapLength) {
				this.counter++;
			}

			this.dialog.pos = {
				x: (ig.system.width / 2) - (this.dialog.image.width / 2),
				y: this.dialog.image.height
			}
			this.dialog.image.draw(this.dialog.pos.x, this.dialog.pos.y);
			this.dialogImages.drawTile(this.dialog.pos.x+this.dialog.image.width-97, this.dialog.pos.y+1, this.talker, 98);

			var wrapper = new WordWrap(ig.game.dialog.pages[0], 45);
			var wrapLength = wrapper.wrap().length;
			this.font.draw(wrapper.wrap().slice(0, this.counter), this.dialog.pos.x + 8, this.dialog.pos.y + 8, ig.Font.ALIGN.LEFT);
		}

		// Draw the inventory if its open
		if(this.inventory.open) {
			this.inventory.pos = {
				x: (ig.system.width / 2) - (this.inventory.image.width / 2),
				y: (ig.system.height / 2) - (this.inventory.image.height /2)
			};
			this.inventory.image.draw(this.inventory.pos.x, this.inventory.pos.y);

			// Iterate through the inventory and draw every item
			var invenCount = 0
			for(var inv = 0; inv < this.state.inventoryGUI.length; inv++) {
				var item = this.state.inventoryGUI[inv];
				// TODO - fix magic numbers here maybe
				item.pos = {x: this.inventory.pos.x+ 6, y: this.inventory.pos.y  + 34 + (inv*32)};
				ig.gui.element.action('enableGroup', 'invItems');
				ig.gui.element.action('showGroup', 'invItems');
			}
		}

		if(ig.gui.show) ig.gui.draw();

		this.hud.image.draw(this.hud.pos.x, this.hud.pos.y);
		for(var hp = 0; hp < this.state.health; hp++) {
			this.hud.hpimg.draw(this.hud.pos.x + 5 + (hp*this.hud.hpimg.width), (this.hud.pos.y + 13));
		}
		this.equipFrame.draw(ig.system.width - 84, ig.system.height - 42);

		if(this.state.equipped){
			this.invImages.drawTile(ig.system.width - 84, ig.system.height-42, this.state.equipped.image, 32);
		}

		if(this.map.open && this.state.map) {
			this.map.image.draw(this.map.pos.x, this.map.pos.y)
		}

		this.drawObjectives();
	},

	drawObjectives: function() {
		if(this.state.objectives.length > 0) {
			this.font.draw('Current Objectives:', this.hud.pos.x, this.hud.pos.y+30, ig.Font.ALIGN.LEFT);
			for(var i = 0; i < this.state.objectives.length; i++) {
				this.font.draw(this.state.objectives[i], this.hud.pos.x, this.hud.pos.y+30+(14*(i+1)), ig.Font.ALIGN.LEFT);
			}
		}
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		this.drawGUI();
	}

});

// Start the Game with 60fps, a resolution of 1024x768, scaled
// up by a factor of 1
ig.main('#canvas', ParentScreen, 60, 1024, 768, 1);

});
