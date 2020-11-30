/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class Board extends CGFobject {
	constructor(scene, x1, y1, x2, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

        this.nPartsU = this.x2 - this.x1;
		this.nPartsV = this.y2 - this.y1;

        this.side = this.nPartsU;
        
        this.tiles = [];

		this.initBuffers();
	}	
	
	initBuffers() {
        this.board = new MyPlane(this.scene, this.nPartsU, this.nPartsV);
        this.createBoardTiles();

	}
	createBoardTiles(){
        let id = 1
        let nTiles = this.side/2.0;
        console.log(nTiles*nTiles);
        for (let i = 0; i < nTiles; i++){
            for (let j = 0; j < nTiles; j++){
                this.tiles.push(new BoardTile(this.scene, 2, i, j, id));
                id++;
            }
        }
	}

	addPieceToTile(tile, piece){
        tile.piece = piece;
    }
    
	removePieceFromTile(){
		tile.piece = null;
    }
    
	getPieceOfTile(tile){
		return tile.piece;
    }
    
	getTileOfPiece(piece){
		for(t in this.tiles){
			if(t.piece == piece) return t;
		}
    }
    
	getTileWithCoordinates(x,y){
        return this.tiles(x * side + y)
		
    }
    
	movePiece(tile1, tile2){
        let aux = tile2.piece;
        this.removePieceFromTile(tile2);
        this.addPieceToTile(tile1.piece, tile2);
        this.removePieceFromTile(tile1);
        this.addPieceToTile(aux);
	}

    display(){
        /*
        this.scene.pushMatrix();
        this.scene.scale(this.nPartsU, 1, this.nPartsV);
        this.board.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        */
        
       this.scene.pushMatrix();
       this.scene.translate(-this.side/4.0,0,-this.side/4.0);
        for (let cell = 0; cell < this.tiles.length; cell++){
            this.tiles[cell].display();//each tile 
        }
        this.scene.popMatrix();
        
    }

	
	
}
