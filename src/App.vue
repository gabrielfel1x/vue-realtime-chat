<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import db from "./db";

const state = reactive({
  username: "",
  group: "",
  messages: [] as { id: string; username: string; content: string }[],
});

function handleLogin(username: string) {
  state.username = username;
}

function handleGroupSelect(group: string) {
  state.group = group;
  loadMessages(group);
}

function handleLogout() {
  state.username = "";
  state.group = "";
  state.messages = [];
}

function handleClearMessages() {
  if (state.group) {
    db.ref(`messages/${state.group}`)
      .remove()
      .then(() => {
        state.messages = [];
      })
      .catch((error: any) => {
        console.error("Error removing messages: ", error);
      });
  }
}

function handleSendMessage(content: string) {
  const message = {
    id: Date.now().toString(),
    username: state.username,
    content,
  };
  db.ref(`messages/${state.group}`).push(message);
}

function loadMessages(group: string) {
  const messagesRef = db.ref(`messages/${group}`);
  messagesRef.on("value", (snapshot: any) => {
    const data = snapshot.val();
    const messages: { id: string; username: string; content: string }[] = [];
    if (data) {
      Object.keys(data).forEach((key) => {
        messages.push({
          id: key,
          username: data[key].username,
          content: data[key].content,
        });
      });
    }
    state.messages = messages;
  });
}

onMounted(() => {
  if (state.group) {
    loadMessages(state.group);
  }
});
</script>
