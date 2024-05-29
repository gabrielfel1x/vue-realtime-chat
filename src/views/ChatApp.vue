<template>
  <div>
    <LoginForm v-if="!state.username" @onLogin="handleLogin" />
    <ChatBox
      v-else
      :username="state.username"
      :group="state.group"
      :messages="state.messages"
      @onLogout="handleLogout"
      @onClearMessages="handleClearMessages"
      @onSendMessage="handleSendMessage"
    />
  </div>
</template>
  
<script setup lang="ts">
import { reactive, onMounted } from "vue";
// @ts-ignore
import LoginForm from "../components/LoginForm.vue";
// @ts-ignore
import ChatBox from "../components/ChatBox.vue";
// @ts-ignore
import db from "../db";

interface Message {
  id: string;
  username: string;
  content: string;
}

interface State {
  username: string;
  group: string;
  messages: Message[];
}

const state = reactive<State>({
  username: "",
  group: "",
  messages: [],
});

function handleLogin({ username, group }: { username: string; group: string }) {
  state.username = username;
  state.group = group;
  loadMessages(group);
}

function handleLogout() {
  state.username = "";
  state.group = "";
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
  const message: Message = {
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
    const messages: Message[] = [];
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
  
  <style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>