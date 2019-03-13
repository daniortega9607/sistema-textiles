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
    <div class="row">
      <div
        class="col-md-6"
        v-if="entityItems({ entity: 'stocks', params:{ office: {id:item.office_id} } }).length"
      >
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              <h2>
                Desde: {{
                entityItems({ entity: 'stocks', params:{ office: {id:item.office_id} } })[0].office.name
                }}
              </h2>
            </div>
            <SearchBox
              :changeHandler="value => debounceHandler('searchHandler', {key:'from_office_search', search:value})"
              :search="from_office_search"
            />
            <div id="from-office">
              <div
                class="card"
                v-for="stock in entityItems({ 
                  entity: 'stocks', 
                  params:{ 
                    search: from_office_search,
                    keys: ['id', 'office.name','product.sku', 'product.fabric.name', 'product.design.name', 'product.color', 'stock'],
                    office: {id:item.office_id} 
                  } 
                })"
                :key="'from-office-'+stock.id"
              >
                <div class="card-header" :id="'from-office-'+stock.id">
                  <h5 class="mb-0">
                    <Product
                      :value="stock.product"
                      :data-toggle="'collapse'"
                      :data-target="'#from-office-stock-'+stock.id"
                      :aria-expanded="true"
                      :aria-controls="'from-office-stock-'+stock.id"
                    />
                  </h5>
                </div>
                <div
                  :id="'from-office-stock-'+stock.id"
                  class="collapse"
                  :aria-labelledby="'from-office-'+stock.id"
                  data-parent="#from-office"
                >
                  <div class="card-body">
                    <DataGrid
                      v-if="stock.stocks.length"
                      :items="stock.stocks"
                      :fields="{
                        id: { display_name:'ID' },
                        remaining_quantity: { display_name:'Cantidad Restante (m)', class:'text-right' }
                      }"
                      :field_configs="{ order:['id','remaining_quantity'] }"
                      :showDeleteButton="false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-md-6"
        v-if="entityItems({ entity: 'stocks', params:{ office: {id:item.to_office_id} } }).length"
      >
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              <h2>
                Hacia: {{
                entityItems({ entity: 'stocks', params:{ office: {id:item.to_office_id} } })[0].office.name
                }}
              </h2>
            </div>
            <SearchBox
              :changeHandler="value => debounceHandler('searchHandler', {key:'to_office_search', search:value})"
              :search="to_office_search"
            />
            <div id="to-office">
              <div
                class="card"
                v-for="stock in entityItems({ 
                  entity: 'stocks',
                  params:{ 
                    search: to_office_search,
                    keys: ['id', 'office.name','product.sku', 'product.fabric.name', 'product.design.name', 'product.color', 'stock'],
                    office: {id:item.to_office_id} 
                  } 
                })"
                :key="'to-office-'+stock.id"
              >
                <div class="card-header" :id="'to-office-'+stock.id">
                  <h5 class="mb-0">
                    <Product
                      :value="stock.product"
                      :data-toggle="'collapse'"
                      :data-target="'#to-office-stock-'+stock.id"
                      :aria-expanded="true"
                      :aria-controls="'to-office-stock-'+stock.id"
                    />
                  </h5>
                </div>
                <div
                  :id="'to-office-stock-'+stock.id"
                  class="collapse"
                  :aria-labelledby="'to-office-'+stock.id"
                  data-parent="#to-office"
                >
                  <div class="card-body">
                    <DataGrid
                      v-if="stock.stocks.length"
                      :items="stock.stocks"
                      :fields="{
                        id: { display_name:'ID' },
                        remaining_quantity: { display_name:'Cantidad Restante (m)', class:'text-right' }
                      }"
                      :field_configs="{ order:['id','remaining_quantity'] }"
                      :showDeleteButton="false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { getEntityInfo, isValidEntity } from "../utils/entities";
import { fetch } from "../utils";
import FormGenerator from "@/components/FormGenerator";
import NumberFormatter from "../utils/formatters/NumberFormatter";
import DataGrid from "../components/DataGrid";
import SearchBox from "../components/SearchBox";
import Product from "../utils/formatters/Product";

export default {
  components: { FormGenerator, DataGrid, Product, SearchBox },
  data() {
    return {
      is_saving: false,
      is_deleting: false,
      entity: null,
      item: { office_id: null, to_office_id: null },
      roll: {
        yd_quantity: null,
        quantity: null
      },
      from_office_search: null,
      to_office_search: null,
    };
  },
  created() {
    this.setEntity("movimientos-almacen");
  },
  computed: {
    ...mapGetters("entities", ["entityItems"]),
    ...mapState("app", ["selectedOffice"])
  },
  methods: {
    debounceHandler: _.debounce(function(callback, options) {
      this[callback](options);
    }, 600),
    searchHandler({key, search}) {
      this[key] = search;
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
        this.$router.replace(`/almacen/lista/${res.data.id}`);
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
      this.item.office_id = this.selectedOffice.id;
    }
  }
};
</script>
