(function() {

var $$ = game.sound = {
    updateEffects: function() {
        if(Math.abs(game.theRover.ySpeed) > 0.01)
            $$.jumpEffect.notes[$$.jumpEffect.nextNoteNum] = 30;
        else
            $$.jumpEffect.notes[$$.jumpEffect.nextNoteNum] = 99;

        if(Math.abs(game.theRover.xSpeed) > 0.01)
            $$.driveEffect.notes[$$.driveEffect.nextNoteNum] = 
                12 + Math.floor(Math.abs(game.theRover.xSpeed * 100));
        else
            $$.driveEffect.notes[$$.driveEffect.nextNoteNum] = 99;

        var pCount = 0;
        for(var i = 0; i < game.projectiles.length; i++)
            if(game.projectiles[i].alive) 
                pCount++;

        $$.extraDrum.volume = Math.min(pCount / 10, 0.7);
    },

    play: function() {
        $$.bassDrum = {
            notes: [
                 2,99,99,99, 2,99,99,99,
                 2,99,99,99, 2,99,99,99,
                 2,99,99,99, 2,99,99,99,
                 2,99,99,99, 2,99,99,99
            ],
            synth: drumSynth,
            volume: 0.8,
        };

        $$.snareDrum = {
            notes: [
                 99,99,99,99, 1,99,99,99,
                 99,99,99,99, 1,99,99,99,
                 99,99,99,99, 1,99,99,99,
                 99,99,99,99, 1,99,99,99,
                 99,99,99,99, 1,99,99,99,
                 99,99,99,99, 1,99,99,99,
                 99,99,99,99, 1,99,99,99,
                 99,99,99,99, 1,99, 1, 1
            ],
            synth: drumSynth,
            volume: 0.8,
        };

        $$.hiHat = {
            notes: [
                 3,99, 3,99, 3,99, 3,99,
                 3,99, 3,99, 3,99, 3,99,
                 3,99, 3,99, 3,99, 3,99,
                 3,99, 3,99, 3,99, 3,99
            ],
            synth: drumSynth,
            volume: 0.8,
        };

        $$.extraDrum = {
            notes: [
                2,2,2,2
            ],
            synth: drumSynth,
            volume: 0.0,
        };

        $$.jumpEffect = {
            notes: [99, 99, 99, 99],
            synth: melodySynth,
            volume: 0.05,
        };

        $$.driveEffect = {
            notes: [99, 99, 99, 99],
            synth: melodySynth,
            volume: 0.05,
        };

        $$.voices = [$$.bassDrum, $$.snareDrum, $$.hiHat, $$.extraDrum, $$.driveEffect, $$.jumpEffect];

        $$.volume = 1;
        $$.bpm = 100;
        $$.node = audioStream(function(startSample, buffer, bufferSize, sampleRate) {
            for(var i = 0; i < bufferSize; i++) {
                var time = (startSample + i) / sampleRate; 
                buffer[i] = playVoices($$.voices, time, $$.volume, $$.bpm);
            }
        });
    }
};

})();