<template>
  <form autocomplete="off" @submit.prevent="()=>{}">
    <div class="form-group">
      <div class="input-group">
        <input
          id="search"
          type="text"
          class="form-control"
          placeholder="Buscar..."
          :value="search"
          @keyup="onChange"
        >
      </div>
    </div>
  </form>
</template>
<script>
export default {
  props: {
    changeHandler: { required: true },
    search: { default: "" }
  },
  methods: {
    onChange(e) {
      this.changeHandler(e.target.value);
    }
  }
};
</script>
