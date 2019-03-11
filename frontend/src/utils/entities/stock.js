import SearchBoxList from "../../components/SearchBoxList";
import Product from "../formatters/Product";

export const Stock = {
  name: 'Stock',
  store_entity: true,
  display_name: 'Almacen',
  display_single_name: 'Almacen',
  url: 'stocks',
  field_configurations: {
    form: {
      order: ['office_id', 'product_id', 'stock'],
    },
    list: {
      order: ['id', 'office.name', 'product', 'stock'],
      showCreateButton: true,
      showEditButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    office: { type: Object, display_name: 'Oficina' },
    office_id: { type: Number, display_name: 'Oficina', render_type: 'custom', disableOnUpdate: true, renderer: SearchBoxList, props: { entity: 'offices' }, required: true },
    product: { type: Object, display_name: 'Modelo', formatter: Product },
    product_id: { type: Number, display_name: 'Modelo', render_type: 'custom', disableOnUpdate: true, renderer: SearchBoxList, props: { entity: 'products' }, required: true },
    stock: { type: String, display_name: 'Cantidad (m)', class:"text-right", render_type: 'number', disable:true, default: 0 },
  }
}

export default Stock;