<template>
  <ul class="chatbox__contacts" v-if="friends.length > 0">
    <li
      class="chatbox__contact"
      v-for="(friend, friendIndex) in friends"
      :key="friendIndex"
      :class="friendIndex === selected ? 'chatbox__contact--selected' : ''"
      @click="$emit('selected', friendIndex)"
    >
      <v-avatar>
        <v-img
          :src="friend.profilePicUrl ? friend.profilePicUrl : placeholderSrc"
        />
      </v-avatar>
      <div class="chatbox__onlineIndicator" v-if="friendIndex &lt; 3"></div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.chatbox__contacts {
  display: inline-block;
  height: 100%;
  width: 175px;
  padding: 10px;
  border-left: 1px solid #f2f2f2;
  overflow-y: auto;
  overflow-x: hidden;
}

.darkMode .chatbox__contacts {
  border-color: #444;
}

.chatbox__contact {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 5px;
  height: 55px;
  width: 55px;
  border-radius: 40px;
  cursor: pointer;
  border: 2px solid #fff;
  background-size: cover;
  background-position: center;
  background-color: #e6e6e6;
  transition-duration: 0.1s;
}
.chatbox__contact:hover {
  box-shadow: 0 0 0 2px #eee;
}
.chatbox__contact--selected {
  box-shadow: 0 0 0 2px #09f !important;
}
.darkMode .chatbox__contact {
  border-color: #444;
}

.chatbox__onlineIndicator {
  position: absolute;
  width: 16px;
  height: 16px;
  right: 0;
  display: none;
  bottom: 0;
  background-color: #2de58d;
  border-radius: 50px;
  border: 2px solid #fff;
}
</style>

<script>
export default {
  name: "Contacts",
  props: {
    friends: Array,
    selected: Number
  },
  computed: {
    placeholderSrc() {
      return require("@/assets/user-placeholder.jpg");
    }
  }
};
</script>

/* :style="{ 'background-image': 'url(' + friend.profilePicUrl ?
friend.profilePicUrl : placeholderSrc + ')' }" */
