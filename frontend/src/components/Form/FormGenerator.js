import RenderField from "./RenderField";
import { Alert } from "../../utils";

const FormGenerator = {
  props: {
    errors: { default: ()=>[] },
    fields: { required: true },
    handleSubmit: { required: true }
  },
  watch: {
    errors(errors){
      if(errors.length){
        let field = document.getElementById(errors[0].id);
        errors.forEach(error => {
          if(!field){
            field = document.getElementById(error.id);
          }
          Alert.error({ title:error.key, text:error.message })
        });
        if(field.nodeName.toLowerCase() === 'input') {
          field.focus();
        }
      }
    }
  },
  render(h) {
    return (
      <form onSubmit={e => { e.preventDefault(); this.handleSubmit() }} autocomplete='off'>
        {
          this.fields.map(field => (
            field.render_type
              ? <div class="form-group">
                <label for={field.id}>{field.display_name}</label>
                <RenderField field={field} onChange={field.onChange} />
              </div>
              : null
          ))
        }
        <div class='form-group text-right'>
          <button class='btn btn-warning' type='button' onClick={() => this.$router.go(-1)}>Cancelar</button>
          <button class='btn btn-primary'>Guardar</button>
        </div>
      </form>
    )
  }
}

export default FormGenerator;