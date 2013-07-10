/*
	Dialog generator class

	This class simply holds all of the dialog scenes in an object,
	and returns them to the dialog GUI update in main.js when the
	NPC with the corresponding dialogKey is activated

*/
ig.module(
	'game.classes.dialog'
)
.requires(
	'impact.game',
	'impact.font'
)
.defines(function(){

	 DialogGenerator = ig.Class.extend({

		/* global place to store dialog - could store separately in
			a text file, but FileReader() might not be supported in all browsers
			that Impact supports...not sure
		*/
		dialog: {
			1: ['this is my dialog', 'it is a test', 'i have 3 things I want to say'],
			2: ['i said pick up that item'],
			3: ['Dude, man, dude....you gotta avoid the employees man...'],
			4: ['this is a test of special dialog', 'GET THAT ITEM', 'waitForItem', 'this is the second part of the dialog after you got the item'],
			5: ['Pssst! Over here!'],
			6: ['Hey, what are you doing in here? Get out!'],
			7: ['The names Beth. I have a lot to show you, but it\'s not safe here...Follow me.',
			 	'moveToLocation',
			 	'moveToLocation',
			 	"Alright, I think we're OK here. The NSA is who runs the show now; they got you kicked out cause they think you ain't worth nothing. We'll show them..I'll lend you a hand in taking them out.",
			 	"Yer gunna need something to hold onto your stuff. My 'cart is over there, why don't you take it. I'll wait"],
			8:["Alright, looking better already. You're going to need to eat and sleep too. Dumpsters like this one here are all over the city. You need to look through them to get food and survive.",
			 	"Go ahead, I'll let you get first pickin's at this one. Talk to me when you're done"],
			9:[ "Good! I bet yer tired. You can't just go gallivanting around the city like a mad man and raiding soup kitchens and get no sleep. You need to find yerself I nice, comfortable box to sleep in.",
			 	"I know a guy around [insert area of city] that knows something about box finding. Here, take this map, I've marked where you need to go."],
			10: ["It took you long enough...Anyways, I know a place where they're holding on to some ORGONE CRYSTALS. We need them to [insert reason for needing the crystals].",
				"The place is a soup kitchen; they run that too. You get those crystals, and we're one step closer to taking them down."],
			11: ["Wow...I didn't think you'd actually make it. We might stick it to them yet. You know, the NSA took everything from me: my husband, my kids, my pets..."]
		},

		init:function () {
		},

		getDialog:function(number){
			return this.dialog[number];
		}

	});

});
