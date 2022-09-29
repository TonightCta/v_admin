<template>
  <div class="assets-oper">
    <el-dialog
      title="提示"
      :visible.sync="visible"
      width="634px"
      :show-close="false"
    >
      <div class="set-header" slot="title">
        <p>{{ boxType === 1 ? "利润结算" : "提取余额" }}</p>
        <img
          @click="visible = false"
          :src="require('../../../assets/images/close_icon_2.png')"
          alt=""
        />
      </div>
      <div class="assets-content">
        <!-- 利润结算 -->
        <div class="oper-amount-balance" v-if="boxType === 1">
          <p class="title-balance">请选择结算类型<span> (单选)</span></p>
          <ul>
            <li @click="selectCoinBalance(2)" :class="[selectBalance.indexOf(2) > -1 && 'selected-balance']">
              <div class="selected-mask"></div>
              <img
                :src="require('../../../assets/images/right_icon.png')"
                class="selected-icon"
                alt=""
              />
              <p class="oper-name">
                <img
                  :src="require('../../../assets/images/asset_oper.png')"
                  alt=""
                />
                TRX{{ boxType === 1 ? "收益" : "余额" }}
              </p>
              <!-- 2 -->
              <div class="amount-box">
                <p>{{trxAmount}}</p>
              </div>
            </li>
            <li @click="selectCoinBalance(1)" :class="[selectBalance.indexOf(1) > -1 && 'selected-balance']">
              <div class="selected-mask"></div>
              <img
                :src="require('../../../assets/images/right_icon.png')"
                class="selected-icon"
                alt=""
              />
              <p class="oper-name">
                <img
                  :src="require('../../../assets/images/asset_oper.png')"
                  alt=""
                />
                USDT-TRC20{{ boxType === 1 ? "收益" : "余额" }}
              </p>
              <!-- 1 -->
              <div class="amount-box">
                <p>{{usdtAmount}}</p>
              </div>
            </li>
          </ul>
        </div>
        <!-- 余额提取 -->
        <div class="oper-amount-balance" v-else>
          <p class="title-balance">请选择余额类型<span> (单选)</span></p>
          <ul>
            <li @click="selectCoinBalance(2)" :class="[selectBalance.indexOf(2) > -1 && 'selected-balance']">
              <div class="selected-mask"></div>
              <img
                :src="require('../../../assets/images/right_icon.png')"
                class="selected-icon"
                alt=""
              />
              <p class="oper-name">
                <img
                  :src="require('../../../assets/images/asset_oper.png')"
                  alt=""
                />
                TRX代付余额
              </p>
              <!-- 2 -->
              <div class="amount-box">
                <p>{{trxAmount}}</p>
              </div>
            </li>
            <li @click="selectCoinBalance(3)" :class="[selectBalance.indexOf(3) > -1 && 'selected-balance']">
              <div class="selected-mask"></div>
              <img
                :src="require('../../../assets/images/right_icon.png')"
                class="selected-icon"
                alt=""
              />
              <p class="oper-name">
                <img
                  :src="require('../../../assets/images/asset_oper.png')"
                  alt=""
                />
                TRX提现余额
              </p>
              <!-- 3 -->
              <div class="amount-box">
                <p>{{trxAmountFee}}</p>
              </div>
            </li>
            <li @click="selectCoinBalance(1)" :class="[selectBalance.indexOf(1) > -1 && 'selected-balance']">
              <div class="selected-mask"></div>
              <img
                :src="require('../../../assets/images/right_icon.png')"
                class="selected-icon"
                alt=""
              />
              <p class="oper-name">
                <img
                  :src="require('../../../assets/images/asset_oper.png')"
                  alt=""
                />
                USDT-TRC20余额
              </p>
              <!-- 1 -->
              <div class="amount-box">
                <p>{{usdtAmount}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="oper-inp">
          <div class="inp-box">
            <p class="inp-label">{{ boxType === 1 ? "结算" : "" }}地址</p>
            <input
              type="text"
              v-model="inpMsg.address"
              placeholder="请输入地址"
              autocomplete="off"
            />
          </div>
          <div class="inp-box">
            <p class="inp-label">交易密码</p>
            <input
              :type="passType"
              placeholder="请输入交易密码"
              autocomplete="new-password"
              v-model="inpMsg.tradePass"
            />
            <img
              :src="require('../../../assets/images/see.png')"
              alt=""
              @click="passType = 'text'"
              v-if="passType === 'password'"
            />
            <img
              :src="require('../../../assets/images/un_see.png')"
              alt=""
              @click="passType = 'password'"
              v-else
            />
          </div>
          <div class="inp-box">
            <p class="inp-label">邮箱验证码</p>
            <input
              type="number"
              v-model="inpMsg.code"
              placeholder="请输入邮箱验证码"
            />
            <p
              class="send-code"
              :class="[count > 0 && 'wait-send']"
              @click="count == 0 ? sendCodeService() : null"
            >
              {{ count == 0 ? "发送验证码" : `${count} s` }}
            </p>
          </div>
          <div class="inp-box">
            <p class="inp-label">谷歌验证码</p>
            <input
              type="number"
              v-model="inpMsg.auth"
              placeholder="请输入谷歌验证码"
            />
          </div>
          <div class="inp-btn">
            <button @click="visible = false">取消</button>
            <p></p>
            <button
              @click="submitAssetsOper"
              element-loading-spinner="el-icon-loading"
              v-loading="waitResult"
              :disabled="waitResult"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  data: () => {
    return {
      visible: false,
      boxType: 1, // 1 ---> 利润结算   2 --->  提取余额
      passType: "password",
      count: 0,
      timer: null, //计时器
      inpMsg: {
        address: null,
        tradePass: null,
        code: null,
        auth: null,
      },
      merchan_id: null,
      waitResult: false,
      trxAmount: 0, // TRX余额
      usdtAmount: 0, // USDT余额
      trxAmountFee: 0, // TRX矿工费
      selectBalance: [], //提现种类
    };
  },
  watch: {
    visible(val) {
      !val &&
        (clearInterval(this.timer),
        (this.inpMsg = {
          address: null,
          tradePass: null,
          code: null,
          auth: null,
        },this.selectBalance = []));
    },
  },
  computed: {
    account() {
      return this.$store.state.bossAssetsCenter.merchantInfo;
    },
  },
  methods: {
    //接收外部参数
    outSide(_type, _id, _trx, _usdt,_trx_2) {
      this.boxType = _type;
      this.merchan_id = _id;
      this.trxAmount = _trx;
      this.usdtAmount = _usdt;
      this.trxAmountFee = _trx_2;
      this.visible = true;
    },
    //发送验证码
    async sendCodeService() {
      const result = await this.$store.dispatch("bossMember/sendVerifyCode", {
        scene: 5,
      });
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success("验证码发送成功");
      this.count = 60;
      this.timer = setInterval(() => {
        this.count--;
        if (this.count <= 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    //选择结算币种
    selectCoinBalance(_type){
      this.selectBalance = [];
      this.selectBalance.push(_type)
    },
    //提交操作
    async submitAssetsOper() {
      if(this.selectBalance.length == 0){
        Message.error(`请选择${this.boxType === 1 ? '结算' : '余额'}类型`);
        return
      }
      if (!this.inpMsg.address) {
        Message.error("请输入地址");
        return;
      }
      if (!this.inpMsg.tradePass) {
        Message.error("请输入交易密码");
        return;
      }
      if (!this.inpMsg.code) {
        Message.error("请输入邮箱验证码");
        return;
      }
      if (!this.inpMsg.auth) {
        Message.error("请输入谷歌验证码");
        return;
      }
      const params = {
        mchId: this.merchan_id,
        address: this.inpMsg.address,
        pay_password: this.inpMsg.tradePass,
        email_code: this.inpMsg.code,
        ga_code: this.inpMsg.auth,
        checkOne: this.selectBalance.join(','),
      };
      this.waitResult = true;
      const result =
        this.boxType === 1
          ? await this.$store.dispatch(
              "bossAssetsCenter/settlementProfit",
              params
            )
          : await this.$store.dispatch("bossAssetsCenter/clearBalance", params);
      this.waitResult = false;
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success(`${this.boxType === 1 ? "结算" : "提取"}成功`);
      this.visible = false;
      this.$emit('refreshBalance');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>