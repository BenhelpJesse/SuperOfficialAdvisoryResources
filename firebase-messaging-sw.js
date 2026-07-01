importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD8O_453riLo46RGx42C68RlHIxVIDZ4iY",
  authDomain: "community-chat-66170.firebaseapp.com",
  projectId: "community-chat-66170",
  storageBucket: "community-chat-66170.firebasestorage.app",
  messagingSenderId: "221123230077",
  appId: "1:221123230077:web:34c4e61afa2db6bf4b7414"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/SuperOfficialAdvisoryResources/photos/testingphoto.jpg"
  });
});