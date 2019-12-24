<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <ChatView msg="Welcome to Your Chats" />
  </div>
</template>

<script>
// @ is an alias to /src
import ChatView from "@/components/ChatView.vue";

export default {
  name: "Chats",
  components: {
    ChatView
  }
};
</script>
