<template>
  <div class="container-fluid" v-if="entity">
    <div class="card">
      <div class="card-body">
        <div class="card-title">
          <h2>
            {{entity.display_name}}
            <div class="float-right btn-group" v-if="entity.field_configurations.list.showCreateButton">
              <router-link to="crear" class="btn btn-success btn-sm" append>
                <i class="fas fa-plus"></i>
              </router-link>
            </div>
          </h2>
          <SearchBox
            :changeHandler="value => debounceHandler('searchHandler', value)"
            :search="params.search"
          />
          <DataGrid
            :items="entityItems({ entity: entity.url, params:{...params, office: selectedOffice} })"
            :fields="entity.fields"
            :field_configs="entity.field_configurations.list"
            :showEditButton="entity.field_configurations.list.showEditButton"
            :showDeleteButton="entity.field_configurations.list.showDeleteButton"
            :deleteHandler="deleteHandler"
            :deleting="deleting_id"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { getEntityInfo, isValidEntity } from "../utils/entities";
import DataGrid from "./DataGrid";
import SearchBox from "./SearchBox";
import { fetch } from '../utils';

export default {
  components: {
    DataGrid,
    SearchBox
  },
  data() {
    return {
      params: { keys: [], search: "" },
      is_deleting: false,
      deleting_id: null,
      entity: null
    };
  },
  created() {
    this.setEntity(this.$route.params.entity);
  },
  methods: {
    async deleteHandler(id) {
      if (this.is_deleting) return;
      this.is_deleting = true;
      this.deleting_id = id;
      let [err] = await fetch({ url: `/api/${this.entity.url}/${id}`, method: 'delete' });
      if (err) {
        console.log(err)
      }
      this.is_deleting = false;
    },
    debounceHandler: _.debounce(function(callback, options) {
      this[callback](options);
    }, 600),
    searchHandler(search) {
      this.params.search = search;
    },
    setEntity(entity) {
      if (!isValidEntity(entity)) {
        return this.$router.replace("/");
      }
      this.entity = getEntityInfo(entity);
      this.deleting_id = null;
      this.params.keys = this.entity.field_configurations.list.order;
      this.params.search = "";
    }
  },
  computed: {
    ...mapGetters("entities", ["entityItems"]),
    ...mapState("app", ["selectedOffice"]),

  },
  watch: {
    "$route.params.entity"(entity) {
      this.setEntity(entity);
    }
  }
};
</script>
