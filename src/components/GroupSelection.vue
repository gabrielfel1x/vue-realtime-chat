<template>
  <div class="group-selection">
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
</script>
  
<style lang="scss" scoped>
$primary-color: #4d6a6d;
$secondary-color: #25d366;
$background-color: #ece5dd;
$text-color: #ffffff;
$font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

.group-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: $background-color;
  font-family: $font-family;

  h1 {
    color: $primary-color;
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
      background-color: $primary-color;
      color: $text-color;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 5px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: $secondary-color;
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
