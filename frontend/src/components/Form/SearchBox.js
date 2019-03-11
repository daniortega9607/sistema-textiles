const SearchBox = {
  props: {
    search: { default: '' },
    searchHandler: { required: true }
  },
  methods: {
    onSubmit() {
      this.searchHandler(this.search)
    },
    onInput(e) {
      let value = e.target.value;
      this.searchHandler(value)
    }
  },
  render(h) {
    return (
      <form onSubmit={e => { e.preventDefault(); this.onSubmit() }} autocomplete='off'>
        <div class="form-group">
          <div class="input-group">
            <input
              id="search"
              type="text"
              class="form-control"
              placeholder="Buscar..."
              onInput={this.onInput}
              value={this.search}
              required
            />
            <div class="input-group-append">
              <button type='submit' class='btn btn-dark'><i class='fas fa-search'></i></button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default SearchBox;