<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
// @ts-ignore
import db from "./db";

const state = reactive({
  username: "",
  group: "",
  messages: [] as { id: string; username: string; content: string }[],
});

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
