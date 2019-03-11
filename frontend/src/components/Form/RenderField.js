const RenderField = {
  props: {
    field: { required: true },
  },
  render(h) {
    switch (this.field.render_type) {
      case 'text':
      case 'password':
      case 'email':
        return (
          <input
            id={this.field.id}
            type={this.field.render_type}
            class='form-control'
            value={this.field.value}
            onInput={(e) => this.field.onChange(this.field.id, e.target.value)}
            autofocus={this.field.autofocus}
            required={this.field.required}
            placeholder={this.field.placeholder}
          />
        )
      case 'number':
      case 'color':
        return (
          <input
            id={this.field.id}
            type={this.field.render_type}
            class='form-control'
            value={this.field.value}
            onChange={(e) => this.field.onChange(this.field.id, e.target.value)}
            autofocus={this.field.autofocus}
            required={this.field.required}
            step='any'
          />
        )
      case 'textarea':
        return (
          <textarea
            id={this.field.id}
            class='form-control'
            value={this.field.value}
            onChange={(e) => this.field.onChange(this.field.id, e.target.value)}
            autofocus={this.field.autofocus}
            required={this.field.required}
            rows='3'
          ></textarea>
        )
      case 'select':
        return (
          <select
            id={this.field.id}
            class='form-control'
            value={this.field.value}
            onChange={(e) => this.field.onChange(this.field.id, e.target.value)}
            autofocus={this.field.autofocus}
            required={this.field.required}
          >
            <option value=''>Selecciona una opción</option>
            {
              this.field.values.map(field => <option value={field.id}>{field.value}</option>)
            }
          </select>
        )
      case 'checkbox':
        return (
          <div class="form-check">
            <label class="form-check-label">
              <input
                id={this.field.id}
                type="checkbox"
                class="form-check-input"
                checked={this.field.value}
                required={this.field.required}
                onChange={(e) => this.field.onChange(this.field.id, e.target.checked)}
              />{this.field.props.label}
            </label>
          </div>
        )
      case 'custom':
        return (
          <this.field.renderer
            id={this.field.id}
            current_value={this.field.value}
            required={this.field.required}
            changeHandler={this.field.onChange}
            {...{ props: this.field.props }}
          />
        )
      default: return null
    }
  }
}

export default RenderField;