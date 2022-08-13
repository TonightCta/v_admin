<!-- 绑定谷歌验证器 -->
<template>
  <div
    class="google-auth"
    v-if="$store.state.bossAssetsCenter.merchantInfo.ga == 0"
  >
    <p class="card-title">
      {{ $vuetify.lang.t("$vuetify.mine.谷歌验证器设置") }}
    </p>
    <div class="bind-content">
      <!-- 下载 -->
      <div class="step-public step-one">
        <p class="public-title">
          <span class="public-point">1</span
          >{{ $vuetify.lang.t("$vuetify.mine.下载谷歌验证器") }}
        </p>
        <div v-for="(down, index) in otherList" :key="index" class="need-left">
          <div>
            {{ down.name }}
          </div>
          <ul>
            <li
              v-for="(url, indexInner) in down.list"
              :key="indexInner + 'index'"
            >
              <div
                :style="{
                  'background-image': !url.without_bg
                    ? `url(${url.icon})`
                    : null,
                  'background-size': '100% 100%',
                }"
                @click="openPlay(url.url)"
              >
                <img v-if="url.without_bg" :src="url.icon" alt="" />
              </div>
            </li>
          </ul>
        </div>
        <div class="mobile-down">
          <div v-for="(down, index) in loadList" :key="index" class="need-left">
            <div>
              {{ down.name }}
            </div>
            <ul>
              <li
                v-for="(url, indexInner) in down.list"
                :key="indexInner + 'index'"
              >
                <el-popover
                  placement="top"
                  @hide="clearTootip(url.ref)"
                  @show="showQrTootip(index, indexInner, url.ref)"
                  width="180"
                  trigger="hover"
                  v-if="!url.click"
                >
                  <div class="down-url" :ref="url.ref">
                    <!-- <img :src="url.html" alt=""> -->
                  </div>
                  <div
                    slot="reference"
                    :style="{
                      'background-image': !url.without_bg
                        ? `url(${url.icon})`
                        : null,
                      'background-size': '100% 100%',
                    }"
                  >
                    <img v-if="url.without_bg" :src="url.icon" alt="" />
                    <p v-if="url.without_bg">
                      {{ $vuetify.lang.t("$vuetify.mine.安卓本地下载") }}
                    </p>
                  </div>
                </el-popover>
                <div
                  v-else
                  :style="{
                    'background-image': !url.without_bg
                      ? `url(${url.icon})`
                      : null,
                    'background-size': '100% 100%',
                  }"
                  @click="openPlay(url.url)"
                >
                  <img v-if="url.without_bg" :src="url.icon" alt="" />
                  <p v-if="url.without_bg">应用商店</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 绑定 -->
      <div class="step-public step-two">
        <p class="public-title">
          <span class="public-point">2</span
          >{{ $vuetify.lang.t("$vuetify.mine.绑定谷歌验证器") }}
        </p>
        <div class="auth-msg">
          <div class="msg-qr" ref="auth-qr"></div>
          <div class="msg-text">
            <div class="text-con">
              <p>{{ $vuetify.lang.t("$vuetify.mine.密文") }}:&nbsp;</p>
              <p>{{ authText }}</p>
            </div>
            <div class="text-btn">
              <v-btn
                depressed
                id="copycode"
                class="primary"
                style="color:#4266FF;"
                :data-clipboard-text="authText"
                @click="copy"
                >{{ $vuetify.lang.t("$vuetify.mine.复制") }}</v-btn
              >
              <v-btn
                depressed
                class="primary"
                style="color:#4266FF;"
                @click="
                  $refs['auth-qr'].innerHTML = '';
                  createQRCodeForGoogleAuth();
                "
                >{{ $vuetify.lang.t("$vuetify.mine.刷新") }}</v-btn
              >
            </div>
          </div>
        </div>
        <!-- 绑定输入 -->
        <div class="inp-bind">
          <div>
            <span class="public-point">3</span>
            <v-text-field
              :placeholder="$vuetify.lang.t('$vuetify.mine.请输入动态密码')"
              style="width: 240px"
              hide-details
              dense
              outlined
              x-small
              single-line
              v-model="auth_code"
            ></v-text-field>
          </div>
          <v-btn depressed color="primary" @click="submitBind">{{
            $vuetify.lang.t("$vuetify.mine.立即绑定")
          }}</v-btn>
        </div>
      </div>
    </div>
    <v-snackbar v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <IsGa />
  </div>
  <div v-else></div>
</template>

<script>
import QRcode from "qrcodejs2";
import Clipboard from "clipboard";
import { Message } from "element-ui";
export default {
  data: () => {
    return {
      otherList: [
        {
          name: "浏览器扩展",
          list: [
            {
              url: "https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai",
              icon: require("../../../assets/images/chrome_icon.png"),
              without_bg: false,
              ref: "chrome-qr",
              click: true,
            },
          ],
        },
      ],
      loadList: [
        {
          name: "Android",
          list: [
            {
              url: "https://www.baidu.com",
              icon: require("../../../assets/images/and_down.png"),
              without_bg: true,
              ref: "local-qr",
            },
            {
              url: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
              icon: require("../../../assets/images/google_down.png"),
              without_bg: false,
              ref: "google-qr",
            },
          ],
        },
        {
          name: "IOS",
          list: [
            {
              url: "itms-apps://itunes.apple.com/app/id388497605?action=write-review",
              icon: require("../../../assets/images/ios_down.png"),
              without_bg: false,
              ref: "ios-qr",
            },
          ],
        },
      ],
      //验证器二维码
      authText: null,
      auth_code: null, //谷歌验证码
      snackbar: false,
      text: "",
    };
  },
  components: {
    IsGa: (resolve) => require(["../../../components/is_ga"], resolve),
  },
  computed: {
    gaStatus() {
      return this.$store.state.bossAssetsCenter.merchantInfo.ga;
    },
  },
  created() {
    this.createQRCodeForGoogleAuth();
    // setTimeout(() => {
    //   this.$store.state.bossAssetsCenter.merchantInfo.ga == 0 && this.createQRCodeForGoogleAuth();
    // }, 1000);
  },
  methods: {
    //悬停生成二维码
    showQrTootip(_index, _inner_index, _ref) {
      this.createQRCodeForDownload(_index, _inner_index, _ref);
    },
    //销毁二维码
    clearTootip(_ref) {
      this.$refs[_ref][0].innerHTML = "";
    },
    //生成二维码
    createQRCodeForDownload(index, innerIndex, ref) {
      new QRcode(this.$refs[ref][0], {
        text: this.loadList[index].list[innerIndex].url,
        width: 160,
        height: 160,
        colorDark: "#333",
        colorLight: "#fff",
        correctLevel: QRcode.CorrectLevel.L,
      });
    },

    //生成谷歌验证器二维码
    async createQRCodeForGoogleAuth() {
      const info = await this.$store.dispatch(
        "bossAssetsCenter/merchantAssetsInfo"
      );
      if (info.data.merchantInfo.ga == 1) {
        return;
      }
      const result = await this.$store.dispatch(
        "bossAssetsCenter/getGoogleAuth"
      );
      this.authText = result.data.secret;
      // qrcode
      new QRcode(this.$refs["auth-qr"], {
        text: result.data.qrcode,
        width: 100,
        height: 100,
        colorDark: "#333",
        colorLight: "#fff",
        correctLevel: QRcode.CorrectLevel.L,
      });
    },
    //复制验证码
    copy() {
      let clipboard = new Clipboard("#copycode");
      clipboard.on("success", (e) => {
        Message.success(this.$vuetify.lang.t("$vuetify.mine.复制成功"));
        // setTimeout(() => {
        //   this.text = '请输入谷歌验证码';
        // },3000)
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        Message.error(
          this.$vuetify.lang.t("$vuetify.mine.该浏览器不支持自动复制")
        );
        // 释放内存
        clipboard.destroy();
      });
    },
    //扩展下载
    openPlay(_url) {
      window.open(_url);
    },
    //提交绑定
    async submitBind() {
      if (!this.auth_code) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入谷歌验证码"));
        return;
      }
      const result = await this.$store.dispatch(
        "bossAssetsCenter/bindGoogleAuth",
        { code: this.auth_code }
      );
      const { code } = result;
      if (code != 200) {
        this.text = result.message;
        Message.error(result.message);
      } else {
        this.text = "";
        Message.success(this.$vuetify.lang.t("$vuetify.mine.绑定成功"));
        this.$store.dispatch("bossAssetsCenter/merchantAssetsInfo", {});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.google-auth {
  .card-title {
    font-size: 1.25rem;
    color: #333;
    font-weight: 500;
  }
  .bind-content {
    padding: 16px 24px;
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: space-between;
    padding-right: 80px;
    .public-point {
      background: rgba(25, 31, 56, 0.08);
      text-align: center;
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      font-size: 12px;
      color: #333;
      margin-right: 10px;
      transform: translateY(-2px);
      line-height: 20px;
    }
    .mobile-down {
      display: flex;
      margin-top: 14px;
    }
    .step-public {
      .public-title {
        color: #333;
        font-weight: 500;
      }
      .need-left {
        padding-left: 32px;
      }
      ul {
        display: flex;
        flex-direction: column;
        padding-left: 0;
        li {
          list-style: none;
          margin: 10px 0;
          div {
            width: 126px;
            height: 38px;
            background: black;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            img {
              width: 18px;
              height: 20px;
              margin-right: 6px;
            }
            p {
              color: white;
              font-size: 14px;
              margin-bottom: 0;
            }
          }
          div:first-child {
            margin-right: 30px;
          }
        }
      }
    }
    .step-one {
      margin-right: 80px;
    }
    .step-two {
      .auth-msg {
        display: flex;
        .msg-qr {
          width: 100px;
          height: 100px;
          margin-right: 34px;
          margin-left: 32px;
        }
        .msg-text {
          .text-con {
            display: flex;
            padding: 8px 12px;
            border-radius: 4px;
            background: #F8F8F8;
            margin-bottom: 16px;
            p:first-child{
              white-space: nowrap;
            }
            p {
              margin-bottom: 0;
              color: #666;
            }
          }
          .text-btn {
            button {
              margin-right: 32px;
              background: rgba(66, 102, 255, 0.1) !important;
            }
          }
        }
      }
      .inp-bind {
        margin-top: 30px;
        text-align: right;
        div {
          display: flex;
          align-items: center;
          input {
            flex: 1;
          }
          span {
            transform: translateY(0);
          }
        }
        button {
          margin-top: 24px;
        }
      }
    }
  }
}
</style>