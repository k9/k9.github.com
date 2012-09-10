(function() {

var $$ = game.turret = {
    create: function(x, y) {
        var turret = {
            type: 0,
            health: 100,
            x: x, 
            y: y,
            lastFire: 0
        }

        turret.startHealth = turret.health;

        return turret;
    },

    update: function(turret, elapsed) {
        if(elapsed - turret.lastFire > 0.1 && Math.abs(turret.y - game.theRover.y) < 8) {
            turret.lastFire = elapsed;
            if(turret.x > game.theRover.x)
                game.newProjectile(turret.x - 17, turret.y, -0.1, true, 2);
            else
                game.newProjectile(turret.x + 17, turret.y, 0.1, true, 2);
        }

        if(turret.health > 66) turret.type = 0;
        else if(turret.health > 33) turret.type = 1;
        else turret.type = 2;
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

    makeMesh: function(turrets) {
        var meshData = { 
            vertices: [], triangles: [], types: [], coords: [], 
            xs: [], ys: [], strengths: []
        };

        for(var i = 0; i < turrets.length; i++)
            $$.addPart(meshData, 4, 
                turrets[i].type, 
                turrets[i].x, 
                turrets[i].y,
                turrets[i].health > 0 ? 1 : 0);

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