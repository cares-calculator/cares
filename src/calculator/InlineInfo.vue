<template>
<div>
  <div style="display: inline">
    <slot name="title"></slot>
    <span class="inline-info-i"  @click="shown = !shown">
      ⓘ
    </span>
  </div>
  <transition name="expand">
    <div v-if="shown" class="inline-info-style">
      <slot></slot>
    </div>
  </transition>
</div>
</template>
<script>
export default {
  data: function () {
    return {
      shown: false,
    }
  }
}
</script>
