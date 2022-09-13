import Vue from 'vue';
import { 
    Popover, 
    Button, 
    MessageBox, 
    Pagination, 
    Radio, 
    Select, 
    Option,
    Loading, 
    Dropdown, 
    DropdownMenu, 
    DropdownItem,
    DatePicker,
    Table,
    TableColumn,
    Dialog,
    Input,
    RadioGroup,
    RadioButton,
    Switch,
    
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Pagination);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Option);
Vue.use(Popover);
Vue.use(Button);
Vue.use(Loading).use(Dropdown).use(DropdownMenu).use(DropdownItem).use(DatePicker).use(Table).use(TableColumn)
.use(Dialog).use(Input).use(RadioGroup).use(RadioButton).use(Switch);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;