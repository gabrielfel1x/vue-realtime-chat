<template>
  <div
    class="h-screen flex flex-col items-center justify-center"
    v-if="state.username === '' || state.username === null"
  >
    <form @submit.prevent="login">
      <div
        class="p-24 flex flex-col justify-center gap-4 bg-primary text-gray-700 rounded-xl shadow-2xl"
      >
        <h1 class="font-semibold text-4xl">Login</h1>
        <label for="username" class="">Username</label>
        <input
          v-model="inputUsername"
          type="text"
          placeholder="type your name..."
          class="border-none outline-none p-2 rounded-lg bg-transparent"
        />
        <input
          type="submit"
          value="Login"
          class="rounded-lg p-2 bg-secondary text-white shadow-2xl"
        />
      </div>
    </form>
  </div>

  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="logout">Logout</button>
      <button class="text-white font-bold" @click="clearMessages">
        Clear Messages
      </button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>

    <section class="chat-box">
      <div
        v-for="message in state.messages"
        :key="message.id"
        :class="
          message.username == state.username
            ? 'message current-user'
            : 'message'
        "
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
import { ref, reactive, onMounted } from "vue";
// @ts-ignore
import db from "../db";

interface State {
  username: string;
  messages: Array<{ id: string; username: string; content: string }>;
}

const inputUsername = ref<string>("");
const inputMessage = ref<string>("");

const state = reactive<State>({
  username: "",
  messages: [],
});

function login(): void {
  if (inputUsername.value) {
    state.username = inputUsername.value;
    inputUsername.value = "";
  }
}

function logout(): void {
  state.username = "";
}

function clearMessages(): void {
  db.ref("messages")
    .remove()
    .then(() => {
      state.messages = [];
    })
    .catch((error: Error) => {
      console.error("Error removing messages: ", error);
    });
}

function sendMessage(): void {
  if (!inputMessage.value) return;

  const message = {
    username: state.username,
    content: inputMessage.value,
  };

  db.ref("messages").push(message);
  inputMessage.value = "";
}

onMounted(() => {
  const messagesRef = db.ref("messages");

  messagesRef.on("value", (snapshot: any) => {
    const data = snapshot.val();
    const messages: Array<{ id: string; username: string; content: string }> =
      [];

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
});
</script>

<style lang="scss">
.view {
  display: flex;
  justify-content: center;
  min-height: 100vh;

  &.login {
    align-items: center;
    .login-form {
      display: block;
      width: 100%;
      padding: 15px;

      .form-inner {
        display: block;
        background-color: #fff;
        padding: 50px 15px;
        border-radius: 16px;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);

        h1 {
          color: #aaa;
          font-size: 28px;
          margin-bottom: 30px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #aaa;
          font-size: 16px;
          transition: 0.4s;
        }

        input[type="text"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;

          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;

          color: #333;
          font-size: 18px;

          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;

          transition: 0.4s;

          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;

          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #4d6a6d;
          border-radius: 8px;

          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }

        &:focus-within {
          label {
            color: #4d6a6d;
          }

          input[type="text"] {
            background-color: #fff;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

            &::placeholder {
              color: #777;
            }
          }
        }
      }
    }
  }

  &.chat {
    flex-direction: column;

    header {
      position: relative;
      display: block;
      width: 100%;
      padding: 50px 30px 10px;

      .logout {
        position: absolute;
        top: 15px;
        right: 15px;
        appearance: none;
        border: none;
        outline: none;
        background: none;

        color: #fff;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: right;
      }

      h1 {
        color: #fff;
      }
    }

    .chat-box {
      border-radius: 24px 24px 0px 0px;
      background-color: #fff;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      flex: 1 1 100%;
      padding: 30px;

      .message {
        display: flex;
        margin-bottom: 15px;

        .message-inner {
          .username {
            color: #888;
            font-size: 16px;
            margin-bottom: 5px;
            padding-left: 15px;
            padding-right: 15px;
          }

          .content {
            display: inline-block;
            padding: 10px 20px;
            background-color: #f3f3f3;
            border-radius: 999px;

            color: #333;
            font-size: 18px;
            line-height: 1.2em;
            text-align: left;
          }
        }

        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;

          .message-inner {
            max-width: 75%;

            .content {
              background-color: #4d6a6d;
              color: #fff;
              font-weight: 600;
            }
          }
        }
      }
    }

    footer {
      position: sticky;
      bottom: 0px;
      background-color: #fff;
      padding: 30px;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);

      form {
        display: flex;

        input[type="text"] {
          flex: 1 1 100%;

          appearance: none;
          border: none;
          outline: none;
          background: none;

          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px 0px 0px 8px;

          color: #333;
          font-size: 18px;

          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;

          transition: 0.4s;

          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;

          display: block;
          padding: 10px 15px;
          border-radius: 0px 8px 8px 0px;

          background-color: #4d6a6d;

          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>