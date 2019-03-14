const Notification = ({ props }) => {
  return (
    <div class="dropdown-item">
      <div>{props.item.message}</div>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-link" onClick={() => props.showNotification(props.item)}>Mostrar</button>
        <button class="btn btn-link" onClick={() => props.readNotification(props.item)}>Marcar como leido</button>
      </div>
    </div>
  )
}

const Notifications = ({ props }) => {
  return (
    <div class="dropdown-menu dropdown-menu-right" aria-labelledby={props.ariaLabelledby}>
      {
        props.items.map(item => <Notification item={item} showNotification={props.showNotification} readNotification={props.readNotification} />)
      }
    </div>
  )
}

export default Notifications;