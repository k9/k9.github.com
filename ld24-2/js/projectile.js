(function() {

var $$ = game.projectile = {
    create: function(x, y, xSpeed, ySpeed, enemy, lifetime) {
        var projectile = {
            lifetime: lifetime,
            type: xSpeed > 0 ? 0 : 1,
            x: x, 
            y: y,
            xSpeed: xSpeed,
            ySpeed: ySpeed,
            alive: true,
            enemy: enemy
        }

        projectile.startLifetime = projectile.lifetime;

        return projectile;
    },

    update: function(projectile) {
        projectile.x += projectile.xSpeed;
        projectile.lifetime -= 0.001;

        if(projectile.dying) {
            projectile.type = Math.random() > 0.5 ? 2 : 3;
            if(projectile.lifetime < 0) {
                projectile.alive = false;
                projectile.y = -100;
            }
        }
        else if(projectile.enemy && 
                Math.abs(projectile.x - game.theRover.x) < 8 && 
                Math.abs(projectile.y - game.theRover.y) < 8) {
            game.theRover.health -= 3;
            $$.fade(projectile);
        }
        else if(projectile.lifetime < 0 ||
           game.level.collisionLeft(projectile) || game.level.collisionRight(projectile)) {
            $$.fade(projectile);
        }

        if(!projectile.enemy && !projectile.dying) {
            for(var i = 0; i < game.turrets.length; i++) {
                if(game.turrets[i].health > 0 &&
                   Math.abs(projectile.x - game.turrets[i].x) < 16 && 
                   Math.abs(projectile.y - game.turrets[i].y) < 16) {
                    game.turrets[i].health -= 10;
                    $$.fade(projectile);
                    if(game.turrets[i].health <= 0) game.turretsKilled += 1;
                }
            }
        }
    },

    fade: function(projectile) {
        projectile.dying = true;
        projectile.xSpeed = 0;
        projectile.lifetime = 0.02;
        projectile.startLifetime = 0.02;
    },

    addPart: function(meshData, layer, type, x, y, strength) {
        meshData.vertices.push([0,0,-layer], [1,0,-layer], [0,1,-layer], [1,1,-layer]);
        var i = meshData.triangles.length / 2 * 4;
        meshData.triangles.push([i,i+1,i+2], [i+1,i+2,i+3]);
        meshData.coords.push([0,0], [1,0], [0,1], [1,1]);
        meshData.types.push(type, type, type, type);
        meshData.xs.push(x, x, x, x);
        meshData.ys.push(y, y, y, y);
        meshData.strengths.push(strength, strength, strength, strength);
    },

    makeMesh: function(projectiles) {
        var meshData = { 
            vertices: [], triangles: [], types: [], coords: [], 
            xs: [], ys: [], strengths: []
        };

        for(var i = 0; i < projectiles.length; i++)
            $$.addPart(meshData, 4, 
                projectiles[i].type + (projectiles[i].enemy ? 4 : 0), 
                projectiles[i].x, 
                projectiles[i].y,
                projectiles[i].lifetime / projectiles[i].startLifetime);

        var mesh = new GL.Mesh({ coords: true });
        mesh.vertices = meshData.vertices;
        mesh.triangles = meshData.triangles;
        mesh.coords = meshData.coords;
        mesh.addVertexBuffer('types', 'type');
        mesh.types = meshData.types;
        mesh.addVertexBuffer('xs', 'x');
        mesh.xs = meshData.xs;
        mesh.addVertexBuffer('ys', 'y');
        mesh.ys = meshData.ys;
        mesh.addVertexBuffer('strengths', 'strength');
        mesh.strengths = meshData.strengths;
        mesh.compile();
        return mesh;
    }
};

})();