
ig.module(
	'game.classes.menu'
)
.requires(
	'impact.game'
)
.defines(function(){

Menu = ig.Class.extend({

	menuImageOpen: false,
	menuInventoryGUI: [],


	init: function(items) {
		this.items =  items;
		this.name = Math.random().toString(36).substr(2, 5)
		this.setupItems();
	},

	toggle: function() {
		this.menuImageOpen = !this.menuImageOpen;
		if(this.menuImageOpen) {
			ig.game.unbindKeys();
			ig.game.menuImage.open = true;
			ig.game.inventoryHUD.open = true;
		}
		else {
			ig.game.bindKeys();
			ig.gui.element.action('hideGroup', this.name+'menuItems');
			ig.gui.element.action('disableGroup', this.name+'menuItems')
			ig.game.menuImage.open = false;
			ig.game.inventoryHUD.open = false;
		}
	},

	setupItems: function() {
		for(var i = 0; i < this.items.length; i++) {
			this.addMenuGUIButton(this.items[i]);
		}
	},

	arrangeGUI: function() {
		var columns = Math.ceil((this.menuInventoryGUI.length)/5);

		for(var col = 0; col < columns; col+=1) {
			for(var row = 0; row < 5; row++) {
				item = this.menuInventoryGUI[col * 5 + row];
				if(!item) break;
				item.pos = {
					x: ig.game.menuImage.pos.x + 6 + (col*32),
					y: ig.game.menuImage.pos.y + 34 + (row*32)};
				ig.gui.element.action('enableGroup', this.name+'menuItems');
				ig.gui.element.action('showGroup', this.name+'menuItems');
			}
		}
	},

	itemClicked: function(item) {
		if(item.price <= ig.game.state.money) this.buyItem(item);
		else ig.game.newPopup('Insufficent moolah');
	},

	buyItem: function(item) {
		ig.game.inventory.addToInventory(item);
		this.removeItem(item);
		ig.game.state.money -= item.price;
	},

	removeItem: function(item) {
		var itemGUI = ig.gui.element.action('getByName', this.name+item.name);
		var guiIdx =  this.menuInventoryGUI.indexOf(ig.gui.element.action('getByName', this.name+item.name));

		if(item.quantity > 1) {
			item.quantity--;
			itemGUI.title = (parseInt(itemGUI.title) - 1).toString();
		} else  {
			ig.game.menuInventoryGUI.splice(guiIdx, 1);
			ig.gui.element.action('remove', this.name+item.name);
		}

	},

	addMenuGUIButton: function(item) {
		var self = this;

		ig.gui.element.add({
			name: self.name+item.name,
			title: (item.quantity != undefined) ? item.quantity.toString() : '1',
			showTitle: true,
			font: ig.game.fontsmall,
			group: self.name+'menuItems',
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
				self.itemClicked(item);
			}
		});

		this.menuInventoryGUI.push(ig.gui.element.action('getByName', this.name+item.name));
		ig.gui.element.action('hideGroup', this.name+'menuItems');
		ig.gui.element.action('disableGroup', this.name+'menuItems');
	},

	display: function() {
		if(this.menuImageOpen) {
			this.arrangeGUI();
			ig.gui.element.action('showGroup', this.name+'menuItems');
			ig.gui.element.action('enableGroup', this.name+'menuItems');
		}
	}

});

});
