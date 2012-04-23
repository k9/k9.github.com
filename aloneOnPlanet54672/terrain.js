function makeGroundLayer(size, lod, heightFn, isSky, isDeep) {
	var vertsPerMeter = 2;
	var indicesPerMeter = 6;
	var indicesPattern = [0, 1, 2, 1, 3, 2];

    var layer = { height: new Array(size / lod), mesh: new GL.Mesh({ normals: isDeep }) };
    if(isDeep) layer.mesh.normals = new Array(layer.height.length * vertsPerMeter);
    layer.mesh.vertices = new Array(layer.height.length * vertsPerMeter);
    layer.mesh.triangles = new Array((layer.height.length - 1) * indicesPerMeter);

    for(var i = 0; i < layer.height.length; i++) {
        layer.height[i] = heightFn(i * lod);
    }

    for(var i = 0; i < layer.height.length; i++) {
        var y = 0, z = 0;

        if(isSky) y = 1000;

        if(isDeep) {
        	y = layer.height[i];
        	z = -10;
        }

        layer.mesh.vertices[i * vertsPerMeter] = [i * lod, y, z];
        layer.mesh.vertices[i * vertsPerMeter + 1] = [i * lod, layer.height[i], 0];
        
        if(isDeep) {
        	var prev = layer.height[Math.max(i - 1, 0)];
        	var next = layer.height[Math.min(i + 1, layer.height.length - 1)];
        	var normal = new CSG.Vector(2.0, next - prev, 0).cross(new CSG.Vector(0, 0, -1)).unit();

	        layer.mesh.normals[i * vertsPerMeter] = [normal.x, normal.y, normal.z];
	        layer.mesh.normals[i * vertsPerMeter + 1] = [normal.x, normal.y, normal.z];
	    }

        if(i != layer.height.length - 1) {
        	var start = i * indicesPerMeter;
        	for(var k in indicesPattern)
            	layer.mesh.triangles[start + k] = i * vertsPerMeter + indicesPattern[k];
        }
    }

    layer.mesh.compile();
    return layer;
}

function playableHeight(i, h) {
	if(i < 550) h *= (i - 500) / 50;
	if(i < 500) h += 100;
	h += 100;
	return h;
}

function initLevel(level, size, groundFn) {
	var slices = 20;
	level.wellFuelMesh = CSG.cylinder({ start: [0, -1.25, 0], end: [0, 1.0, 0], radius: 0.7, slices: slices }).toMesh();
	level.wellMesh = CSG.cylinder({ start: [0, -1.25, 0], end: [0, 1.0, 0], radius: 2.5, slices: slices })
		.subtract(CSG.cylinder({ start: [0, -1.6, 0], end: [0, 1.6, 0], radius: 0.8, slices: slices }))
		.subtract(CSG.cylinder({ start: [0, 0.7, 0], end: [0, 1.6, 0], radius: 1.25, slices: slices }))
		.intersect(CSG.sphere({ radius: 4.00, center: [0, -2.5, 0], slices: slices })).toMesh();

	level.finishMesh = CSG.sphere({ radius: 6.00, center: [0, 4, 0], slices: slices, stacks: slices }).toMesh();

	level.ground = makeGroundLayer(size, 1, groundFn, false, false);
	level.groundDepth = makeGroundLayer(size, 1, groundFn, false, true);

	level.backGround = makeGroundLayer(size, 4, function(i) { 
		return Math.sin(i / 14) * 2.5 + Math.cos(i / 40) * 5 + 80;  });

	level.backGround2 = makeGroundLayer(size, 8, function(i) {
    	return Math.sin(i / 16) * 2.5 + Math.sin(i / 50) * 5 + 60; });

	level.backGround3 = makeGroundLayer(size, 8, function(i) {
    return Math.sin(i / 24) * 2.5 + Math.sin(i / 40) * 5 + 40; });

	level.sky = makeGroundLayer(size, 8, function(i) {
    	return Math.cos(i / 50) * 2.5 + Math.cos(i / 60) * 2.5 + 350; }, true);
}

function LevelOne() {
	this.terrainColor = [0.8, 0.4, 0.3, 1];;
	this.skyColor = [0.5, 0.6, 1.0, 1.0];
	this.carStart = 683;
	this.finishLine = 1400;
	this.wells = [683, 840];

	initLevel(this, 4096, function(i) { 
		var h = Math.cos(i / 8) * 2.5 + Math.sin(i / 30) * 8.0 + Math.sin(i / 60) * 3.5; 
		return playableHeight(i, h);
	});
}

function LevelTwo() {
	this.terrainColor = [0.7, 0.5, 0.4, 1];;
	this.skyColor = [0.3, 0.4, 1.0, 1.0];
	this.carStart = 680;
	this.finishLine = 3400;
	this.wells = [680, 940, 1678, 2300, 3159];

	initLevel(this, 8192, function(i) { 
		var h = Math.sin(i / 9) * 1.5 + Math.sin(i / 30) * 5 + Math.sin(i / 40) * 5; 
		return playableHeight(i, h);
	});
}