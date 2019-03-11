import { mapState, mapActions } from 'vuex';
import { fetch } from "../utils";
import FormGenerator from "../components/Form/FormGenerator";

const Settings = {
  async created() {
    const entity = 'ajustes';
    await this.setLocalEntityInfo(entity);
  },
  data() {
    return {
      retries: 3,
      fields: [],
      item: {},
      primary_field: null,
      display_name: null,
      url: null,
      saving: false,
      error: {}
    }
  },
  methods: {
    async onSubmitHandler() {
      if (this.saving) return;
      this.saving = true;
      let [err, res] = await fetch({
        url: `/api${this.url}/${this.user.id}/settings`,
        method: "put",
        data: this.item
      });
      this.saving = false;
      if (!err) {
        this.setState({ user: {...this.user, name:this.item.name, email:this.item.email} });
      } else if(err.response){
        this.error = err.response.data.error;
        if(err.response.status == 401){
          this.retries--;
          if(this.retries < 1){
            this.logout({ callback: this.redirectToLogin });
          } else {
            PNotify.notice('Intentos Restantes: '+this.retries);
          }
        }
      }
    },
    onChangeHandler(id, val) {
      this.error = {};
      this.item[id] = val;
    },
    getFormFields() {
      const fields = [];
      const vm = this;
      this.fields.forEach(field => {
        fields.push({
          ...field,
          value:
            vm.item[field.id] ? vm.item[field.id] : field.default,
          onChange: vm.onChangeHandler
        });
      });
      return fields;
    },
    generateItem(model) {
      const item = {};
      const vm = this;
      Object.keys(model).forEach(key => {
        const field = model[key];
        if (!field.auto_generated) {
          item[key] = vm.user[key]
        }
      });
      return item;
    },
    generateFields(model) {
      const item = [];
      Object.keys(model).forEach(key => {
        item.push({ ...model[key], id: key });
      });
      return item;
    },
    async setLocalEntityInfo(entity) {
      const { primary_field, single_name, url, model } = await this.getEntityInfo({ entity });
      this.url = url;
      this.display_name = single_name;
      this.primary_field = primary_field;
      this.fields = this.generateFields(model);
      this.item = this.generateItem(model);
    },
    redirectToLogin() {
      this.$router.replace('/login');
    },
    getErrors() {
      const errors = [];
      this.fields.forEach(field => {
        if(this.error[field.id]) {
          this.error[field.id].forEach(error => {
            errors.push({
              id: field.id,
              key: field.display_name,
              message: error
            })
          });
        }
      });
      return errors;
    },
    async getItem() {
      this.item = Object.assign({}, this.user)
    },
    ...mapActions('auth', ['setState','logout']),
    ...mapActions('entity', ['getEntityInfo'])
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  render(h) {
    return (
      <div class='container-fluid'>
        <div class='card'>
          <div class='card-body'>
            <div class='card-title'><h2>Ajustes</h2></div>
            <FormGenerator
              handleSubmit={this.onSubmitHandler}
              fields={this.getFormFields()}
              errors={this.getErrors()}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Settings;