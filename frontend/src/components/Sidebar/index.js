import { mapState, mapActions } from 'vuex';
import './styles.scss';

const NavLink = {
  props: {
    item: { required: true }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    toggleChildrenMenu() {
      this.show = !this.show;
    },
    shouldToggleSidebar() {
      if (window.innerWidth < 992) this.toggleSidebar();
    },
    ...mapActions('app', ['toggleSidebar'])
  },
  render(h) {
    return this.item.children
      ? (
        <div>
          <a class="nav-link pointer" onClick={this.toggleChildrenMenu}>
            {this.item.name}
            {
              this.show
                ? <i class="fas fa-arrow-up float-right"></i>
                : <i class="fas fa-arrow-down float-right"></i>
            }
          </a>
          {
            this.show
              ? this.item.children.map(item => <NavLink item={item} class='pl-5' />)
              : null
          }
        </div>
      )
      : (
        <router-link to={this.item.to} class="nav-link" nativeOnClick={this.shouldToggleSidebar}>
          {this.item.name}
        </router-link>
      )
  }
}

const RenderOffices = ({ props }) => props.offices.map(office =>
  <button
    class={{ 'dropdown-item': true, pointer: true }}
    onClick={() => props.clickHandler(office)}
  >{office.name}</button>
)

const MainSidebar = {
  props: {
    user: { required: true },
    handleLogout: { required: true },
    showSidebar: { default: false },
    menu: { default: () => [] }
  },
  computed: {
    ...mapState("app", ["selectedOffice"]),
    ...mapState("entities", ["offices"]),
  },
  methods: {
    ...mapActions('app', ['selectOffice'])
  },
  render(h) {
    return (
      <div id='sidebar-wrapper' class={{ 'show-sidebar': this.showSidebar }}>
        <div class="h-100 sidebar-component">
          <nav class="nav flex-column">
            {this.offices.length > 1
              ? <div class="dropdown">
                <a
                  class="dropdown-toggle nav-link d-block d-md-none"
                  href="#"
                  role="button"
                  id="sidebarOffices"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >{this.selectedOffice.name || "Sucursales"}</a>
                <div class="dropdown-menu" aria-labelledby="sidebarOffices">
                  {
                    <RenderOffices offices={this.offices} clickHandler={this.selectOffice} />
                  }
                </div>
              </div>
              : null
            }
            {this.menu.map(item => <NavLink item={item} />)}
            <a class="nav-link" onClick={this.handleLogout}>
              Cerrar Sesión
              <i class="fas fa-sign-out-alt float-right"></i>
            </a>
          </nav>
        </div>
      </div>
    )
  }
}

export default MainSidebar;
