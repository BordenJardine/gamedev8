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

		dialog: {
			1: ["1: This is a test",
				"2: Now I'm talking",
				"3: Who is this",
				"1: Now me again"],
			2: ["And stay down!"],
			3: ['Dude, man. Things ain\'t what they seem..',
				"This place is a COVER UP, they're hiding something in the back..",
				"But it's too well guarded, you'll have to find another way in.",
				"If you have a box, it's good for sneakin' past"
			],
			4: ["I wonder what's going on over there..."],
			5: ['Pssst! Over here!'],
			6: ['Hey, what are you doing in here? Get out!'],
			7: ["They call me Hyperspace Beth 'round here.",
				"I have a lot to show you, but it's not safe here...Follow me.",
				'moveToLocation',
				'moveToLocation',
				"Alright, I think we're OK here.",
				"Yer gunna need something to hold onto your stuff. My cart is over there, why don't you take it. I'll wait"],
			8:["Alright, looking better already. You're going to need to eat and sleep too.",
				"Dumpsters like this one here are all over the city. You need to look through them to get food and survive.",
				"Go ahead, I'll let you get first pickin's at this one. Talk to me when you're done"],
			9:[ "Good! I bet yer tired. You can't just go gallivanting around the city like a mad man and get no sleep.",
				"You need to find yerself a nice, comfortable box to sleep in.",
				"I know a guy around here with a mighty fine sleepin' box. You might want to be discrete about it.",
				"Here, take this map, I've marked where you need to go."],
			10: ["You slept long enough... Anyways, It's time we talked about a serious matter.  This might sound crazy but hear me out.",
				 "The NSA has taken over the city. They are using a new secret weapon to turn our technology against us! It's all a part of a New World Order conspiracy!",
				 "Us folks are the only chance we have at stopping them. They track your every move if you carry a phone, but we're smarter than that.",
				 "Rumor has it, the NSA relocated their headquarters to this city somewhere. We need to get you in there.",
				"But first, you are going to need an orgone crystal to boost your life force.  I think I left mine in the shelter.", "You'll have to sneak back into the homeless shelter, and get into the kitchen.", "Find the secret tunnel to the government listening post. I seem to remember leaving the orgone in the room surrounded by armed guards."],
			11: ["$2.25!!! How are guys like you and me supposed to afford $2.25 to get into the subway??",
				"If only I had the Golden Tin Can of Panhandling...with that mythologic piece I could beg my way in...Last I heard it was in the shelter somewhere"],
			12: ["I thought I told you to scram."],
			13: ["They took her! I saw it. Some goons popped around while you were out and took her. She's probably half way to a FEMA death camp!",
				"I know who you are, and I think I can help....for a favor.",
				"I'm a mole person, we have a hideout in the subway station, but it's under attack...",
				"..and my brother is down there..",
				"If you can manage to wrassle up enough money for a metro pass, find our hideout, and rescue my brother,",
				"Then we can give you information I think you'll find valuable.."],
			14: ["Wow, I can't believe you did it!..",
				"Well, a deal's a deal. The NSA is them who took Hyperspace Beth. Their HQ is in the northwest corner of the city, surrounded by gates.",
				"My brother was able to get you a key as you guys escaped. Here. Go get her."],
			15: ["Oh, Hyperspace Beth sent you?",
				"The box she's talking about belongs to Extremely Crazy Nicholas. He ain't exactly lucid.",
				"It's just around the corner. If you can get by him, it's all yours. He probably won't miss it."],
			16: ["Good! You got the box. Now why don't you rest a little. There's a grate to sleep on over there.",
				"Come talk to me after you've gotten some rest...We've got a long journey ahead of us."],
			17: ["Leave me alone, I don't have time for you."],
			18: ["Here, now get away!"],
			19: ["I don't have anything. Leave me alone."],
			20: ["Shhh. Get away. You're going to give me away.."],
			21: ["RAAARGH! PLEASE HELP ME!!"],
			22: ["I hope they don't find me!"],
			23:["Go man, go! The exit is just ahead..",
				"But there's a lot of scary dudes up there. You're going to have to make a run for it."],
			24: ["GET ME OUTTA HERE.  I'm not sure how they found us. But I'm just minding my own business then BAM",
				"They somehow figured out we were in this abandoned part of the subway tunnels. Musta been a rat",
				"We have to go through the mole people's shanty town up ahead. Be careful.",
				"I'll follow you. Just get me to to the exit. I can take it from there."],
			25: ["BZZZT", "ALERT INTRUDER ALERT", "UNKNOWN CELL NUMBER. UNKNOWN EMAIL. NO DATA. DESTRRRRRRRRROOYYY"],
			26: ["Ha. Ha. Puny Hu-man. You can't hurt me that way."],
			27: ["Threat neutralized. Data upload begin."],
			28: ["OUCH"],
			29: ["What? What is this fluctuation?"],
			30: ["BQBZZZTt..tt......", "Hooww...could this happen....can not compute", "Selfff detroucttt sequeence ACTIVE"],
			31: ["Nice job! But we gotta get outta here. That darn machine is trying to take us down with it. RUNS!"],
			32: ["You...you found me. I can't believe it.",
				"But we'll have to save the sentimentalities for later. We have one more task ahead of us.",
				"PRISM is located in this building. That's the machine that's been spying on people everywhere.",
				"We've been immune due to our lack of technology, but we can't just sit around and let it continue to function.",
				"I swiped a card key from a guard. It's behind me. Grab it, and let's go kill us a computy."],
			33: ["Lets go, man!"],
			34: ["Heeeeeeeeeeeeeyyyya. I'm Crazy Carl. I saw you back at the shelter...I got kicked out too",
				"They didn't even let me take my rock with me. If you sneak back in there and get it, I'll make it worth your while."],
			35: ["Thanksssssss! Here, have my life savings. Not like I can buy anything anyways..."],
      36: ["Welcome to the streets; I heard you're new. There's stuff stuff to scavenge back here.",
            "But if you want some serious moolah, you should talk to Carl in the park.",
            "I heard he's got some work to be done."],
      37: ["Hurrrumph. This city is just filling up with you people. It's time to move!"],
      38: ["Would you leave me be? I'm trying to sit down for lunch.'"],
      39: ["Hey. Feel free to scavenge my dumpster. Restaurant over here dumps good stuff in everyday."],
      40: ["Yo! If you ever have the need to go down into the subway, I've got a job for you",
            "I used to live down there, but when I left, I forgot my extra tinfoil",
            "If you bring it back to me I'll make it worth your while.'"],
      41: ["Awesome, thanks! Here, there was enough left over, so take this. It's a tinfoil hat.",
            "Cuts down on metal wave propagation, and lets you focus more. 'See' things better, if you will."]
    },


		init:function () {
		},


		getDialog:function(number){
			return this.dialog[number];
		}

	});

});
