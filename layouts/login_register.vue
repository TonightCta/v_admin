<template lang="pug">
v-app#ib-wallet-login-register(
  :class="[{ 'light-ib-wallet-login-register': currentTheme == 'light' }, { 'dark-ib-wallet-login-register': currentTheme == 'dark' }]",
  v-if="$store.state.not_china"
)
  //- 顶部 APP 导航条
  v-app-bar(app, flat)
    //- img.navbar-logo.mr-3(src="/logo_dark.png", v-if="currentTheme == 'light'")
    img.navbar-logo.mr-3(src="/logo.png")
    v-toolbar-title.navbar-title.pl-0 {{ $vuetify.lang.t('$vuetify.defaultLayout.title') }}
    v-spacer
    //- v-tooltip(bottom)
    //-   template(v-slot:activator="{ on, attrs }")
    //-     div.suspension(@click="jump",v-bind="attrs",v-on="on")
    //-   span Telegram

    v-btn.mx-2.other-color(outlined, @click="$toDoc") {{ $vuetify.lang.t('$vuetify.defaultLayout.dev_doc') }}
    v-btn.mx-2(outlined, @click="toDemo") {{ $vuetify.lang.t('$vuetify.defaultLayout.demo') }}

    v-menu(offset-y)
      template(v-slot:activator="{ on, attrs }")
        v-btn.mx-2(text, v-bind="attrs", v-on="on") {{ currentLang.name }}
          v-icon(right, size="24") mdi-menu-down
      v-list.text-center
        v-list-item(
          v-for="l, i in allLangs",
          :key="'lang' + i",
          @click="currentLang = l"
        )
          v-list-item-title {{ l.name }}

    //- v-btn(
    //-   icon,
    //-   @click="changeTheme"
    //- ).mr-2
    //-   v-icon(v-if="currentTheme=='light'") mdi-weather-night
    //-   v-icon(v-else) mdi-white-balance-sunny

  //- 子页面内容
  v-main
    nuxt

  //- 底部 备案信息
  v-footer(app, style="justify-content: center")
    span.pa-2 Copyright © 2020-2022 IB.CC All Rights Reserved
</template>

<script>
import lang from "~/plugins/locale";
import axios from "axios";
export default {
  data: () => {
    return {
      currentLang: {
        lang: "en_US",
        name: "English",
      },
      allLangs: [],
      currentTheme: "light",
      allThemes: ["dark", "light"],
    };
  },
  watch: {
    currentLang() {
      this.currentLangChange();
    },
  },
  created() {
    let _this = this;
    let b_lang = null;
    let langs = ["zh", "zh-CN", "zh-TW", "en"];
    this.loading();
    this.allLangs = lang.localeKeys;
    if (this.$route.query.lang) {
      b_lang = this.$route.query.lang;
      b_lang = b_lang === "zh" ? "zh-CN" : b_lang;
      b_lang = b_lang === "zh-HK" ? "zh-TW" : b_lang;
      b_lang = b_lang === "en" ? "en_US" : b_lang;
      b_lang = b_lang.replace("-", "_");
      this.$vuetify.lang.current = b_lang;
      localStorage.setItem("language", b_lang);
      localStorage.setItem(
        "languageName",
        this.allLangs.find(function (item) {
          return item.lang == b_lang;
        }).name
      );
    } else {
      if (
        window.localStorage.getItem("language") &&
        localStorage.getItem("language") != undefined &&
        localStorage.getItem("language") != "undefined"
      ) {
        this.$vuetify.lang.current = window.localStorage.getItem("language");
      } else {
        b_lang = langs.find(function (item) {
          return item == window.navigator.language;
        });
        if (b_lang == undefined) b_lang = "en";
        b_lang = b_lang === "zh" ? "zh-CN" : b_lang;
        b_lang = b_lang === "zh-HK" ? "zh-TW" : b_lang;
        b_lang = b_lang === "en" ? "en_US" : b_lang;
        b_lang = b_lang.replace("-", "_");

        this.$vuetify.lang.current = b_lang;
        localStorage.setItem("language", b_lang);
        localStorage.setItem(
          "languageName",
          this.allLangs.find(function (item) {
            return item.lang == b_lang;
          }).name
        );
      }
    }
    this.getLocalLang();
    this.currentLangChange();
  },
  methods: {
    toDemo() {
      let b_lang = null;
      switch (this.$vuetify.lang.current) {
        case "en_us":
          b_lang = "en";
          break;
        case "zh_CN":
          b_lang = "zh-CN";
          break;
        case "zh_TW":
          b_lang = "zh-TW";
          break;
        default:
          b_lang = "en";
      }
      window.open(`https://ib.cc/#/Demo?lang=${b_lang}`, "GW");
      // window.open(`https://192.168.31.160:9000/#/Demo?lang=${b_lang}`, "GW");
      // window.open(`https://http://zentao.88887.cn:1000/#/Demo?lang=${b_lang}`, "GW");
    },
    async loading() {
      this.$store.dispatch("isChina");
      // await axios.get(
      //     "https://api.tianapi.com/txapi/ipquery/index?key=b551c6b2223fc07578aaf3cbaaa8861b"
      //   ).then((res) => {
      //     let data = res.data.newslist[0];
      //     if (
      //       data.country == "中国" &&
      //       data.province != "香港特别行政区" &&
      //       data.province != "澳门特别行政区" &&
      //       data.province != "台湾"
      //     ) {
      //       this.open()
      //     }else{
      //       this.$store.dispatch('isChina')
      //     }
      //   });
    },
    open() {
      this.$alert(
        "根据相关政策暂不支持阁下所在地区(中国大陆)，如果您不在该地区请清除浏览器缓存再试试。",
        "ERROR 403 FORBIDDEN:",
        {
          showClose: false,
          showConfirmButton: false,
        }
      );
    },
    getLocalLang() {
      let lang = window.localStorage.getItem("language");
      if (lang) {
        this.currentLang.lang = lang;
        this.currentLang.name = window.localStorage.getItem("languageName");
      }
    },
    async currentLangChange() {
      window.localStorage.setItem("language", this.currentLang.lang);
      window.localStorage.setItem("languageName", this.currentLang.name);
      this.$vuetify.lang.current = this.currentLang.lang;
    },
    changeTheme() {
      this.currentTheme = this.currentTheme == "dark" ? "light" : "dark";
      this.$vuetify.theme.dark = this.currentTheme == "dark";
    },
    jump() {
      window.open("https://t.me/joinchat/SkgBCB0S81hy8vlgoeGz0Q", "_blank");
    },
  },
};
</script>

<style lang="stylus">
#ib-wallet-login-register {
  .other-color {
    background: #2D3EC7;
    border: 0;
    color: white;
    span {
      color: white;
    }
  }

  button {
    background: rgba(216, 216, 216, 0.08);
    border: 0;

    span {
      color: white;
    }
  }

  .navbar-logo {
    height: 36px;
  }

  .suspension {
    width: 32px;
    height: 32.5px;
    margin-right: 16px;
    background-image: url('/telegram@2x.png');
    background-repeat: no-repeat;
    background-size: 100%;
    cursor: pointer;
  }

  .navbar-title {
    font-size: 18px;
    padding-top: 2px;
    color: rgba(255, 255, 255, 0.7);
  }

  .v-app-bar {
    .v-toolbar__content {
      background: #161F37;
    }
  }

  .v-footer {
    background: #071028;
    border-top: 1px solid #232B41;

    .pa-2 {
      color: #999;
    }
  }
}
</style>
