import { getDataFromKey, getField } from "../utils";

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
                    const title = getField(props.fields, field);
                    return (
                      <th class={`no-wrap ${props.fields[title].class}`}>
                        {props.fields[title].display_name}
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
                  <tr class={`${props.deleting == item.id ? 'table-dark inactive' : ''}`}>
                    {
                      props.field_configs.order.map(field => {
                        const title = getField(props.fields, field);
                        let formatter;
                        formatter = props.fields[title].formatter || null;
                        return (
                          <router-link
                            tag={props.fields[title].is_primary ? 'th' : 'td'}
                            to={!props.clickHandler ? { path: item.id.toString() }:''}
                            onClick={props.clickHandler ? props.clickHandler : () => {}}
                            class={props.fields[title].class}
                            append
                          >
                            {formatter
                              ? <formatter value={getDataFromKey(item, field.split('.'))} />
                              : getDataFromKey(item, field.split('.'))
                            }
                          </router-link>
                        )
                      })
                    }
                    <td class="text-right">
                      <div class="btn-group">
                        {
                          props.buttons
                            ? props.buttons.map(buttonItem => (
                              buttonItem.renderer
                              ? <buttonItem.renderer {...{ props: {...buttonItem, selectedItems: props.selectedItems, item, extraParams:props.extraParams} }}/>
                              : <button class={buttonItem.class} onClick={() => buttonItem.action(item, props.extraParams)}>
                                  {buttonItem.label} {buttonItem.icon ? <i class={buttonItem.icon}></i> : null}
                                </button>
                            ))
                            : null
                        }
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
                              <i class={`fas ${props.deleting == item.id ? 'fa-spinner fa-spin' : 'fa-trash'}`}></i>
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
