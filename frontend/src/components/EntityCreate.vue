<template>
  <div
    class="container-fluid"
    v-if="entity"
  >
    <div class="card">
      <div class="card-body">
        <div class="card-title">
          <h2>{{entity.display_single_name}}</h2>
        </div>
        <FormGenerator
          :item="{}"
          :updatedItem="item"
          :fields="entity.fields"
          :field_configs="entity.field_configurations.form"
          :submitHandler="submitHandler"
          :changeHandler="changeHandler"
          :saving="is_saving"
          :cancel="() => $router.go(-1)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { getEntityInfo, isValidEntity } from "../utils/entities";
import { fetch } from "../utils";
import FormGenerator from "./FormGenerator";

export default {
  components: { FormGenerator },
  data() {
    return {
      is_saving: false,
      is_deleting: false,
      entity: null,
      item: {}
    };
  },
  created() {
    this.setEntity(this.$route.params.entity);
  },
  methods: {
    async submitHandler() {
      if (this.is_saving) return;
      this.is_saving = true;
      let [err, res] = await fetch({
        url: `/api/${this.entity.url}`,
        data: this.item,
        method: "post"
      });
      if (err) {
        console.log(err);
      } else {
        PNotify.success("Registro guardado con exito");
        this.$router.push(`/${this.$route.params.entity}/lista/${res.data.id}`)
      }
      this.is_saving = false;
    },
    async deleteHandler(id) {
      if (this.is_deleting) return;
      this.is_deleting = true;
      let [err] = await fetch({
        url: `/api/${this.entity.url}/${id}`,
        method: "delete"
      });
      if (err) {
        console.log(err);
      } else {
        this.$router.go(-1);
      }
      this.is_deleting = false;
    },
    changeHandler(field, value) {
        this.item[field] = value;
    },
    setEntity(entity) {
      if (!isValidEntity(entity)) {
        return this.$router.replace("/");
      }
      this.entity = getEntityInfo(entity);
    }
  }
};
</script>
