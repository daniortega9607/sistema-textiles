import ColorBox from "../formatters/ColorBox";
import SearchBoxList from "../../components/SearchBoxList";

export const Product = {
  name: 'Product',
  store_entity: true,
  display_name: 'Modelos',
  display_single_name: 'Modelo',
  url: 'products',
  field_configurations: {
    form: {
      order: ['sku', 'fabric_id', 'design_id', 'color_id'],
      showDeleteButton: true,
    },
    list: {
      order: ['id', 'sku', 'fabric.name', 'design.name', 'color.value'],
      showCreateButton: true,
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    sku: { type: String, display_name: 'Codigo', required: true, render_type: 'text' },
    image: { type: String, display_name: 'Imagen' },
    fabric: { type: Object, display_name: 'Tela', required: true },
    fabric_id: { type: Number, display_name: 'Tela', required: true, render_type: 'custom', renderer: SearchBoxList, props: { entity:'fabrics' } },
    design: { type: Object, display_name: 'Diseño' },
    design_id: { type: Number, display_name: 'Diseño', render_type: 'custom', renderer: SearchBoxList, props: { entity:'designs' }  },
    color: { type: Object, display_name: 'Color', formatter: ColorBox },
    color_id: { type: Number, display_name: 'Color', render_type: 'custom', renderer: SearchBoxList, props: { entity:'colors' }  },
  }
}

export default Product;