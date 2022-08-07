import Vue from 'vue';
import { Popover, Button,MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Popover);
Vue.use(Button);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;