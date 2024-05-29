<template>
  <div class="chat-box">
    <header>
      <h1>Welcome, {{ username }} in {{ group }}</h1>
      <div class="header-buttons ml-4">
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
import { ref } from "vue";

const inputMessage = ref("");

interface Message {
  id: string;
  username: string;
  content: string;
}

defineProps<{
  username: string;
  group: string;
  messages: Message[];
}>();

const emit = defineEmits(["onLogout", "onClearMessages", "onSendMessage"]);

function logout() {
  emit("onLogout");
}

function clearMessages() {
  emit("onClearMessages");
}

function sendMessage() {
  if (inputMessage.value.trim() !== "") {
    emit("onSendMessage", inputMessage.value.trim());
    inputMessage.value = "";
  }
}
</script>

<style lang="scss" scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #4d6a6d;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    h1 {
      margin: 0;
      font-size: 24px;
    }

    .header-buttons {
      display: flex;
      gap: 10px;

      button {
        background: none;
        border: 2px solid white;
        color: white;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 5px;
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
          background-color: #4d6a6d;
          color: white;
          text-align: right;
        }
      }

      .message-inner {
        max-width: 60%;
        padding: 10px 15px;
        border-radius: 10px;
        background-color: #e0e0e0;

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
    background-color: white;
    box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);

    form {
      display: flex;
      align-items: center;
      gap: 10px;

      input[type="text"] {
        flex: 1;
        padding: 10px 15px;
        border: 2px solid #ddd;
        border-radius: 20px;
        outline: none;
        font-size: 16px;
      }

      input[type="submit"] {
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        background-color: #4d6a6d;
        color: white;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: #3a5252;
        }
      }
    }
  }
}
</style>