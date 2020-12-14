/**
 * MyPrologInterface
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPrologInterface {
    constructor(gameOrchestrator) {
        this.gameOrchestrator = gameOrchestrator;
    }


    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    responsesToArrays(response) {
        let array = response.split("[").map(Array)[0][2].slice(2);
        array = array.map(function (x) {
            x = x.replaceAll(']', '');
            x = x.split(",");
            return x;
        });
        array = array.filter(item => item);
        return array
    }

    gameBoardtoString(board) {
        let final_array = "["
        for (let i = 0; i < board.size; i++) {
            let row = "["
            for (let j = 0; j < board.size; j++) {
                row = row.concat(board.tiles[i * board.size + j].piece.player + ",");
            }
            row = row.slice(0, -1);
            row = row.concat("]");
            final_array = final_array.concat(row + ",");
        }
        final_array = final_array.slice(0, -1);
        final_array = final_array.concat("]");
        return final_array
    }

    makeRequest() {
        // Get Parameter Values
        var requestString = document.querySelector("#query_field").value;

        // Make Request
        getPrologRequest(requestString, handleReply);
    }

    //Handle the Reply
    handleReply(data) {
        document.querySelector("#query_result").innerHTML = data.target.response;
    }

    handleBoardReply(data) {
        //document.querySelector("#query_result").innerHTML=data.target.response;
        let response = data.target.response;
        response = this.responsesToArrays(response);
        this.gameOrchestrator.gameBoard = new Board(this.gameOrchestrator.scene, response);
    }

    boardRequest(size) {
        this.getPrologRequest("initialBoard(" + size + ")", this.handleBoardReply.bind(this));
        //let board=data.target.response;
        //console.log("board is: "+this);
    }


    handleMoveReply(data) {
        //document.querySelector("#query_result").innerHTML=data.target.response;
        let response = data.target.response;
        console.log(response);
        response = this.responsesToArrays(response);
        console.log(response);
        let OldPos = response[1].slice(0, 2);
        let NewPos = response[2].slice(0, 2);
        //Move piece
        let newBoard = response.slice(4);
        //compare to board now and/or save in states?
        console.log(newBoard);
    }

    moveRequest(board, player, AiLevel1 = null, AiLevel2 = null, OldPos = null, NewPos = null) {
        board = this.gameBoardtoString(board);
        if (AiLevel1 == null && AiLevel2 == null) {//human
            this.getPrologRequest("playerTurn(" + board + "," + player + "-'player'-" + AiLevel1 + "-" + AiLevel2 + "," + OldPos + "," + NewPos + ")", this.handleMoveReply.bind(this));
        } else {//computer
            this.getPrologRequest("playerTurn(" + board + "," + player + "-'computer'-" + AiLevel1 + "-" + AiLevel2 + "," + "_" + "," + "_" + ")", this.handleMoveReply.bind(this));
        }

    }


    handleMovablePiecesReply(data) {
        //document.querySelector("#query_result").innerHTML=data.target.response;
        let response = data.target.response;
        response = this.responsesToArrays(response);
        console.log(response);
    }

    getMovablePiecesResquest(board, player) {
        board = this.gameBoardtoString(board);
        console.log("boar is " + board);
        this.getPrologRequest("getMovablePieces(" + board + "," + player + ")", this.handleMovablePiecesReply.bind(this));
    }


    handlePieceMovesReply(data) {
        //document.querySelector("#query_result").innerHTML=data.target.response;
        let response = data.target.response;
        response = this.responsesToArrays(response);
        console.log(response);
    }
    getPieceMovesRequest(board, player, pieceCoords) {
        board = this.gameBoardtoString(board);
        this.getPrologRequest("getValidMovesforPiece(" + board + "," + player + "," + "[" + pieceCoords + "])", this.handlePieceMovesReply.bind(this));
    }

    handleCurrentScore(data) {
        //document.querySelector("#query_result").innerHTML=data.target.response;
        let response = data.target.response;
        //response=this.responsesToArrays(response);
        response=response.replaceAll(']', '').replaceAll('[', '').split(",").map(Number);
        response=response.reduce(function(a,b){return Math.max(a,b)});
        console.log(response);
    }

    getcurrentscore(board, player) {
        board = this.gameBoardtoString(board);
        this.getPrologRequest("value(" + board + "," + player + ")", this.handleCurrentScore.bind(this));
    }
    
    handleWinner(data){
        let response = data.target.response;
        console.log(response);
    }
    getWinner(board,Player){//player é o penúltimo jogador (o jogador que atualmetne não tem jogadas)
        board=this.gameBoardtoString(board);
        this.getPrologRequest("checkEnd("+board+","+Player+")",this.handleWinner.bind(this));
    }

    
    getGameOver(board, player){
        this.getMovablePiecesResquest(board, player)

        movablepieces=0;
    }

    close() {
        this.getPrologRequest("quit");
    }

}