<template>
  <div class="group-selection">
    <button class="back-button" @click="goBack">Back</button>
    <h1>Select a Group</h1>
    <ul>
      <li
        v-for="group in props.groups"
        :key="group"
        @click="selectGroup(group)"
      >
        {{ group }}
      </li>
    </ul>
  </div>
</template>
  
<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps<{ groups: string[] }>();
const router = useRouter();
const route = useRoute();

function selectGroup(group: string) {
  const username = route.query.username as string;
  router.push({ name: "ChatBox", query: { username, group } });
}

function goBack() {
  router.push({ name: "Login" });
}
</script>

<style lang="scss" scoped>
$background-color: #dad3be;
$text-color: #fff;
$primary-button-color: #333;
$hover-button-color: #555;
$list-item-background: #444;
$list-item-hover: #667;
$secondary-background-color: #6b8a7a;
$font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

.group-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: $background-color;
  font-family: $font-family;
  position: relative;

  .back-button {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: $secondary-background-color;
    color: $text-color;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
      background-color: $hover-button-color;
    }
  }

  h1 {
    color: #254336;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
  }

  ul {
    list-style-type: none;
    padding: 0;
    width: 90%;
    max-width: 400px;

    li {
      background-color: $secondary-background-color;
      color: $text-color;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: $list-item-hover;
      }
    }
  }
}

@media (max-width: 768px) {
  .group-selection {
    ul {
      li {
        padding: 10px;
        font-size: 16px;
      }
    }
  }
}
</style>

