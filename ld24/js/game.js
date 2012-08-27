(function() {

var $$ = window.game = {
    keysDown: {},
    keys: { left: 37, right: 39, up: 38, down: 40, A: 65, S: 83, D: 68, F: 70, R: 82, space: 32 },

    keyChange: function(code, pressed) {
        if(code == $$.keys.right || code == this.keys.D)
            game.keysDown.right = pressed; 
        if(code == $$.keys.left || code == this.keys.A)
            game.keysDown.left = pressed;
        if(code == $$.keys.down || code == this.keys.S)
            game.keysDown.down = pressed;
        if(code == $$.keys.up || code == this.keys.W)
            game.keysDown.up = pressed;
        if(code == $$.keys.space)
            game.keysDown.space = pressed;
        if(code == $$.keys.R)
            game.keysDown.restart = pressed;
    },

    newProjectile: function(x, y, speed, enemy, lifetime) {
        var p = game.projectile.create(x, y, speed, 0, enemy, lifetime);
        p.mesh = game.projectile.makeMesh(p);

        for(var i = 0; i < game.projectiles.length; i++) {
            if(!game.projectiles[i].alive) {
                game.projectiles[i] = p;
                return;
            }
        }

        game.projectiles.push(p);
    },

    loadLevel: function(i) { console.log(i)
        gl.onupdate = null;
        gl.ondraw = null;
        $(".screen").hide();

        if(i == 5) {
            $(".message")
                .find("p").hide().end()
                .find("h1").text("Victory" ).end().show().off("click");
            return;
        }

        if(game.levelNumber == i) $(".message").find("h1").text("Try Again");
        else  $(".message").find("h1").text("Level " + i);

        game.levelNumber = i;
        $(".message").show().off("click").on("click", game.start);
    },

    soundStarted: false,
    start: function() {
        loadImage("level" + game.levelNumber + ".gif", function(img) {
            $(".screen").hide();
            game.levelMesh = {};
            game.currentLevel = {};
            game.projectiles = [];
            game.turrets = [];
            game.turretsKilled = 0;

            game.generation = 1;

            game.currentGen = { speed: 0, jump: 0, blaster: 0 };
            game.nextGen = { speed: 0, jump: 0, blaster: 0 };

            var data = getImageData(img);

            game.theRover = game.rover.create();
            game.theRoverMesh = game.rover.makeMesh(game.theRover);

            game.currentLevel = game.level.create(data.data, data.width, data.height);
            game.levelMesh = game.level.makeMesh(game.currentLevel);

            $(document).on({
                keydown: function(e) { game.keyChange(e.keyCode, true); },
                keyup: function(e) { game.keyChange(e.keyCode, false); }
            });

            gl.onupdate = game.tick;
            gl.ondraw = game.render.draw;

            if(game.enableSound && !game.soundStarted) {
                game.soundStarted = true;
                game.sound.play();
            }
        });
    },

    elapsed: 0,
    leftOver: 0,
    lastPct: 0,
    tick: function(seconds) {
        if(game.keysDown.restart) {
            gl.onupdate = null;
            gl.ondraw = null;
            game.start();
            return;
        }

        game.elapsed += seconds;

        game.milliseconds = seconds * 1000 + game.leftOver;
        while(game.milliseconds > 1) {
            game.realTick();
            game.milliseconds -= 1;
        }
        game.leftOver = game.milliseconds;

        if(game.projectiles.length > 0)
            game.projectileMesh = game.projectile.makeMesh(game.projectiles);

        if(game.turrets.length > 0)
            game.turretMesh = game.turret.makeMesh(game.turrets);

        $("#hud .health .inner").css("width", game.theRover.health + "%");
 
        if(Math.floor(game.nextGen.jump) > game.currentGen.jump ||
           Math.floor(game.nextGen.speed) > game.currentGen.speed ||
           Math.floor(game.nextGen.blaster) > game.currentGen.blaster) {
            game.generation++;

            game.currentGen.speed = Math.max(game.currentGen.speed, Math.round(game.nextGen.speed));
            game.currentGen.jump = Math.max(game.currentGen.jump, Math.round(game.nextGen.jump));
            game.currentGen.blaster = Math.max(game.currentGen.blaster, Math.round(game.nextGen.blaster));

            $("#hud .current").fadeOut(500, function() {
                $("#hud .current").show().find("h1").text("Generation " + game.generation);
            });
        }

        $("#hud .current .speed .inner").css("width", game.currentGen.speed * 33.3 + "%");
        $("#hud .current .jump .inner").css("width", game.currentGen.jump * 33.3 + "%");
        $("#hud .current .blaster .inner").css("width", game.currentGen.blaster * 33.3 + "%");

        $("#hud .speed .inner.next").css("width", game.nextGen.speed * 33.3 + "%");
        $("#hud .jump .inner.next").css("width", game.nextGen.jump * 33.3 + "%");
        $("#hud .blaster .inner.next").css("width", game.nextGen.blaster * 33.3 + "%");

        if(game.enableSound) game.sound.updateEffects();
    },

    skillPoints: 8,
    realTick: function() {
        game.rover.update(game.theRover, game.elapsed);

        var altitude = Math.floor((game.theRover.y - game.theRover.startY) / 16);
        if(altitude < 5) game.nextGen.jump = altitude / 5;
        else if(altitude < 25) game.nextGen.jump = 1 + (altitude - 5) / 20;
        else game.nextGen.jump = 3;

        var distance = Math.floor(Math.abs(game.theRover.x - game.theRover.startX) / 16);
        if(distance < 15) game.nextGen.speed = distance / 15;
        else if(distance < 40) game.nextGen.speed = 1 + (distance - 15) / 25;
        else if(distance < 80) game.nextGen.speed = 2 + (distance - 40) / 40;
        else game.nextGen.speed = 3;

        if(game.turretsKilled == 0) game.nextGen.blaster = 0;
        else if(game.turretsKilled < 4) game.nextGen.blaster = 1 + game.turretsKilled / 4;
        else if(game.turretsKilled < 10) game.nextGen.blaster = 2 + (game.turretsKilled - 4) / 6;
        else game.nextGen.blaster = 3;

        for(var i = 0; i < game.projectiles.length; i++)
            if(game.projectiles[i].alive)
                game.projectile.update(game.projectiles[i], game.elapsed);

        for(var i = 0; i < game.turrets.length; i++)
            if(game.turrets[i].health > 0)
                game.turret.update(game.turrets[i], game.elapsed);
    }
};

})();