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
    <div class="card">
      <div class="card-body">
        <div class="card-title">
          <h2>Rollos</h2>
          <FormGenerator
            :item="{}"
            :updatedItem="roll"
            :fields="{
              yd_quantity: { display_name:'Cantidad (yd)', render_type: 'number'},
              quantity: { required:true, display_name:'Cantidad (m)', render_type: 'number' }
            }"
            :field_configs="{
              order:['yd_quantity','quantity']
            }"
            :submitHandler="rollSubmitHandler"
            :changeHandler="rollChangeHandler"
            :hideCancel="true"
          />
          <DataGrid
            v-if="entityItem({entity: entity.url, id: $route.params.id}).stocks.length"
            :items="entityItem({entity: entity.url, id: $route.params.id}).stocks"
            :fields="{
              id: { display_name:'ID' },
              quantity: { display_name:'Cantidad (m)', class:'text-right' },
              remaining_quantity: { display_name:'Cantidad Restante (m)', class:'text-right' },
            }"
            :field_configs="{ order:['id','quantity','remaining_quantity'] }"
            :showDeleteButton="true"
            :deleteHandler="rollDeleteHandler"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { getEntityInfo, isValidEntity } from "../utils/entities";
import { fetch } from "../utils";
import FormGenerator from "@/components/FormGenerator";
import DataGrid from "../components/DataGrid";
import NumberFormatter from '../utils/formatters/NumberFormatter';

export default {
  components: { FormGenerator, DataGrid },
  data() {
    return {
      is_saving: false,
      is_deleting: false,
      entity: null,
      item: { stocks:[] },
      roll: {
        yd_quantity: null,
        quantity: null
      }
    };
  },
  created() {
    this.setEntity('almacen');
  },
  methods: {
    async rollSubmitHandler() {
      if (this.is_saving) return;
      const quantity = NumberFormatter(this.roll.quantity);
      this.is_saving = true;
      let [err, res] = await fetch({
        url: `/api/stock_details`,
        data: { 
          quantity, 
          remaining_quantity: quantity,
          stock_id:this.entityItem({entity: this.entity.url, id: this.$route.params.id}).id,
        },
        method: "post"
      });
      if (err) {
        console.log(err);
      } else {
        PNotify.success("Registro guardado con exito");
      }
      this.is_saving = false;
      this.roll.yd_quantity = null;
      this.roll.quantity = null;
    },
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
    async rollDeleteHandler(id) {
      if (this.is_deleting) return;
      this.is_deleting = true;
      let [err] = await fetch({
        url: `/api/stock_details/${id}`,
        method: "delete"
      });
      if (err) {
        console.log(err);
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
    rollChangeHandler(field, value) {
      if (field == "yd_quantity") {
        this.roll.quantity = value * 0.9144;
      } else if (field == "quantity") {
        this.roll.yd_quantity = value * 1.09361;
      }
      this.roll[field] = value;
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
