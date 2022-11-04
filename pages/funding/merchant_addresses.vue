<template lang="html">
  <div class="merchant-addresses pa-6">
    <v-card style="flex-grow: 1">
      <v-card-title>
        <div class="title">{{$vuetify.lang.t("$vuetify.mine.地址管理")}}</div>
      </v-card-title>
      <v-divider />
      <section class="filter-gather">
        <div>
          <!-- 商户选择 -->
          <div class="">
            <span
              >{{
                $vuetify.lang.t("$vuetify.table.merchant")
              }}&nbsp;:&nbsp;&nbsp;</span
            >
            <!-- $vuetify.lang.t('$vuetify.merchantInfo.merchantName') -->
            <!-- <v-text-field
              :placeholder="$vuetify.lang.t('$vuetify.merchantInfo.merchantName')"
              style="width: 240px; transform: scale(0.85)"
              hide-details
              v-model="query.merchant"
              dense
              outlined
              x-small
              single-line
            ></v-text-field> -->
          <el-select v-model="query.merchant" filterable style="width:150px;transform:scale(0.9)" :placeholder="$vuetify.lang.t('$vuetify.mine.商户邮箱')">
            <el-option v-for="(item,index) in merchantListVal" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
            <!-- <v-select
              v-model="query.merchant"
              :items="merchantListVal"
              style="width: 240px; transform: scale(0.85)"
              item-text="state"
              item-value="abbr"
              dense
              outlined
              hide-details
            ></v-select> -->
          </div>
          <!-- 地址 -->
          <div class="">
            <span
              >{{
                $vuetify.lang.t("$vuetify.table.address")
              }}&nbsp;:&nbsp;&nbsp;</span
            >
            <v-text-field
              :placeholder="$vuetify.lang.t('$vuetify.mine.请输入地址')"
              style="width: 240px; transform: scale(0.85)"
              hide-details
              v-model="query.address"
              dense
              outlined
              x-small
              single-line
            ></v-text-field>
          </div>
          <!-- 币种选择 -->
          <div class="">
            <span
              >{{
                $vuetify.lang.t("$vuetify.table.currency")
              }}&nbsp;:&nbsp;&nbsp;</span
            >
            <v-select
              v-model="query.coin"
              :items="coinListVal"
              style="width: 240px; transform: scale(0.85)"
              item-text="state"
              item-value="abbr"
              outlined
              dense
              hide-details
            ></v-select>
          </div>

          <div class="">
            <span
            >{{
                $vuetify.lang.t("$vuetify.mine.类型")
              }}&nbsp;:&nbsp;&nbsp;</span
            >
            <el-select v-model="query.is_self" filterable style="width:150px;transform:scale(0.9)" :placeholder="$vuetify.lang.t('$vuetify.mine.类型')">
              <el-option v-for="(item,index) in isSelfList" :key="index" :label="item.name" :value="item.val">
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- 查询按钮 -->
        <div>
          <v-btn
            depressed
            color="primary"
            :loading="tableLoading"
            @click="getAllAddress"
            >{{ $vuetify.lang.t("$vuetify.orderComponent.search") }}</v-btn
          >
        </div>
      </section>
      <!-- 数据表格 -->
      <div class="table-mine">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="10"
          :loading="tableLoading"
          hide-default-footer
          class="elevation-0"
        >
          <template v-slot:item.action="{ item }">
            <!-- <div class="can-click" @click="drawCoin(item)">提币</div> -->
            -
          </template>
          <template v-slot:item.is_self="{ item }">
            <div>
              {{ item.is_self == 1 ? $vuetify.lang.t("$vuetify.mine.商户主钱包") : "" }}
              {{
                item.is_self == 2 ? $vuetify.lang.t("$vuetify.mine.商户手续费钱包") : ""
              }}
              {{ item.is_self == 0 ? $vuetify.lang.t("$vuetify.mine.客户钱包") : "" }}
            </div>
          </template>
          <template v-slot:item.is_udun_address="{ item }">
            <div>
              {{ item.is_udun_address == 0 ? '自有' : 'UDUN' }}
            </div>
          </template>
          <template v-slot:item.mch_id="{ item }">
            <div>
              {{ item.merchant ?  item.merchant.name : '-' }}
            </div>
          </template>
        </v-data-table>
      </div>
      <v-divider />
      <v-card-text class="d-flex align-center justify-center">
        <!-- <v-pagination
          v-model="pagination.current"
          circle
          :length="pagination.total"
          :disabled="tableLoading"
          @input="pageChange"
        /> -->
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="pageChange"
          :total="pagination.total">
        </el-pagination>
      </v-card-text>
    </v-card>
    <!-- 提币 -->
    <v-dialog
      v-model="showTransModel"
      max-width="780"
      persistent
      no-click-animation
      v-if="showTransModel"
    >
      <v-card class="pb-4">
        <v-card-title class="headline pr-2 pb-6">
          {{$vuetify.lang.t('$vuetify.mine.提币确认')}}
          <v-btn icon @click="showTransModel = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="my-2 px-24">
          {{$vuetify.lang.t('$vuetify.mine.该操作会将当前操作地址资产全部提至商家归集钱包中')}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :loading="transfetPending"
            @click="turnTransfer()"
          >
            {{$vuetify.lang.t('$vuetify.mine.确认')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 错误信息 -->
    <v-dialog
      v-model="errorBox"
      v-if="errorBox"
      max-width="300"
      persistent
      no-click-animation
    >
      <v-card class="headline pr-2 pb-6">
        <v-card-title class="headline pr-2 pb-6">
          {{$vuetify.lang.t('$vuetify.mine.提币')}}{{ transferResult }}
        </v-card-title>
        <v-card-text class="my-2 px-24">
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="errorBox = false"> {{$vuetify.lang.t('$vuetify.mine.确认')}} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      merchantListVal: [], //商家选择
      merchantListService: [], //商家列表
      coinListVal: [], //币种选择
      tableLoading: false,
      query: {
        merchant: "全部",
        coin: "全部",
        address: null,
        is_self: null,
      }, //筛选条件
      showTransModel: false, //转账窗口
      transferMsg: {}, //转账信息
      desserts: [],
      pagination: {
        total: 1,
        current: 1,
      },
      transfetPending: false, //提币等待
      errorBox: false, //提币回执
      transferResult: "",
      errorMessage: "", //提币回执信息

      isSelfList: [],
    };
  },
  created() {
    this.query.coin = this.$vuetify.lang.t("$vuetify.mine.全部");
    this.query.is_self = null;
    this.isSelfList = [
      { name: this.$vuetify.lang.t("$vuetify.mine.商户主钱包"), val: 1 },
      { name: this.$vuetify.lang.t("$vuetify.mine.商户手续费钱包"), val: 2 },
      { name: this.$vuetify.lang.t("$vuetify.mine.客户钱包"), val: 0 },
    ];
    this.getMerchantList();
    this.getAllAddress();
  },
  computed: {
    headers() {
      return [
        {
          text: this.$vuetify.lang.t("$vuetify.mine.商户"),
          sortable: false,
          value: "mch_id",
        },
        {
          text: '创建时间',
          sortable: false,
          value: "created_at",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.地址"),
          sortable: false,
          value: "address",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.币种"),
          sortable: false,
          value: "coin",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.类型"),
          sortable: false,
          align:'center',
          value: "is_self",
        },
        {
          text: '是否UDUN地址',
          align:'center',
          sortable: false,
          value: "is_udun_address",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.业务ID"),
          sortable: false,
          value: "businessId",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.回调地址"),
          sortable: false,
          value: "notify_url",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.操作"),
          sortable: false,
          value: "action",
          align: "right",
        },
      ];
    },
  },
  methods: {
    //获取商家列表
    async getMerchantList() {
      const result = await this.$store.dispatch(
        "bossAssetsCenter/queryAllMerchant"
      );
      let arr = [];
      arr = result.data.map((e) => {
        return e.name;
      });
      arr.unshift(this.$vuetify.lang.t("$vuetify.mine.全部"));
      this.merchantListVal = arr;
      this.merchantListService = result.data;
      this.merchantListService.unshift({
        name: this.$vuetify.lang.t("$vuetify.mine.全部"),
        value: null,
      });
      this.coinListVal = Object.keys(
        this.$store.state.bossAssetsCenter.allCoins
      );
      this.coinListVal.unshift(this.$vuetify.lang.t("$vuetify.mine.全部"));
    },
    //选择商家
    selectMerchant(_val) {
      let val;
      this.merchantListService.forEach((e) => {
        if (_val == e.name) {
          val = e.value;
        }
      });
      return val;
    },

    //获取地址列表
    async getAllAddress() {
      this.tableLoading = true;
      const params = {
        page: this.pagination.current,
        limit: 50,
        merchant_id: this.selectMerchant(this.query.merchant),
        address: this.query.address,
        coin:
          this.query.coin == this.$vuetify.lang.t("$vuetify.mine.全部")
            ? null
            : this.query.coin,
        is_self: this.query.is_self,
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/queryAllAddress",
        params
      );
      this.desserts = result.data.list;
      this.pagination.total = result.data.total;
      this.tableLoading = false;
    },
    //提币
    drawCoin(_item) {
      this.transferMsg = _item;
      this.showTransModel = true;
    },
    //页码事件
    pageChange(_val) {
      this.pagination.current = _val;
      this.getAllAddress();
    },
    //确认提币
    async turnTransfer() {
      this.transfetPending = true;
      // showTransModel = false;
      const result = await this.$store.dispatch(
        "bossAssetsCenter/transferCoin",
        { address_id: this.transferMsg?.id }
      );
      const { code } = result;
      if (code != 200) {
        // this.transferResult = "失败";
        Message.error("Failed");
        this.errorMessage = result.message;
      } else {
        Message.success(
          this.$vuetify.lang.t(
            "$vuetify.mine.当前地址资产已全部提至商家归集钱包中"
          )
        );
        // this.transferResult = "成功";
        this.errorMessage = "当前地址资产已全部提至商家归集钱包中";
      }
      // this.errorBox = true;
      this.transfetPending = false;
      this.showTransModel = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.merchant-addresses {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  .filter-gather {
    display: flex;
    padding: 32px;
    justify-content: space-between;
    div {
      display: flex;
      align-items: center;
      margin-right: 24px;
    }
  }
  .table-mine {
    padding: 12px 16px;
    padding-bottom: 30px;
    .can-click {
      cursor: pointer;
      color: #4266ff;
    }
  }
}
.headline {
  justify-content: space-between;
}
.headline::before {
  display: none;
}
</style>