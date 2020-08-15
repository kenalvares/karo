<template>
  <div
    style="position: absolute; bottom: 0; width: 100%; background-color: rgba(0,0,0,0.5);"
  >
    <v-btn block text @click="showUploader()">
      <v-icon>publish</v-icon>
    </v-btn>
  </div>
</template>

<script>
/*eslint-disable no-console*/
export default {
  name: "CloudinaryUploader",
  props: {
    cloudName: String,
    uploadPreset: String,
    sources: Array,
    showAdvancedOptions: Boolean,
    cropping: Boolean,
    multiple: Boolean,
    defaultSource: String
  },
  mounted() {
    let cloudinaryScript = document.createElement("script");
    cloudinaryScript.setAttribute(
      "src",
      "https://widget.cloudinary.com/v2.0/global/all.js"
    );
    document.head.appendChild(cloudinaryScript);
  },
  methods: {
    showUploader() {
      let uploader = window.cloudinary.openUploadWidget(
        {
          cloudName: "karo",
          uploadPreset: "karo_unsigned",
          sources: ["local", "url"],
          showAdvancedOptions: false,
          cropping: true,
          multiple: false,
          defaultSource: "local"
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            this.$emit("completed", result.info);
          }
        }
      );
      uploader.open();
    }
  }
};
</script>
