import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const nicknameInput = document.getElementById("nickname");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");

nicknameInput.value =
    localStorage.getItem("nickname") || "";

nicknameInput.addEventListener("change", () => {
    localStorage.setItem(
        "nickname",
        nicknameInput.value
    );
});

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter")
        sendMessage();
});

async function sendMessage() {

    const text = messageInput.value.trim();

    if (text === "") return;

    const name =
        nicknameInput.value.trim() || "Anonymous";

    await addDoc(collection(db, "messages"), {

        name,

        text,

        createdAt: serverTimestamp()

    });

    messageInput.value = "";
}

const q = query(
    collection(db, "messages"),
    orderBy("createdAt")
);

onSnapshot(q, (snapshot) => {

    messagesDiv.innerHTML = "";

    snapshot.forEach(doc => {

        const m = doc.data();

        const div = document.createElement("div");

        div.className = "message";

        let time = "";

        if (m.createdAt) {

            time = new Date(
                m.createdAt.seconds * 1000
            ).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
            });

        }

        div.innerHTML = `
            <div>
                <span class="name">${m.name}</span>
                <span class="time">${time}</span>
            </div>

            <div class="text">${m.text}</div>
        `;

        messagesDiv.appendChild(div);

    });

    messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

});