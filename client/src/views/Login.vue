<template>
  <div>
    <LoginForm />
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from "@/components/forms/LoginForm";

export default {
  name: "login",
  components: {
    LoginForm
  }
};
</script>
