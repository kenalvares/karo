<!-- Placeholder-->
<!-- Displays simple placeholder for dev purposes -->
<template>
  <div class="placeholder--body">
    <img alt="Karo" src="../../assets/logo.png" class="logo" />
    <h1>Welcome to your {{ page }}!</h1>
    <p>This page allows you to access your {{ page }}.</p>
  </div>
</template>

<script>
export default {
  name: "Placeholder",
  props: {
    page: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

.placeholder--body {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.logo {
  width: 100px;
}
</style>
