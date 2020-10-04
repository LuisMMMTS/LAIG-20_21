/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - inner radius
 * @param outer - outer radius
 * @param slices - sections around the inner radius
 * @param loops - sections around the outer radius
 */    
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);
		this.inner = inner;
		this.outer = outer;
		this.slices = slices;
        this.loops = loops;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
	
		for(var n = 0; n <= this.loops; n++){
			var theta = n*2*Math.PI/this.loops;


			for(var s=0; s <= this.slices; s++){
				var phi = s*2*Math.PI/this.slices;
				var x = (this.outer + (this.inner * Math.cos(phi))) * Math.cos(theta);
				var y = (this.outer + (this.inner * Math.cos(phi))) * Math.sin(theta);
				var z = this.inner * Math.sin(phi);

				var k  = n/this.loops;
				var t  = s/this.slices;	

				this.vertices.push(x,y,z);
				this.normals.push(x,y,z);
				this.texCoords.push(t,k);
			}
			
		}

		for(var n=0; n < this.loops; n++){
			for(var s=0; s < this.slices; s++){	
				var i = n*(this.slices+1) + s;
				var j = i + this.slices + 1;

				this.indices.push(i, j, j+1);
				this.indices.push(j, j+1, i+1);
			}
			
		}
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}



	updateTexCoords(coords) {
		//to do 
	}

}