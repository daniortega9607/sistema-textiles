import { ColorBox } from "../utils";

export const Color = {
  name: 'Color',
  display_name: 'Colores',
  display_single_name: 'Color',
  url: 'colors',
  field_configurations: {
    form: [
      { key: 'name', render_type: 'text', attributes: { required: true, placeholder: 'Ejemplo: Blanco' } },
      { key: 'value', render_type: 'color', default: '#ffffff', attributes: { required: true } }
    ],
    list: {
      order: ['id', 'name', 'value'],
      fields: {
        value: { formatter: ColorBox },
      },
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: {
      type: Number,
      is_primary: true,
      auto_generated: true,
      display_name: 'ID'
    },
    name: { type: String, display_name: 'Nombre', required: true },
    value: { type: String, display_name: 'Color', required: true, default: '#ffffff' }
  }
}

export default Color;