<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <div class="form-inner">
        <h1>Login</h1>
        <label for="username">Username</label>
        <input
          v-model="inputUsername"
          type="text"
          placeholder="Type your name..."
        />
        <input type="submit" value="Login" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const inputUsername = ref("");
const router = useRouter();

function login() {
  if (inputUsername.value) {
    router.push({
      name: "GroupSelection",
      query: { username: inputUsername.value },
    });
    inputUsername.value = "";
  }
}
</script>


<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .form-inner {
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
    select,
    input {
      display: block;
      width: 100%;
      padding: 10px 15px;
      margin-bottom: 15px;
      border: none;
      border-radius: 8px;
    }

    input[type="submit"] {
      background-color: #4d6a6d;
      color: #fff;
      font-size: 18px;
      font-weight: 700;
    }

    input[type="text"],
    select {
      background-color: #f3f3f3;
      color: #333;
      font-size: 18px;
    }
  }
}
</style>