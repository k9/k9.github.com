function Car() {
	var slices = 20, stacks = 20;
	var bodyMesh = CSG.cylinder({ start: [0, -1.5, 0], end: [0, 1.5, 0], radius: 1.5, slices: slices })
		.intersect(CSG.sphere({ radius: 1.8, slices: slices, stacks: stacks, center: [0, 0, 0] }));
	    //.subtract(CSG.cylinder({ start: [0, -0.75, 0.9], end: [0, 0.75, 0.9], radius: 0.7, slices: slices }));

	this.fuel = CSG.cylinder({ start: [0, 0, 0], end: [0, 1.2, 0], radius: 1.6, slices: slices })
	    .subtract(CSG.cube({ radius: 3.0, center: [3.25, 0.5, 0] }))
	    .subtract(CSG.cube({ radius: 3.0, center: [-3.25, 0.5, 0] })).toMesh();

	this.fuelGuage = CSG.cylinder({ start: [0, 0, 0], end: [0, 1.4, 0], radius: 1.55, slices: slices })
	    .subtract(CSG.cube({ radius: 3.0, center: [3.35, 0.6, 0] }))
	    .subtract(CSG.cube({ radius: 3.0, center: [-3.35, 0.6, 0] })).toMesh();

	var slices = 16, stacks = 16;
	var leftSphere = CSG.sphere({ radius: 1.0, slices: slices, stacks: stacks, center: [-2.25, 0, 0] })
	    .subtract(CSG.sphere({ radius: 0.9, slices: slices, stacks: stacks, center: [-2.25, 0, 0] }))
	    .subtract(CSG.cube({ radius: 1.0, center: [-3.25, 0, 0] }));

	var rightSphere = CSG.sphere({ radius: 1.0, slices: slices, stacks: stacks, center: [2.25, 0, 0] })
	    .subtract(CSG.sphere({ radius: 0.9, slices: slices, stacks: stacks, center: [2.25, 0, 0] }))
	    .subtract(CSG.cube({ radius: 1.0, center: [3.25, 0, 0] }));

	var bottomSphere = CSG.sphere({ radius: 1.25, slices: slices, stacks: stacks, center: [0, -2.5, 0] })
	    .subtract(CSG.sphere({ radius: 1.0, slices: slices, stacks: stacks, center: [0, -2.5, 0] }))
	    .subtract(CSG.cube({ radius: 1.5, center: [0, -3.5, 0] }));

	this.mesh = leftSphere.union(rightSphere).union(bottomSphere).union(bodyMesh).toMesh();

	var radius = 0.7, slices = 32;

	var trailSize = 30;
	this.trailMesh = new GL.Mesh();
	this.trailMesh.triangles = new Array(trailSize * 3);
	this.trailMesh.indices = new Array(trailSize * 3)
	for(var i = 0; i < trailSize; i++) {
	    var x = i / trailSize;
	    this.trailMesh.vertices[i * 3] = [-(0.4 + x), 1 - x, 0];
	    this.trailMesh.vertices[i * 3 + 1] = [-(0.4 + x), -1 + x, 0];
	    this.trailMesh.vertices[i * 3 + 2] = [-x, 0, 0];
	}

	for(var i = 0; i < trailSize * 3; i++)
		this.trailMesh.triangles[i] = i;

	this.trailMesh.compile();
}