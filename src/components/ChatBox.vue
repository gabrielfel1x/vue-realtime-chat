<template>
  <div class="chat-box">
    <header>
      <button class="mr-auto mb-4" @click="returnGroup">Return</button>
      <h1>Welcome, {{ username }}</h1>
      <div>In group: {{ group }}</div>
      <div class="header-buttons">
        <button class="clear" @click="clearMessages">Clear Messages</button>
        <button class="logout" @click="logout">Logout</button>
      </div>
    </header>
    <section class="messages" ref="messagesContainer" @scroll="handleScroll">
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
    <button
      v-show="!isAtBottom"
      class="scroll-to-bottom"
      @click="scrollToBottom"
    >
      ↓
    </button>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
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
const username = ref<string | null>(null);
const group = ref<string | null>(null);

const messages = ref<Message[]>([]);
const messagesContainer = ref<HTMLElement | null>(null);
const isAtBottom = ref(true);

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: "smooth",
    });
  }
}

function handleScroll() {
  if (messagesContainer.value) {
    const threshold = 10;
    const position =
      messagesContainer.value.scrollTop + messagesContainer.value.clientHeight;
    const height = messagesContainer.value.scrollHeight;
    isAtBottom.value = height - position < threshold;
  }
}

function logout() {
  router.push({ name: "Login" });
}

function clearMessages() {
  if (group.value) {
    db.ref(`messages/${group.value}`)
      .remove()
      .then(() => {
        messages.value = [];
        scrollToBottom();
      })
      .catch((error: any) => {
        console.error("Error removing messages: ", error);
      });
  }
}

function returnGroup() {
  const username = route.query.username as string;
  if (username) {
    router.push({ name: "GroupSelection", query: { username } });
  } else {
    router.push({ name: "Login" });
  }
}

function sendMessage() {
  if (inputMessage.value.trim() !== "") {
    if (!username.value) {
      console.error("Username is undefined");
      return;
    }
    const message: Message = {
      id: Date.now().toString(),
      username: username.value,
      content: inputMessage.value.trim(),
    };
    db.ref(`messages/${group.value}`)
      .push(message)
      .catch((error: any) => {
        console.error("Error sending message: ", error);
      });
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
    scrollToBottom();
  });
}

function initializeChat() {
  username.value = route.query.username as string | null;
  group.value = route.query.group as string | null;

  if (!username.value) {
    console.error("Username is undefined");
    router.push({ name: "Login" });
    return;
  }

  if (group.value) {
    loadMessages(group.value);
  }
}

onMounted(() => {
  initializeChat();
});

watch(route, () => {
  initializeChat();
});

watch(messages, () => {
  scrollToBottom();
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
    }
  }
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

  .scroll-to-bottom {
    position: fixed;
    bottom: 100px;
    right: 50%;
    background-color: $secondary-background-color;
    color: $text-color;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    padding-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;

    &:hover {
      background-color: $hover-button-color;
    }
  }
}
</style>
