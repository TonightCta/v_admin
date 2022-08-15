<template>
  <div class="index-coins-count p-18-20">
    <div class="public-title">
      <p class="title-msg">币种统计</p>
      <div class="date-select">
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
          <el-table-column prop="coin" label="币种"> </el-table-column>
          <el-table-column prop="today" label="今日收款"> </el-table-column>
          <el-table-column prop="yes_day" label="昨日收款"> </el-table-column>
          <el-table-column prop="balance" label="账户余额">
            <template slot-scope="{ row }">
              <div class="bold-text">{{ row.balance }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="balance_usdt" label="当前估值 ($)">
          </el-table-column>
          <el-table-column label="当前汇率">
            <template slot-scope="{ row }">
              <div>{{ row.rate }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="data-page">
        <el-pagination layout="prev, pager, next" :total="1000">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const space = 6;
let _minDate = "";
import dayjs from "dayjs";
export default {
  options: { styleIsolation: "shared" },
  data() {
    return {
      filterDateCount: "",
      timeOptionRange: null,
      pickerOptions: {
        disabledDate: (time) => {
          if (_minDate) {
            const min = dayjs(_minDate).subtract(space, "day");
            const max = dayjs(_minDate).add(space, "day") > Date.now() ? Date.now() - 86400000 : dayjs(_minDate).add(space, "day");
            return (
              dayjs(time).isBefore(min) || dayjs(max).isBefore(time)
            );
          } else {
            return time.getTime() > Date.now() - 86400000;
          }
        },
        onPick({ minDate }) {
          _minDate = minDate;
        },
      },
      tableData: [
        {
          coin: "TRX",
          today: "55.265441",
          yes_day: "55.265441",
          balance: "55.265441",
          balance_usdt: "55.265441",
          rate: "1 USDT ≈ 6.69 INR",
        },
      ],
    };
  },
};
</script>

<style>
</style>