<template>
  <div>
    <SignUpForm />
  </div>
</template>

<script>
// @ is an alias to /src
import SignUpForm from "@/components/forms/SignUpForm.vue";

export default {
  name: "signup",
  components: {
    SignUpForm
  }
};
</script>
