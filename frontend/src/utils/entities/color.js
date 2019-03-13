import ColorBox from "../formatters/ColorBox";

export const Color = {
  name: 'Color',
  store_entity: true,
  display_name: 'Colores',
  display_single_name: 'Color',
  url: 'colors',
  field_configurations: {
    form: {
      order: ['name', 'value'],
      showDeleteButton: true,
    },
    list: {
      order: ['id', 'name', 'value'],
      showCreateButton: true,
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    name: { type: String, display_name: 'Nombre', required: true, render_type: 'text' },
    value: { type: String, display_name: 'Color', default: '#000000', formatter: ColorBox, render_type: 'color', class:"text-center" },
  }
}

export default Color;