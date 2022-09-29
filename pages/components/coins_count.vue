<template>
  <div class="index-coins-count p-18-20">
    <div class="public-title">
      <p class="title-msg">利润/余额提取</p>
      <div class="date-select">
        <!-- 类型 -->
        <div class="select-type select-public">
          <el-select
            size="mini"
            clearable
            style="width: 100px"
            v-model="dataType"
            placeholder="类型"
            @change="selectType"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 币种 -->
        <div class="select-coin-table select-public">
          <el-select
            size="mini"
            clearable
            style="width: 140px"
            v-model="coinType"
            placeholder="币种"
            @change="selectCoin"
          >
            <el-option
              v-for="item in allCoins"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="select-picker">
          <el-date-picker
            v-model="filterDateCount"
            type="daterange"
            size="mini"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="selectDate"
          >
          </el-date-picker>
          <p class="">
            <img :src="require('../../assets/images/date_icon.png')" alt="" />
          </p>
        </div>
      </div>
    </div>
    <div class="count-list">
      <div class="data-list">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#F9FAFC' }"
        >
          <el-table-column prop="mch_name" label="商户名称" width="180">
          </el-table-column>
          <el-table-column
            prop="mch_balance"
            label="处理前后台余额"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="coin" label="币种" width="110">
          </el-table-column>
          <el-table-column
            prop="from_before_balance"
            width="180"
            label="处理前链上余额"
          >
          </el-table-column>
          <el-table-column label="转出地址">
            <template slot-scope="{ row }">
              <el-tooltip effect="dark" :content="row.from" placement="top">
                <p class="text-overflow">{{ row.from }}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="目标地址">
            <template slot-scope="{ row }">
              <el-tooltip effect="dark" :content="row.from" placement="top">
                <p class="text-overflow">{{ row.to }}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="转出数量" width="240" prop="amount">
          </el-table-column>
          <el-table-column label="操作时间" width="180" prop="created_at">
          </el-table-column>
          <el-table-column label="备注" header-align="center" width="140">
            <template slot-scope="{ row }">
              <p :style="{textAlign:'center'}">{{row.comment ? row.comment : '-'}}</p>
            </template>
          </el-table-column>
          <el-table-column header-align="right" label="交易哈希" width="150">
            <template slot-scope="{ row }">
              <div class="text-right"><button @click="viewHash(row)">查看</button></div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="data-page">
        <el-pagination
          @current-change="pageChange"
          layout="prev, pager, next"
          :total="dataTotal"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  options: { styleIsolation: "shared" },
  props: {
    merchantID: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      filterDateCount: "",
      timeOptionRange: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      tableData: [],
      dataTotal: 10,
      page: 1,
      typeList: [
        {
          value: "99",
          label: "全部",
        },
        {
          value: "1",
          label: "利润结算",
        },
        {
          value: "2",
          label: "提取余额",
        },
      ],
      dataType: "99",
      coinType:'全部',
    };
  },
  watch: {
    merchantID: {
      immediate: true,
      handler: function (v) {
        this.coinMsg();
      },
    },
  },
  computed:{
    allCoins() {
      let coins = [this.$vuetify.lang.t("$vuetify.table.all")];
      return coins.concat(
        Object.keys(this.$store.state.bossAssetsCenter.allCoins)
      );
    }
  },
  mounted(){
    console.log(this.allCoins)
  },
  methods: {
    //币种统计
    async coinMsg() {
      const result = await this.$store.dispatch("bossAssetsCenter/clearLog", {
        mch_id: this.merchantID,
        page: this.page,
        limit: 10,
        type:this.dataType != 99 ? this.dataType : '',
        coin:this.coinType != '全部' ? this.coinType : '',
        start: this.filterDateCount ? this.filterDateCount[0] : "",
        end: this.filterDateCount ? this.filterDateCount[1] : "",
      });
      this.dataTotal = result.data.total;
      this.tableData = result.data.list;
    },
    //分页器
    pageChange(val) {
      this.page = val;
    },
    //查看
    viewHash(_item){
      window.open(_item.link);
      this.coinMsg();
    },
    //选择类型
    selectType(_itme){
      this.coinMsg();
    },
    //选择币种
    selectCoin(_item){
      this.coinMsg();
    },
    //选择时间
    selectDate(_item){
      this.coinMsg();
    }
  },
};
</script>

<style>
</style>