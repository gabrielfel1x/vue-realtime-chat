<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <div class="form-inner">
        <h1>SignIn</h1>
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
$background-color: #dad3be;
$text-color: #254336;
$input-background-color: #333;
$button-background-color: #444;
$button-hover: #667;
$secondary-background-color: #6b8a7a;
$font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: $background-color;
  font-family: $font-family;

  .form-inner {
    background-color: $secondary-background-color;
    padding: 50px 30px;
    border-radius: 16px;
    box-shadow: 0px 6px 12px rgba(255, 255, 255, 0.02);
    width: 100%;
    max-width: 400px;
    text-align: center;

    h1 {
      color: $background-color;
      font-size: 28px;
      margin-bottom: 30px;
      font-weight: 600;
    }

    label {
      display: block;
      margin-bottom: 10px;
      color: $text-color;
      font-size: 16px;
      transition: 0.4s;
      text-align: left;
    }

    input[type="text"] {
      display: block;
      width: 100%;
      padding: 10px 15px;
      margin-bottom: 20px;
      border: 2px solid transparent;
      border-radius: 8px;
      background-color: $background-color;
      color: $text-color;
      font-size: 18px;
      transition: border-color 300ms ease;

      &:focus {
        border-color: #254336;
        outline: none;
      }
    }

    input[type="submit"] {
      background-color: $background-color;
      color: $text-color;
      font-size: 18px;
      font-weight: 700;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: $button-hover;
        color: $background-color;
      }
    }
  }
}
</style>
