ig.module(
	'game.classes.wordwrap'
)
.requires(
	'impact.game',
	'impact.font'
)
.defines(function(){


     WordWrap = ig.Class.extend({

        text:"",
        maxWidth:100,
        cut: false,

        init:function (text, maxWidth, cut) {
            this.text = text;
            this.maxWidth = maxWidth;
            this.cut = cut;
        },

        wrap:function(){
            var regex = '.{1,' +this.maxWidth+ '}(\\s|$)' + (this.cut ? '|.{' +this.maxWidth+ '}|.+$' : '|\\S+?(\\s|$)');
            return this.text.match( RegExp(regex, 'g') ).join( '\n' );
        }

    });

});
