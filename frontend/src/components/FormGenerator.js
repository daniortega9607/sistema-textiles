const RenderField = ({ props }) => {
  switch (props.field.render_type) {
    case 'text':
    case 'password':
    case 'email':
    case 'number':
      return (
        <input
          id={props.field.id}
          type={props.field.render_type}
          class='form-control'
          value={props.field.value}
          onInput={(e) => props.changeHandler(props.field.id, e.target.value)}
          autofocus={props.field.autofocus}
          required={props.field.required}
          placeholder={props.field.placeholder}
          step='any'
          disabled={props.field.disable || (props.isUpdate && props.field.disableOnUpdate)}
        />
      )
    case 'color':
      return (
        <input
          id={props.field.id}
          type={props.field.render_type}
          class='form-control'
          value={props.field.value}
          onChange={(e) => props.changeHandler(props.field.id, e.target.value)}
          autofocus={props.field.autofocus}
          required={props.field.required}
          disabled={props.field.disable || (props.isUpdate && props.field.disableOnUpdate)}
        />
      )
    case 'textarea':
      return (
        <textarea
          id={props.field.id}
          class='form-control'
          value={props.field.value}
          onChange={(e) => props.changeHandler(props.field.id, e.target.value)}
          autofocus={props.field.autofocus}
          required={props.field.required}
          rows='3'
          disabled={props.field.disable || (props.isUpdate && props.field.disableOnUpdate)}
        ></textarea>
      )
    case 'select':
      return (
        <select
          id={props.field.id}
          class='form-control'
          value={props.field.value}
          onChange={(e) => props.changeHandler(props.field.id, e.target.value)}
          autofocus={props.field.autofocus}
          required={props.field.required}
          disabled={props.field.disable || (props.isUpdate && props.field.disableOnUpdate)}
        >
          <option value=''>Selecciona una opción</option>
          {
            props.field.props.values.map(field => <option value={field.id}>{field.value}</option>)
          }
        </select>
      )
    case 'checkbox':
      return (
        <div class="form-check">
          <label class="form-check-label">
            <input
              id={props.field.id}
              type="checkbox"
              class="form-check-input"
              checked={props.field.value}
              required={props.field.required}
              onChange={(e) => props.changeHandler(props.field.id, e.target.checked)}
              disabled={props.field.disable || (props.isUpdate && props.field.disableOnUpdate)}
          />{props.field.props.label}
          </label>
        </div>
      )
    case 'custom':
      return (
        <props.field.renderer
          id={props.field.id}
          currentValue={props.field.value}
          required={props.field.required}
          changeHandler={props.changeHandler}
          disabled={props.field.disable || (props.isUpdate && props.field.disableOnUpdate)}
          {...{ props: props.field.props }}
        />
      )
    default: return null
  }
}

const FormGenerator = ({ props }) => {
  return (
    <form onSubmit={e => { e.preventDefault(); props.submitHandler(); }} autocomplete="off">
      {
        props.field_configs
          ? props.field_configs.order.map(field => {
            if (props.isUpdate) {
              if (props.fields[field.split('.')[0]].hideOnUpdate) return null;
            }
            if (!props.updatedItem[field] && !props.item[field] && props.fields[field.split('.')[0]].default !== undefined) {
              props.changeHandler(field, props.fields[field.split('.')[0]].default)
            }
            return (
              <div class="form-group">
                <label for={field}>{props.fields[field.split('.')[0]].display_name}</label>
                <RenderField 
                  field={{
                    ...props.fields[field.split('.')[0]],
                    value: props.updatedItem[field] || props.item[field],
                    id: field,
                  }}
                  isUpdate={props.isUpdate}
                  changeHandler={props.changeHandler}
                />
              </div>
            )
          })
          : null
      }
      <div class='form-group text-right'>
        <div class="btn-group">
          {
            props.showDeleteButton
              ? <button class='btn btn-danger' type='button' onClick={() => props.deleteHandler(props.item.id)}>Borrar</button>
              : null
          }
          {
            !props.hideCancel
              ? <button class='btn btn-warning' type='button' onClick={props.cancel}>Cancelar</button>
              : null
          }
          <button class='btn btn-primary'>Guardar</button>
        </div>
      </div>
    </form>
  );
}

export default FormGenerator;