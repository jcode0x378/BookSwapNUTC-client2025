<template>
  <div class="myMenu" id="myMenu">
    <ul>
      <li
        v-for="item in val"
        :key="item"
        :class="activeClass.value === item ? 'active' : ''"
        @mouseover="mouseover(item)"
      >
        <router-link to>
          <slot :name="item"></slot>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: ["val"],
  name: "MyMenu",
  setup(props, { emit }) {
    const activeClass = ref(1);

    const mouseover = (val) => {
      activeClass.value = val;
    };

    watch(activeClass, (val) => {
      emit("fromChild", val);
    });

    return {
      activeClass,
      mouseover
    };
  }
};
</script>

<style scoped>
#myMenu li {
  float: left;
  margin-left: 30px;
}

#myMenu a:hover {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}

#myMenu .active a {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}
</style>