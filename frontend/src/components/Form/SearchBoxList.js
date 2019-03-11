import { fetch } from "../../utils";
import Entities from "../../entity";

const SearchBoxList = {
  props: {
    changeHandler: { default:()=>()=>{} },
    id: { required:true },
    entity: { required:true },
    current_value: { default:'' },
    required: { default:false }
  },
  watch: {
    async current_value(val){
      if(val) {
        let [err, item] = await fetch({ url: `/api/${Entities[this.entity].url}/search`, params: { id:val } });
        if(!err) {
          this.selectItem(item.id, item.value)
        }
      }
    }
  },
  data(){
    return {
      search: '',
      value: null,
      results: []
    }
  },
  methods:{
    debounceHandler: _.debounce(function(callback, options) {
      this[callback](options);
    }, 600),
    onChange(e){
      this.search = e.target.value;
      this.debounceHandler('getItems', this.search);
    },
    selectItem(id, value){
      this.search = value;
      this.value = id;
      this.changeHandler(this.id, id)
    },
    async getItems(search) {
      const vm = this;
      this.value=null;
      this.results=[];
      if(!search) {
        this.changeHandler(this.id, null)
        return
      };
      let [err, results] = await fetch({ url: `/api/${Entities[this.entity].url}/search`, params: { search } });
      if (!err) {
        results.forEach(item => {
          item.onClick = vm.selectItem
        });
        this.results = results;
      }
    },
  },
  render(h) {
    return (
      <div>
        <input
          type="text"
          class="form-control"
          value={this.search}
          onInput={this.onChange}
          required={this.required}
        />
        {
          !this.value
            ? <div class="search-list">
                <div class="list-group">
                  {
                    this.results.map(item => (
                      <div
                        class="list-group-item p-2"
                        onClick={() => item.onClick(item.id, item.value)}
                      >
                        <b>{item.value}</b>
                      </div>
                    ))
                  }
                </div>
              </div>
            : null
        }
      </div>

    )
  }
}

export default SearchBoxList;