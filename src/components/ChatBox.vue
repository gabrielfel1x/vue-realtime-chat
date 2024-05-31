<template>
  <div class="chat-box">
    <header>
      <h1>Welcome, {{ username }}</h1>
      <div>In group: {{ group }}</div>
      <div class="header-buttons">
        <button class="clear" @click="clearMessages">Clear Messages</button>
        <button class="logout" @click="logout">Logout</button>
      </div>
    </header>
    <section class="messages">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{
          message: true,
          'current-user': message.username === username,
        }"
      >
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>
    <footer>
      <form @submit.prevent="sendMessage">
        <input
          type="text"
          v-model="inputMessage"
          placeholder="Write a message..."
        />
        <input type="submit" value="Send" />
      </form>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
// @ts-ignore
import db from "../db";

const inputMessage = ref("");

interface Message {
  id: string;
  username: string;
  content: string;
}

const route = useRoute();
const router = useRouter();
const username = route.query.username as string;
const group = route.query.group as string;

const messages = ref<Message[]>([]);

function logout() {
  router.push({ name: "Login" });
}

function clearMessages() {
  if (group) {
    db.ref(`messages/${group}`)
      .remove()
      .then(() => {
        messages.value = [];
      })
      .catch((error: any) => {
        console.error("Error removing messages: ", error);
      });
  }
}

function sendMessage() {
  if (inputMessage.value.trim() !== "") {
    const message: Message = {
      id: Date.now().toString(),
      username,
      content: inputMessage.value.trim(),
    };
    db.ref(`messages/${group}`).push(message);
    inputMessage.value = "";
  }
}

function loadMessages(group: string) {
  const messagesRef = db.ref(`messages/${group}`);
  messagesRef.on("value", (snapshot: any) => {
    const data = snapshot.val();
    const msgs: Message[] = [];
    if (data) {
      Object.keys(data).forEach((key) => {
        msgs.push({
          id: key,
          username: data[key].username,
          content: data[key].content,
        });
      });
    }
    messages.value = msgs;
  });
}

onMounted(() => {
  if (group) {
    loadMessages(group);
  }
});
</script>

<style lang="scss" scoped>
$background-color: #dad3be;
$text-color: #fff;
$primary-button-color: #333;
$hover-button-color: #555;
$message-background: #444;
$message-hover: #667;
$secondary-background-color: #6b8a7a;
$font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

.chat-box {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $background-color;
  font-family: $font-family;

  header {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: $secondary-background-color;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    h1 {
      margin: 0;
      margin-bottom: 10px;
      font-size: 20px;
    }

    .header-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;

      button {
        background: none;
        border: 2px solid white;
        color: white;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 8px;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
          background-color: white;
          color: #4d6a6d;
        }
      }
    }
  }

  .messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .message {
      display: flex;
      align-items: flex-start;

      &.current-user {
        justify-content: flex-end;

        .message-inner {
          background-color: #6b8a7a;
          color: $text-color;
          text-align: right;
        }
      }

      .message-inner {
        max-width: 60%;
        padding: 10px 15px;
        border-radius: 10px;
        background-color: $message-background;
        color: $text-color;

        .username {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .content {
          white-space: pre-wrap;
        }
      }
    }
  }

  footer {
    padding: 20px;
    background-color: $secondary-background-color;
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);

    form {
      display: flex;
      align-items: center;
      gap: 10px;

      input[type="text"] {
        flex: 1;
        padding: 10px 15px;
        border: transparent;
        border-radius: 20px;
        background-color: $background-color;
        color: #254336;
        outline: none;
        font-size: 16px;
      }

      input[type="submit"] {
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        background-color: $text-color;
        color: #254336;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: #254336;
          color: $background-color;
        }
      }
    }
  }
}
</style>
