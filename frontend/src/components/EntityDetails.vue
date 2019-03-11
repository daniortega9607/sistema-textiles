<template>
  <div
    class="container-fluid"
    v-if="entity && entityItem({entity: entity.url, id: $route.params.id})"
  >
    <div class="card">
      <div class="card-body">
        <div class="card-title">
          <h2>{{entity.display_single_name}} #{{entityItem({entity: entity.url, id: $route.params.id}).id}}</h2>
          <small
            class="text-muted"
            v-if="entityItem({entity: entity.url, id: $route.params.id}).updated_at"
          >Ultima modificación: {{entityItem({entity: entity.url, id: $route.params.id}).updated_at}}</small>
        </div>
        <FormGenerator
          :item="entityItem({entity: entity.url, id: $route.params.id})"
          :updatedItem="item"
          :isUpdate="true"
          :fields="entity.fields"
          :field_configs="entity.field_configurations.form"
          :showDeleteButton="entity.field_configurations.form.showDeleteButton"
          :submitHandler="submitHandler"
          :changeHandler="changeHandler"
          :deleteHandler="deleteHandler"
          :saving="is_saving"
          :deleting="is_deleting"
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
      Object.keys(this.item).forEach(key =>
        this.item[key] ==
        this.entityItem({ entity: this.entity.url, id: this.$route.params.id })[
          key
        ]
          ? delete this.item[key]
          : ""
      );
      if (!Object.keys(this.item).length) {
        return PNotify.info("No hay ningun cambio a guardar");
      }
      this.is_saving = true;
      let [err] = await fetch({
        url: `/api/${this.entity.url}/${this.$route.params.id}`,
        data: this.item,
        method: "put"
      });
      if (err) {
        console.log(err);
      } else {
        PNotify.success("Registro guardado con exito");
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
      if (
        this.entityItem({ entity: this.entity.url, id: this.$route.params.id })[
          field
        ] != value
      ) {
        this.item[field] = value;
      } else {
        delete this.item[field];
      }
    },
    setEntity(entity) {
      if (!isValidEntity(entity)) {
        return this.$router.replace("/");
      }
      this.entity = getEntityInfo(entity);
    }
  },
  computed: {
    ...mapGetters("entities", ["entityItem"])
  }
};
</script>
