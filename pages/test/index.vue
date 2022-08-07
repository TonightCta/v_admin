<template lang="pug">
.demo
    v-app-bar(flat).pr-4
      v-menu(offset-y)
        template(v-slot:activator="{ on, attrs }")
          v-btn(
          text,
          v-bind="attrs"
          v-on="on"
        ).title.mr-2 {{currentShowCoin.asset}}
        v-list
          v-list-item(
            v-for="coin,i in allCoins"
            :key="'bar-coin'+i"
            @click="currentShowCoin=coin"
          )
            v-list-item-title.title {{coin.asset}}
      .title {{currentShowCoin.amount}}
      v-spacer
      v-app-bar-nav-icon
        v-avatar
          v-img(src="/logo.jpg")
      //- .title 收银台
      //- v-spacer
    .container
      .title.my-4 充币
      
      v-col(cols="12",sm="6").py-2
        .subtitle-1.py-2 选择充币账户

        v-btn-toggle(
          v-model="currentCoin"
          tile
          mandatory
          color="primary"
          group
        )
          v-btn(
            v-for="coin,i in allCoins"
            :key="'recharge'+i"
            :value="coin"
          ) {{coin.asset}}

      v-btn(
        depressed,
        @click="showRecharge=true"
      ).ma-4 下一步

      v-divider.py-4.my-4

      .title.my-4 提币
      
      v-col(cols="12",sm="6").py-2
        .subtitle-1.py-2 选择提币账户

        v-btn-toggle(
          v-model="currentWithdraw"
          tile
          mandatory
          color="primary"
          group
        )
          v-btn(
            v-for="coin,i in allCoins"
            :key="'withdraw'+i"
            :value="coin"
          ) {{coin.asset}}

      v-btn(
        depressed,
        @click="showWithdraw=true"
      ).ma-4 下一步

      v-divider.py-4.my-4

      .title.my-4(style="display:flex")
        span 记录
        v-spacer
        v-btn(depressed,@click="getTransHistory",:loading="isLoading",color="primary") 刷新

      v-col.py-2
        v-data-table(
          :headers="transHistory.headers",
          :items="transHistory.items",
          :search="searchCoin"
          :custom-filter="filterTableData"
        )
          template(v-slot:header.Asset="{header}")
            v-select(
              v-model="searchCoin"
              :items="calcCoins",
              item-text="asset",
              item-value="asset",
              dense,
              hide-details,
              style="width:140px"
            )
            
          template(v-slot:item.CreatedAt="{item}")
            span {{formatTime(item.CreatedAt)}}+
          template(v-slot:item.Type="{item}")
            span {{item.Type == 1 ? '充值' : '提币'}}
          template(v-slot:item.ErrorMsg="{item}")
            span {{item.ErrorMsg || "空"}}

    v-dialog(v-model="showRecharge",max-width="100%",width="550")
      v-card
        v-card-title.headline 充值到 {{currentCoin.asset}} 帐户
        v-divider
        v-card-text(style="display:flex").py-4
          v-spacer
          v-img(:src="currentCoin.qrCodeURL",max-width="160",width="160",height="160")
          v-spacer
        v-card-text.text-center.addr-input
          .input-layer
          input.text--primary#depositaddress(:value="currentCoin.depositAddress",style="outline:none")
        v-card-text.text-center
          v-btn(depressed,@click="copyAddress") 复制地址
        v-card-text.text-caption 提示
        v-card-text.font-weight-bold 最低充值：0.01000000
        v-card-text.font-weight-light
          p 如果您向该地址发送比特币（BTC）以外的货币，您将失去永久充值。
          p 如果充值金额等于0.01000000，则将扣除0.00050000手续费。
        v-divider.pb-2
        v-card-text.subtitle-2 购买加密货币
        v-card-text
          v-btn(small,depressed,href="https://www.coinbase.com/",target="_blank").mr-2 coinbase
          v-btn(small,depressed,href="https://uphold.com/",target="_blank").mr-2 uphold
        v-card-text.text--disabled 付款方式取决于您当前所在的位置。

    v-dialog(v-model="showWithdraw",max-width="100%",width="550")
      v-card
        v-card-title.headline 提币到 {{currentWithdraw.asset}} 账户
        v-divider.pb-4
        v-card-text.mb-5
          v-text-field(
            :autocomplete="false"
            v-model="toAddress"
            label="请输入地址",
            messages="使用比特币（BTC）以外的地址将导致永久提款损失。"
          ) 

        v-card-text.pb-0(v-if="currentWithdraw.asset == 'TRX' || currentWithdraw.asset == 'XRP'")
          v-text-field(
            v-model="tagContent"
            :autocomplete="false"
            label="请输入地址标签",
            hide-details
          ).my-0.py-0

        v-card-text.pb-3(v-if="currentWithdraw.asset == 'TRX' || currentWithdraw.asset == 'XRP'")
          v-checkbox(v-model="hasTag",label="没有标签",hide-details,small).py-0.my-2

        v-card-text.mb-2
          v-text-field(
            :autocomplete="false"
            type="number"
            v-model="txAmount"
            label="提款次数",
            messages="可用余额： 20000.00"
          )
        v-card-text
          v-row
            v-col.font-weight-bold(cols="auto") 提示：
            v-col
              .text--disabled 最小：₿ 0.00100000
              .text--disabled 费用：₿ 0.00010000
        v-card-text.text-center
          v-btn(depressed,@click="startWithdraw") 下一步
        

</template>
    
<script>
export default {
  layout: "empty",
  data() {
    return {
      https:'http://47.112.159.153:8080',
      searchCoin: "全部",
      isLoading: false,
      toAddress: "",
      txAmount: "",
      currentQR: "/logo.jpg",
      currentAddr: "a1sd1f12a1sd15664av4hsfgdg633",
      hasTag: false,
      showRecharge: false,
      showWithdraw: false,
      currentCoin: {},
      currentWithdraw: {},
      currentShowCoin: {},
      allCoins: [],
      tagContent: "",
      hasTag: false,
      transHistory: {
        headers: [
          {
            text: "币种",
            sortable: false,
            filterable: true,
            value: "Asset"
          },
          {
            text: "类型",
            sortable: false,
            value: "Type"
          },
          {
            text: "额度",
            sortable: false,
            value: "Amount"
          },
          {
            text: "目标地址",
            sortable: false,
            value: "ToAddress"
          },
          {
            text: "当前块高",
            sortable: false,
            value: "ConfirmHeight"
          },
          {
            text: "最大块高",
            sortable: false,
            value: "MaxConfirmHeight"
          },
          {
            text: "创建时间",
            sortable: false,
            value: "CreatedAt"
          },
          {
            text: "失败原因",
            sortable: false,
            value: "ErrorMsg"
          },
        ],
        items: []
      }
    }
  },
  computed: {
    calcCoins() {
      return [].concat([{asset: '全部'}],this.allCoins)
    }
  },
  async mounted() {
    this.startRecharge()
    this.getTransHistory(false)
  },
  methods: {
    filterTableData(value,search,item) {
      if (search == '全部') {
        return true
      } else {
        return item.Asset == search
      }
    },
    formatTime(t) {
      let tm = new Date(t)
      return tm.toLocaleString()
    },
    async getTransHistory(t=true) {
      this.isLoading = true
      try {
        let res = await this.$axios.$get(`${this.https}/v1/user/order`)
        if (res.code == 0) {
          this.transHistory.items = res.data
          if (t) {
            this.$success('success')
          }
        } else {
          this.$error('无法获取订单记录')
        }
      } catch (error) {
        this.$error('获取订单记录异常')
      }
      this.isLoading = false
    },
    copyAddress() {
      let ele = document.getElementById('depositaddress')
      ele.focus()
      ele.select()
      this.$setClip(this.currentCoin.depositAddress)
      this.$info('Please press Ctrl + C')
    },
    async startRecharge() {
      try {
        let res = await this.$axios.$get(`${this.https}/v1/user/assetMsg`)
        if (res.code == 0) {
          this.allCoins = res.data
          if (this.allCoins.length > 0) {
            this.currentCoin = this.allCoins[0]
            this.currentWithdraw = this.allCoins[0]
            this.currentShowCoin = this.allCoins[0]
          }
        } else {
          this.$error('获取充币地址失败')
        }
      } catch (error) {
        this.$error('获取充币地址异常')
      }
    },
    async startWithdraw() {
      if (this.currentWithdraw.asset == 'TRX' || this.currentWithdraw.asset == 'XRP') {
        if (!this.tagContent && !this.hasTag) {
          this.$error('如果您不想填写标签，请选中“无标签”')
          return
        }
      }
      this.showWithdraw = true
      try {
        let data = {}
        data.asset = this.currentWithdraw.asset
        let address = ''
        if((this.currentWithdraw.asset == 'TRX' ||this.currentWithdraw.asset == "XRP") && !this.hasTag){
           address= this.toAddress + this.tagContent
        }else{
          address = this.toAddress
        }
        data.toAddress = address
        data.txAmount =  parseFloat(this.txAmount)
        let res = await this.$axios.$post(`${this.https}/v1/user/withdraw`,data)
        if (res.code == 0) {
          this.$success('success')
        } else if (res.code == 10001) {
          this.$error('余额不足')
        } else if (res.code == 10002) {
          this.$error('IB服务异常')
        } else {
          this.$error('提款失败')
        }
      } catch (error) {
         this.$error('异常')
      }
    }
  }
}
</script>

<style lang="stylus">
.v-overlay--active .v-overlay__scrim {
  background: #333 !important;
  opacity: 0.8 !important;
}

.addr-input {
  position: relative;

  .input-layer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
  }
}
</style>