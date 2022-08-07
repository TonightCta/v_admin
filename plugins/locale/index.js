import keys from "./keys"
import zh from "./countries/zh"
import zh_tw from "./countries/zh_tw"
import en from "./countries/en"
import ja from "./countries/ja"
import ko from "./countries/ko"

export default {
  locale: {
    zh_CN: zh,
    zh_TW: zh_tw,
    en_US: en,
    ja_JP: ja,
    ko_KW: ko
  },
  localeKeys: keys,
  current: 'en_US'
}