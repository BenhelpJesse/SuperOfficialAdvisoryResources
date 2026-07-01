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
const notifyBtn = document.getElementById("notifyBtn");

nicknameInput.value = localStorage.getItem("nickname") || "";
nicknameInput.addEventListener("change", () => {
    localStorage.setItem("nickname", nicknameInput.value);
});

// Request notification permission
notifyBtn.addEventListener("click", async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        notifyBtn.textContent = "🔔 Notifications Enabled";
        notifyBtn.disabled = true;
    }
});

// In-tab badge
let unreadCount = 0;
const originalTitle = document.title;

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        unreadCount = 0;
        document.title = originalTitle;
    }
});

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const text = messageInput.value.trim();
    if (text === "") return;
    const name = nicknameInput.value.trim() || "Anonymous";
    await addDoc(collection(db, "messages"), {
        name,
        text,
        createdAt: serverTimestamp()
    });
    messageInput.value = "";
}

let isFirstLoad = true;

const q = query(collection(db, "messages"), orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
        const m = doc.data();
        const div = document.createElement("div");
        div.className = "message";
        let time = "";
        if (m.createdAt) {
            time = new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], {
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

    // Don't notify on initial page load
    if (isFirstLoad) {
        isFirstLoad = false;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        return;
    }

    // Notify if tab is not focused
    if (document.visibilityState !== "visible") {
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        const m = lastDoc.data();
        unreadCount++;
        document.title = `(${unreadCount}) ${originalTitle}`;

        if (Notification.permission === "granted") {
            new Notification(`${m.name}`, {
                body: m.text,
                icon: "photos/testingphoto.jpg"
            });
        }
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});