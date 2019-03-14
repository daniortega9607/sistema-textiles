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
          <h4>Envios</h4>
        </div>
        <DataGrid
          v-if="entityItem({entity: entity.url, id: $route.params.id}).stocks.length"
          :items="entityItem({entity: entity.url, id: $route.params.id}).stocks"
          :fields="{
                id: { display_name:'ID' },
                'stock_detail.stock.product': { display_name:'Product', formatter: Product },
                'stock_detail.remaining_quantity': { display_name:'Cantidad (m)', class:'text-right' }
              }"
          :field_configs="{ order:['id','stock_detail.stock.product','stock_detail.remaining_quantity'] }"
          :showDeleteButton="true"
          :clickHandler="() => {}"
          :deleteHandler="rollDeleteHandler"
        />
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
import NumberFormatter from "../utils/formatters/NumberFormatter";
import Product from '../utils/formatters/Product';

export default {
  components: { FormGenerator, DataGrid },
  data() {
    return {
      Product,
      is_saving: false,
      is_deleting: false,
      entity: null,
      item: { stocks: [] },
      roll: {
        yd_quantity: null,
        quantity: null
      }
    };
  },
  created() {
    this.setEntity("movimientos-almacen");
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
    async rollDeleteHandler(id) {
      if (this.is_deleting) return;
      this.is_deleting = true;
      let [err] = await fetch({
        url: `/api/stock_movement_details/${id}`,
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
