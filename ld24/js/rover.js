(function() {

var $$ = game.rover = {
    parts: {
        "cannon": 5,
        "chassis": 3,
        "wheels": 0,
    },

    create: function(data, columns, rows, callback) {
        var rover = {
            health: 100,
            x: 200, 
            y: 200,
            xSpeed: 0,
            ySpeed: 0,
            acceleration: 0.005,
            poised: false,
            jump: 1.5,
            xSpeedMax: 0.5,
            ySpeedMax: 5,
            blocks: [],
            cannonRight: true,
            lastFire: 0,
            meshData: { vertices: [], triangles: [], types: [], coords: [] }
        }

        var i = 0;
        for(var key in game.rover.parts)
            game.rover.addPart(rover, i++, game.rover.parts[key]);

        return rover;
    },

    update: function(rover, elapsed) {
        rover.x += rover.xSpeed;
        rover.xSpeed = absClamp(rover.xSpeed, 0.0001, [0.033, 0.1, 0.15, 0.25][game.currentGen.speed]);

        if(game.keysDown.right) rover.cannonRight = true;
        if(game.keysDown.left) rover.cannonRight = false;

        rover.ySpeed = absClamp(rover.ySpeed, 0.0001, rover.ySpeedMax);
        rover.y += rover.ySpeed;
        
        var fixedX = $$.fixX(rover); 
        var fixedY = $$.fixY(rover);
        var errorX = Math.abs(rover.x - fixedX);
        var errorY = Math.abs(rover.y - fixedY);

        if(errorX + errorY > 0) {
            if(errorX < errorY) {
                if(fixedX != rover.x) {
                    rover.x = fixedX;
                    rover.xSpeed = 0;
                }

                fixedY = $$.fixY(rover);
                if(fixedY != rover.y) {
                    rover.y = fixedY;
                    rover.ySpeed = 0;
                }
            } 
            else {
                if(fixedY != rover.y) {
                    rover.y = fixedY;
                    rover.ySpeed = 0;
                }

                fixedX = $$.fixX(rover);
                if(fixedX != rover.x) {
                    rover.x = fixedX;
                    rover.xSpeed = 0;
                }
            }
        }
        
        if(game.keysDown.right && !game.level.touchingRight(rover))
            rover.xSpeed += rover.acceleration;
        else if(game.keysDown.left && !game.level.touchingLeft(rover))
            rover.xSpeed -= rover.acceleration;
        else
            rover.xSpeed *= 0.99;

        if(!game.level.touchingBottom(rover))
            rover.ySpeed -= 0.001;

        if(game.keysDown.up && game.level.touchingBottom(rover) && !game.level.touchingTop(rover))
            rover.ySpeed += [0.02, 0.033, 0.06, 0.1][game.currentGen.jump];

        var cooldownTime = 0.05;
        var lifetime = [0.1, 0.2, 0.5, 1][game.currentGen.blaster]
        if(elapsed - rover.lastFire > cooldownTime  && game.keysDown.space) {
            rover.lastFire = elapsed;
            if(rover.cannonRight)
                game.newProjectile(rover.x + 8, rover.y + 4, 0.3, false, lifetime);
            else
                game.newProjectile(rover.x - 8, rover.y + 4, -0.3, false, lifetime);
        }

        var touching = game.level.touchingBlocks(rover);
        if($.inArray(game.level.blockTypes.end, touching) > -1) {
            game.loadLevel(game.levelNumber + 1);
            game.milliseconds = -1;
        }

        if(rover.health < 0) {
            game.loadLevel(game.levelNumber);
            game.milliseconds = -1;   
        }
    },

    fixX: function(rover) {
        if(Math.abs(rover.xSpeed) > 0) {
            if(game.level.collisionLeft(rover) && !game.level.collisionRight(rover))
                return (game.level.tile(rover).x + 1) * 16; 
            if(game.level.collisionRight(rover) && !game.level.collisionLeft(rover))
                return game.level.tile(rover).x * 16;
        }
        return rover.x;
    },

    fixY: function(rover) {
        if(Math.abs(rover.ySpeed) > 0) {
            if(game.level.collisionBottom(rover) && !game.level.collisionTop(rover))
                return (game.level.tile(rover).y + 1) * 16; 
            if(game.level.collisionTop(rover) && !game.level.collisionBottom(rover))
                return game.level.tile(rover).y * 16; 
        }
        return rover.y;
    },

    addPart: function(rover, layer, type) {
        rover.meshData.vertices.push([0,0,-layer], [1,0,-layer], [0,1,-layer], [1,1,-layer]);
        var i = rover.meshData.triangles.length / 2 * 4;
        rover.meshData.triangles.push([i,i+1,i+2], [i+1,i+2,i+3]);
        rover.meshData.coords.push([0,0], [1,0], [0,1], [1,1]);
        rover.meshData.types.push(type, type, type, type);
    },

    offsetTypes: function(rover, offsets) {
        rover.meshData.types = [];
        var i = 0;
        for(var key in game.rover.parts) {
            var type = game.rover.parts[key] + offsets[i];
            rover.meshData.types.push(type, type, type, type);
            i++;
        }     
    },

    makeMesh: function(rover) {
        var mesh = new GL.Mesh({ coords: true });
        mesh.vertices = rover.meshData.vertices;
        mesh.triangles = rover.meshData.triangles;
        mesh.coords = rover.meshData.coords;
        mesh.addVertexBuffer('types', 'type');
        mesh.types = rover.meshData.types;
        mesh.compile();
        return mesh;
    }
};

})();