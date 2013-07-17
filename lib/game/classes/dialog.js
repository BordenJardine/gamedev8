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
			1: [],
			2: [],
			3: ['Dude, man. Things ain\'t what they seem..',
				"This place is a COVER UP, they're hiding something in the back..",
				"But it's too well guarded, you'll have to find another way in."
			],
			4: [],
			5: ['Pssst! Over here!'],
			6: ['Hey, what are you doing in here? Get out!'],
			7: ['The names Beth. I have a lot to show you, but it\'s not safe here...Follow me.',
				'moveToLocation',
				'moveToLocation',
				"Alright, I think we're OK here.",
				"The NSA is who runs the show now; they got you kicked out cause they think you ain't worth nothing.",
				"We'll show them..I'll lend you a hand in taking them out.",
				"Yer gunna need something to hold onto your stuff. My 'cart is over there, why don't you take it. I'll wait"],
			8:["Alright, looking better already. You're going to need to eat and sleep too.",
				"Dumpsters like this one here are all over the city. You need to look through them to get food and survive.",
				"Go ahead, I'll let you get first pickin's at this one. Talk to me when you're done"],
			9:[ "Good! I bet yer tired. You can't just go gallivanting around the city like a mad man and get no sleep.",
				"You need to find yerself a nice, comfortable box to sleep in.",
				"I know a guy around here that knows something about box finding. Here, take this map, I've marked where you need to go."],
			10: ["You slept long enough...Anyways, I know a place where they're holding on to some ORGONE CRYSTALS. We need them to find the NSA HQ.",
				"The place is a soup kitchen; they run that. You get those crystals, and we're one step closer to taking them down."],
			11: [],
			12: ["NO ADMITTANCE"],
			13: ["They took her! I saw it. Some goons popped around while you were out and took her.",
				"I know who you are, and I think I can help....for a favor.",
				"I'm a mole person, we have a hideout in the subway station, but it's under attack...",
				"..and my brother is down there..",
				"If you can manage to wrassle up enough money for a metro pass, find our hideout, and rescue my brother,",
				"Then we can give you information I think you'll find valuable.."],
			14: ["YOU DID IT!",
				"Thanks, hero"],
			15: ["Hey, my man. Hyperspace Beth (that's what we call her...don't tell her) told me you'd be comin'",
				"There's a good box around the corner here that I've been trying to get at, but there's a goon guarding it.",
				"If you can get by him, it's all yours."],
			16: ["Good! You got the box. Now why don't you rest a little. There's a grate to sleep on over there.",
				"Come talk to me after you've gotten some rest...We've got a long journey ahead of us."],
			17: [],
			18: ["Here, now get away!"],
			19: ["I don't have anything. Leave me alone."]
		},

		init:function () {
		},

		getDialog:function(number){
			return this.dialog[number];
		}

	});

});
