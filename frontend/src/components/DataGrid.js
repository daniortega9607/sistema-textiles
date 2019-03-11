import { getDataFromKey } from "../utils";

const DataGrid = ({ props }) => {
  return (
    <div class="table-responsive">
      <table class="table table">
        {
          props.field_configs
            ? <thead class="thead-dark">
              <tr>
                {
                  props.field_configs.order.map(field => {
                    return (
                      <th class={`no-wrap ${props.fields[field.split('.')[0]].class}`}>
                        {props.fields[field.split('.')[0]].display_name}
                      </th>
                    )
                  })
                }
                <th class="text-right"></th>
              </tr>
            </thead>
            : null
        }
        {
          props.items && props.items.length
            ? <tbody>
              {
                props.items.map(item => (
                  <tr class={`${props.deleting == item.id ? 'table-dark inactive':''}`}>
                    {
                      props.field_configs.order.map(field => {
                        let formatter;
                        formatter = props.fields[field.split('.')[0]].formatter || null;
                        return (
                          <router-link
                            tag={props.fields[field.split('.')[0]].is_primary ? 'th' : 'td'}
                            to={{ path: item.id.toString() }}
                            class={props.fields[field.split('.')[0]].class}
                            append
                          >
                            { formatter
                              ? <formatter value={getDataFromKey(item, field.split('.'))}/>
                              : getDataFromKey(item, field.split('.'))
                            }
                          </router-link>
                        )
                    })
                    }
                    <td class="text-right">
                      <div class="btn-group">
                        {
                          props.showEditButton
                            ? <router-link to={{ path: item.id.toString() }} class="btn btn-primary btn-sm" append>
                                <i class="fas fa-edit"></i>
                              </router-link>
                            : null
                        }
                        {
                          props.showDeleteButton
                            ? <button 
                                class="btn btn-danger btn-sm" onClick={() => props.deleteHandler(item.id)}
                                disabled={props.deleting == item.id}
                              >
                                <i class={`fas ${props.deleting == item.id ? 'fa-spinner fa-spin':'fa-trash'}`}></i>
                              </button >
                            : null
                        }
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
            : null
        }
      </table>
    </div>
  );
}

export default DataGrid;