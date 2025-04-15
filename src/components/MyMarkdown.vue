<template>
  <div id="my-markdown" class="markdown-body">
    <VueMarkdown :source="md"></VueMarkdown>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import VueMarkdown from 'vue-markdown';

const md = ref('');

onMounted(() => {
  // 從後端請求README.md
  axios
    .get('https://bookswapnutc-server.zeabur.app/public/docs/README.md')
    .then(res => {
      md.value = res.data;
    })
    .catch(err => {
      console.error(err);
    });
});
</script>

<style>
@import "../assets/css/github-markdown.css";
.markdown-body {
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 40px;
}
</style>