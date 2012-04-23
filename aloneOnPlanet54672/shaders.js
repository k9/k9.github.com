function Shaders() {
    this.car = new GL.Shader('\
        varying vec3 normal;\
        void main() {\
            normal = gl_Normal;\
            vec4 pos = vec4(gl_Vertex.xyz * 1.0, 1.0);\
            gl_Position = gl_ModelViewProjectionMatrix * pos;\
        }\
        ', '\
        varying vec3 normal;\
        varying vec4 modelView;\
        void main() {\
            vec3 light = vec3(-0.75, 0.5, 0.5);\
            vec3 view = normalize(vec3(-gl_ModelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)));\
			vec3 spec =  vec3(1.0, 1.0, 1.0) * pow(max(0.0, dot(reflect(-light, normal), view)), 10.0);\
            float brightness = dot(normal, light) * 0.3 + 0.7;\
            gl_FragColor = vec4(brightness + spec * 0.1, 1.0);\
        }\
    ');

    this.fuel = new GL.Shader('\
        varying vec3 normal;\
        uniform float amount;\
        void main() {\
            normal = gl_Normal;\
            vec4 pos = vec4(gl_Vertex.x,\
            	gl_Vertex.y * max(amount, 0.01),\
	            gl_Vertex.z, 1.0);\
            gl_Position = gl_ModelViewProjectionMatrix * pos;\
        }\
        ', '\
        varying vec3 normal;\
        void main() {\
        	vec3 light = vec3(-0.75, 0.5, 0.5);\
            float brightness = dot(normal, light) * 0.5 + 0.5;\
            gl_FragColor = vec4(brightness * 0.2, brightness * 1.0, brightness * 0.2, 1.0);\
        }\
    ');

     this.fuelGuage = new GL.Shader('\
        varying vec3 normal;\
        void main() {\
            normal = gl_Normal;\
            vec4 pos = vec4(gl_Vertex.xyz * 1.0, 1.0);\
            gl_Position = gl_ModelViewProjectionMatrix * pos;\
        }\
        ', '\
        varying vec3 normal;\
        varying vec4 modelView;\
        void main() {\
            vec3 light = vec3(-0.75, 0.5, 0.5);\
            vec3 view = normalize(vec3(-gl_ModelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0)));\
			vec3 spec =  vec3(1.0, 1.0, 1.0) * pow(max(0.0, dot(reflect(-light, normal), view)), 10.0);\
            float brightness = dot(normal, light) * 0.3 + 0.1;\
            gl_FragColor = vec4(brightness + spec * 0.25, 1.0);\
        }\
    ');

    this.trail = new GL.Shader('\
        uniform float speed;\
        varying float x;\
        void main() {\
        	x = gl_Vertex.x;\
            vec4 pos = vec4(gl_Vertex.x * 1.25 * speed, gl_Vertex.y, gl_Vertex.z, 1.0);\
            gl_Position = gl_ModelViewProjectionMatrix * pos;\
        }\
        ', '\
        varying float x;\
        void main() {\
            gl_FragColor = vec4(1.0, 0.5, 1.25 + x, 0.1);\
        }\
    ');

    this.finish = new GL.Shader('\
        varying vec3 normal;\
        void main() {\
        	normal = gl_Normal;\
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
        ', '\
        varying vec3 normal;\
        void main() {\
            gl_FragColor = vec4(normal * 0.25 + 0.75, 0.25);\
        }\
    ');

    this.downTrail = new GL.Shader('\
        uniform float speed;\
        varying float x;\
        void main() {\
        	x = gl_Vertex.x;\
            vec4 pos = vec4(gl_Vertex.y * 1.25, -1.25 + gl_Vertex.x * speed, gl_Vertex.z, 1.0);\
            gl_Position = gl_ModelViewProjectionMatrix * pos;\
        }\
        ', '\
        varying float x;\
        void main() {\
            gl_FragColor = vec4(1.0, 0.5, 1.25 + x, 0.25);\
        }\
    ');

    this.terrain = new GL.Shader('\
        void main() {\
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
        ', '\
        uniform vec4 color;\
        void main() {\
        	float dist = pow(distance(vec2(gl_FragCoord.x / 800.0, gl_FragCoord.y / 600.0), vec2(0.5, 0.5)), 3.0);\
            gl_FragColor = color * 0.8 - dist;\
        }\
    ');

    this.terrainNormals = new GL.Shader('\
        varying vec3 normal;\
        void main() {\
        	normal = gl_Normal;\
            gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
        }\
        ', '\
        uniform vec4 color;\
        varying vec3 normal;\
        void main() {\
            vec3 light = vec3(-0.75, 0.5, 0.5);\
            float brightness = dot(normal, light) * 0.5 + 0.5;\
            float dist = pow(distance(vec2(gl_FragCoord.x / 800.0, gl_FragCoord.y / 600.0), vec2(0.5, 0.5)), 3.0);\
            gl_FragColor = brightness * color - dist;\
        }\
    ');
}