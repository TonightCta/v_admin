<template>
  <div class="index-coins-count p-18-20">
    <div class="public-title">
      <p class="title-msg">币种统计</p>
      <!-- <div class="date-select">
        <div class="select-picker">
          <el-date-picker
            v-model="filterDateCount"
            type="daterange"
            size="mini"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <p class="">
            <img :src="require('../../assets/images/date_icon.png')" alt="" />
          </p>
        </div>
      </div> -->
    </div>
    <div class="count-list">
      <div class="data-list">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#F9FAFC' }"
        >
          <el-table-column prop="coin" label="币种"> </el-table-column>
          <el-table-column prop="todayDeposit" label="今日充值">
          </el-table-column>
          <el-table-column prop="yesterdayDeposit" label="昨日充值">
          </el-table-column>
          <el-table-column prop="todayWithdraw" label="今日提币">
          </el-table-column>
          <el-table-column
            label="昨日提币"
            prop="yesterdayWithdraw"
          ></el-table-column>
          <!-- <el-table-column prop="balance" label="账户余额">
            <template slot="header">
              <div class="balance-box">
                <p>账户余额</p>
                <el-popover
                  placement="top"
                  trigger="hover"
                  content="可代付余额 + 可提现余额"
                >
                  <img
                    :src="require('../../assets/images/q_icon.png')"
                    slot="reference"
                  />
                </el-popover>
              </div>
            </template>
            <template slot-scope="{ row }">
              <div class="bold-text">{{ row.balance }}</div>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <!-- <div class="data-page">
        <el-pagination layout="prev, pager, next" :total="10">
        </el-pagination>
      </div> -->
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
  methods: {
    //币种统计
    async coinMsg() {
      const result = await this.$store.dispatch("bossAssetsCenter/coinLog", {
        mch_id: this.merchantID,
      });
      this.tableData = result.data;
    },
  },
};
</script>

<style>
</style>