const socket = io();

const welcom = document.querySelector("#welcome")
const room = document.getElementById("room")
const form = welcom.querySelector("form")
room.hidden = true

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = message
    ul.appendChild(li)
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const v = input.value
    socket.emit("new_message", input.value, roomName, ()=>{
        addMessage(`You: ${v}`)
    })
    input.value=""
}

function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#welcome input");
    socket.emit("nickname", input.value)
}

function showRoom(){
    welcom.hidden = true
    room.hidden = false;
    const h3 = room.querySelector("h3")
    h3.innerText = `Room ${roomName}`
    const msgform = room.querySelector("#msg")
    const nameform = welcom.querySelector("#name")
    msgform.addEventListener("submit", handleMessageSubmit);
    nameform.addEventListener("submit", handleNicknameSubmit);
}
function handleRoomSubmit(event){
    event.preventDefault();
    const roomNameInput = welcom.querySelector("#roomName");
    const nickNameInput = welcom.querySelector("#name");
    socket.emit("enter_room", roomNameInput.value,nickNameInput.value, showRoom);
    roomName = roomNameInput.value;
    roomNameInput.value = "";
}


form.addEventListener("submit", handleRoomSubmit)


socket.on("welcome",(user, newCount)=>{
    const h3 = room.querySelector("h3")
    h3.innerText = `Room ${roomName} (${newCount})`
   addMessage(`${user}님이 입장하였습니다.`)
})

socket.on("bye",(left, newCount)=>{
    const h3 = room.querySelector("h3")
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${left}님이 퇴장하였습니다.`)
})

socket.on("new_message", addMessage)


socket.on("room_change", (rooms)=>{
    const roomList = welcom.querySelector("ul")
    if(room.length === 0){
        roomList.innerHTML=""
        return
    }
    rooms.forEach(room => {
        const li = document.createElement("li")
        li.innerText = room;
        roomList.append(li)
    });
})