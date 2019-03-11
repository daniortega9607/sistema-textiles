<template>
  <div class="container-fluid" v-if="entity">
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
            v-if="item.stocks.length"
            :items="item.stocks"
            :fields="{
              id: { display_name:'ID' },
              quantity: { display_name:'Cantidad (m)' }
            }"
            :field_configs="{ order:['id','quantity'] }"
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
import NumberFormatter from "../utils/formatters/NumberFormatter";
import DataGrid from "../components/DataGrid";

export default {
  components: { FormGenerator, DataGrid },
  data() {
    return {
      is_saving: false,
      is_deleting: false,
      entity: null,
      item: { stocks: [], stock: null },
      roll: {
        yd_quantity: null,
        quantity: null
      }
    };
  },
  created() {
    this.setEntity("almacen");
  },
  methods: {
    rollSubmitHandler() {
      const quantity = NumberFormatter(this.roll.quantity);
      this.item.stocks.push({
        quantity,
        remaining_quantity: quantity,
        id: this.item.stocks.length + 1
      });
      this.item.stock += parseFloat(quantity);
      this.roll.yd_quantity = null;
      this.roll.quantity = null;
    },
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
        this.$router.push(`/almacen/lista/${res.data.id}`);
      }
      this.is_saving = false;
    },
    rollDeleteHandler(id) {
      const index = this.item.stocks.findIndex(item => item.id == id);
      if(index !== -1) {
        this.item.stock -= parseFloat(this.item.stocks[index].quantity);
        this.item.stocks.splice(index, 1);
      }
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
  }
};
</script>
