var gameStatus = [0,0,0,0,0,0,0,0,0];
var moves = 0;
var myClick;
var OtherClick;
const socket = io("/");
var enableClick = false;
//getting the location value
document.getElementById("url").value=location
const copyToClip = () => {
    copyText = document.getElementById("url")
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    copyText.value = "Copied";
    copyText.onclick = null;
    window.getSelection().removeAllRanges();
}
//emit joining the room in to join room in socket
socket.emit("join-room", ROOM_ID);
//on user connected connected the one who created the board gets 'x' and other player gets 'o' and add event can play so the other user can click
socket.on("user-connected", () => {
    document.getElementById("message").innerHTML = "User connected";
    myClick = "X";
    OtherClick = "O";
    enableClick = true;
    socket.emit("can-play");
})
//on event passed can play the other user gets to play sets the user letter to 'o' and the player who creted the board sets his letter'x'
socket.on("can-play", () => {
    myClick = "O";
    OtherClick = "X";
    enableClick = true;
})
//clicked function is passed when user clicks the box
//click function if user has enable click he got 1 move once its clicked enable click becomes false
//if the user had value enableclick to true he gets one incrementing the user moves and changing the bos element to letter allorted
//setting the enable click to false once clicked
//adding event clicked so that other user get changes on his browser
//passing the id from the element 
const clicked = (id) => {
    if (enableClick) {
        moves+=1;
        const element = document.getElementById(id);
        element.innerHTML = myClick;
        element.onclick = null;
        socket.emit("clicked", id);
        enableClick = false;
        gameStatus[id-1] = 1;
                //example:user1 clicks the first box then gamstatus[1-1]=1;
        //the gamestatus becomes ['1','0','0','0','0','0','0','0','0']
        //let user clicked  the first three row
        //then gamestatus becomes = gamestatus[1,1,1,2,2,1,2,1,1 ] then u win message appends else there is nine moves and no match to the below logic then draw message append
        if ((gameStatus[0] == 1 && gameStatus[1] == 1 && gameStatus[2] == 1)||
        (gameStatus[0] ==1 && gameStatus[3] == 1 && gameStatus[6] == 1)||
        (gameStatus[0] ==1 && gameStatus[4] == 1 && gameStatus[8] == 1)||
        (gameStatus[2] ==1 && gameStatus[5] == 1 && gameStatus[8] == 1)||
        (gameStatus[2] ==1 && gameStatus[4] == 1 && gameStatus[6] == 1)||
        (gameStatus[1] ==1 && gameStatus[4] == 1 && gameStatus[7] == 1)||
        (gameStatus[3] ==1 && gameStatus[4] == 1 && gameStatus[5] == 1)||
        (gameStatus[6] ==1 && gameStatus[7] == 1 && gameStatus[8] == 1)) {
            document.getElementById("message").innerHTML = "You win";
            enableClick = false;
            setTimeout(()=>{location.href='/';}, 2000);
        }else if(moves==9){
            document.getElementById("message").innerHTML = "It's a Draw";
            setTimeout(()=>{location.href='/';}, 2000);
        }
    }
}
//socket event on the clicked change to the box element to letter of other user after his click
//
socket.on("clicked", (id) => {
    moves+=1;
    const element = document.getElementById(id);
    element.innerHTML = OtherClick;
    element.onclick = null;
    enableClick = true;
    gameStatus[id-1] = 2;
    //same logic as seen in clicked function here it calculates the other user user point if other user clicked first three boxes
    //gamestatus becomes gamestaus[2,2,2,1,1,2,1,2,2] whichb is true in below argument message elements appends "you loose" else then its draw
    if ((gameStatus[0] ==2 && gameStatus[1] ==2 && gameStatus[2] ==2)||
        (gameStatus[0] ==2 && gameStatus[3] ==2 && gameStatus[6] ==2)||
        (gameStatus[0] ==2 && gameStatus[4] ==2 && gameStatus[8] ==2)||
        (gameStatus[2] ==2 && gameStatus[5] ==2 && gameStatus[8] ==2)||
        (gameStatus[2] ==2 && gameStatus[4] ==2 && gameStatus[6] ==2)||
        (gameStatus[1] ==2 && gameStatus[4] ==2 && gameStatus[7] ==2)||
        (gameStatus[3] ==2 && gameStatus[4] ==2 && gameStatus[5] ==2)||
        (gameStatus[6] ==2 && gameStatus[7] ==2 && gameStatus[8] ==2)) {
            document.getElementById("message").innerHTML = "You Lose";
            enableClick = false;
            setTimeout(()=>{location.href='/';}, 2000);
        }else if(moves==9){
            document.getElementById("message").innerHTML = "It's a Draw";
            setTimeout(()=>{location.href='/';}, 2000);
        }
})
//if room size greater than two server emits full-room .. display room is full on message
socket.on("full-room", () => {
    document.getElementById("message").innerHTML = "Room full...";
    setTimeout(()=>{location.href='/';}, 2000);
})
//on disconnecting show message user disconnected
socket.on("user-disconnected", () => {
    document.getElementById("message").innerHTML = "User disconnected";
    setTimeout(()=>{location.href='/';}, 2000);
})
