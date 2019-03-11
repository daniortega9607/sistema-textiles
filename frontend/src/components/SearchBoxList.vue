<template>
  <div>
    <input
      :id="id"
      type="text"
      class="form-control"
      :value="search"
      @input="onChange"
      :required="required"
      :disabled="disabled"
    >
    <div class="search-list" v-if="!value">
      <div class="list-group">
        <div
          class="list-group-item p-2"
          @click="selectItem(item.id, item.value)"
          v-for="item in results"
          :key="'item-'+entity+'-'+item.id"
        >
          <b>{{item.value}}</b>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fetch } from "../utils";

export default {
  props: {
    id: { required: true },
    disabled: { default:false },
    entity: { required: true },
    required: { default: false },
    changeHandler: { required: true },
    currentValue: { default: "" }
  },
  data() {
    return {
      search: "",
      value: null,
      results: []
    };
  },
  async created() {
    if (this.currentValue) {
      let [err, item] = await fetch({
        url: `/api/${this.entity}/search`,
        params: { id: this.currentValue }
      });
      if (!err) {
        this.selectItem(item.id, item.value);
      }
    }
  },
  methods: {
    debounceHandler: _.debounce(function(callback, options) {
      this[callback](options);
    }, 600),
    onChange(e) {
      this.search = e.target.value;
      this.debounceHandler("getItems", this.search);
    },
    selectItem(id, value) {
      this.search = value;
      this.value = id;
      this.changeHandler(this.id, id);
    },
    async getItems(search) {
      const vm = this;
      this.value = null;
      this.results = [];
      if (!search) {
        this.changeHandler(this.id, null);
        return;
      }
      let [err, results] = await fetch({
        url: `/api/${this.entity}/search`,
        params: { search }
      });
      if (!err) {
        results.forEach(item => {
          item.onClick = vm.selectItem;
        });
        this.results = results;
      }
    }
  },
};
</script>
