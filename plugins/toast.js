import Vue from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

let isShow = false
let TIMEOUT = 3000

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

Vue.prototype.$info = msg => {
  if (isShow) return
  isShow = true
  Vue.$toast.info(msg, {
    position: "top-center",
    timeout: TIMEOUT,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  });
  setTimeout(() => {
    isShow = false
  }, TIMEOUT);
}

Vue.prototype.$success = msg => {
  if (isShow) return
  isShow = true
  Vue.$toast.success(msg, {
    position: "top-center",
    timeout: TIMEOUT,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  });
  setTimeout(() => {
    isShow = false
  }, TIMEOUT);
} 

Vue.prototype.$error = msg => {
  if (isShow) return
  isShow = true
  Vue.$toast.error(msg, {
    position: "top-center",
    timeout: TIMEOUT,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  });
  setTimeout(() => {
    isShow = false
  }, TIMEOUT);
}

Vue.prototype.$warning = msg => {
  if (isShow) return
  isShow = true
  Vue.$toast.warning(msg, {
    position: "top-center",
    timeout: TIMEOUT,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
  });
  setTimeout(() => {
    isShow = false
  }, TIMEOUT);
} 