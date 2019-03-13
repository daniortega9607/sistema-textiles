import SearchBoxList from "../../components/SearchBoxList";
import Currency from "../formatters/Currency";
import { Status, StatusTypes } from "../formatters/Status";

export const StockMovement = {
  name: 'StockMovement',
  store_entity: true,
  display_name: 'Movimientos de Almacén',
  display_single_name: 'Movimiento de Almacén',
  url: 'stock_movements',
  field_configurations: {
    form: {
      order: ['office_id','to_office_id'],
      showDeleteButton: true,
    },
    list: {
      order: ['id','created_at','office.name', 'to_office.name','status','balance','total'],
      showCreateButton: true,
      showEditButton: true,
      showDeleteButton: true,
    }
  },
  fields: {
    id: { type: Number, is_primary: true, auto_generated: true, display_name: 'ID' },
    created_at: { type: String, display_name: 'Fecha' },
    office: { type: Object, display_name: 'Desde Sucursal' },
    office_id: { type: Number, display_name: 'Desde Sucursal', render_type: 'custom', disableOnUpdate: true, renderer: SearchBoxList, props: { entity: 'offices' }, required: true },
    to_office: { type: Object, display_name: 'Hacia Sucursal' },
    to_office_id: { type: Number, display_name: 'Hacia Sucursal', render_type: 'custom', disableOnUpdate: true, renderer: SearchBoxList, props: { entity: 'offices' }, required: true },
    status: {
      type: Number,
      display_name: 'Estado', 
      required: true, 
      formatter: Status, 
      class: "text-center", 
      render_type: 'select',
      props: { values: StatusTypes }
    },
    balance: { type: Number, display_name: 'Saldo', formatter: Currency, class:"text-right", render_type: 'number' },
    total: { type: Number, display_name: 'Total', formatter: Currency, class:"text-right", render_type: 'number' },
  }
}

export default StockMovement;