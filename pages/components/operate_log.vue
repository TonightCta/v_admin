<template>
  <div class="index-operate-log">
    <div class="operate-obx p-18-20">
      <div class="public-title">
        <p class="title-msg">经营概况</p>
        <div class="date-select">
          <div class="select-picker">
            <el-date-picker
              v-model="filterDate"
              type="daterange"
              size="mini"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="selecePickerE"
            >
            </el-date-picker>
            <p class="">
              <img :src="require('../../assets/images/date_icon.png')" alt="" />
            </p>
          </div>
          <div class="select-coin-echarts">
            <el-select
              v-model="selectCoin"
              @change="selectCoinEv"
              placeholder="请选择"
              size="mini"
              style="width: 120px"
            >
              <el-option
                v-for="item in options"
                :key="item.asset"
                :label="item.asset"
                :value="item.asset"
              >
              </el-option>
            </el-select>
          </div>
          <div class="down-unknow" @click="downEcharts">
            <img :src="require('../../assets/images/down_icon.png')" alt="" />
          </div>
        </div>
      </div>
      <div class="echarts-box-mine" id="echarts-box-mine"></div>
    </div>
    <div class="log-box p-18-20">
      <div class="public-title">
        <p class="title-msg">登录日志</p>
        <div class="date-select">
          <div class="select-picker">
            <el-date-picker
              v-model="filterDateLog"
              type="daterange"
              size="mini"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptionsLog"
              @change="selectLogDate"
            >
            </el-date-picker>
            <p class="">
              <img :src="require('../../assets/images/date_icon.png')" alt="" />
            </p>
          </div>
        </div>
      </div>
      <div class="log-list">
        <div class="data-list">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="商户名称" width="180">
              <template slot-scope="{ row }">
                <p>{{ row.merchant.name }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="登录IP" width="180">
            </el-table-column>
            <el-table-column label="登录时间" header-align="right">
              <template slot-scope="{ row }">
                <p class="text-right">{{ row.created_at }}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="data-page">
          <el-pagination
            layout="prev, pager, next"
            background
            @current-change="pageChange"
            :total="pagination.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const space = 6;
let _minDate = "";
import dayjs from "dayjs";
import * as echarts from "echarts";
import html2canvas from "html2canvas";
let opreateBox;
export default {
  props: {
    merchantID: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      filterDate: null,
      filterDateLog: null,
      pickerOptions: {
        disabledDate: (time) => {
          if (_minDate) {
            const min = dayjs(_minDate).subtract(space, "day");
            const max =
              dayjs(_minDate).add(space, "day") > Date.now()
                ? Date.now() - 86400000
                : dayjs(_minDate).add(space, "day");
            return dayjs(time).isBefore(min) || dayjs(max).isBefore(time);
          } else {
            return time.getTime() > Date.now() - 86400000;
          }
        },
        onPick({ minDate }) {
          _minDate = minDate;
        },
      },
      pickerOptionsLog: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      tableData: [],
      pagination: {
        size: 8,
        total: 1,
        current: 1,
      },
      options: [],
      selectCoin: "TRX",
      mch_id: null,
    };
  },
  watch: {
    merchantID: {
      immediate: true,
      handler: function (v) {
        this.billMsg();
        this.logMsg();
      },
    },
  },
  mounted() {
    setTimeout(() => {
      window.addEventListener("resize", this.turnResize, true);
    }, 3000);
  },
  created() {
    this.getCoins();
  },
  methods: {
    async getCoins() {
      const result = await this.$store.dispatch(
        "bossAssetsCenter/merchantAssetsInfo"
      );
      this.options = result.data.coinStatementList;
    },
    //分页器事件
    pageChange(_val) {
      this.pagination.current = _val;
      this.queryWalletAssetsFlow();
    },
    //选择币种
    selectCoinEv(_coin) {
      this.billMsg();
    },
    //选择图表日期
    selecePickerE() {
      if (this.filterDate == null) {
        _minDate = "";
      }
      this.billMsg();
    },
    //选择日志日期
    selectLogDate() {
      this.logMsg();
    },
    turnResize() {
      opreateBox.resize();
    },
    //登录日志
    async logMsg() {
      const result = await this.$store.dispatch("bossAssetsCenter/loginLog", {
        mch_id: this.merchantID,
        page: this.pagination.current,
        limit: this.pagination.size,
        start: this.filterDateLog ? this.filterDateLog[0] : "",
        end: this.filterDateLog ? this.filterDateLog[1] : "",
      });
      this.tableData = result.data.list;
      this.pagination.total = result.data.last_page * 10;
    },
    //获取数据
    async billMsg() {
      opreateBox = null;
      // 经营概况
      const result = await this.$store.dispatch(
        "bossAssetsCenter/billOverView",
        {
          mch_id: this.merchantID,
          coin: this.selectCoin,
          start: this.filterDate ? this.filterDate[0] : "",
          end: this.filterDate ? this.filterDate[1] : "",
        }
      );
      const date = result.data.deposits.map((item) => {
        return item.date;
      });
      const deposits = result.data.deposits.map((item) => {
        return item.total;
      });
      const withdraw = result.data.withdraw.map((item) => {
        return item.total;
      });
      const userDeposits = result.data.userDeposits.map((item) => {
        return item.total;
      });
      const userWithdraw = result.data.userWithdraw.map((item) => {
        return item.total;
      });
      this.initEchartsMine(
        date,
        deposits,
        withdraw,
        userDeposits,
        userWithdraw
      );
    },
    // 初始化Echarts
    async initEchartsMine(
      _date,
      _deposits,
      _withdraw,
      _userDeposits,
      _userWithdraw
    ) {
      opreateBox = null;
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let result = "";
            params.forEach((e) => {
              result +=
                `<div style="margin-top:12px;display:flex;justify-content: space-between;"><div style="display:flex;"><p style="transform:scale(0.7);">${e.marker}</p>` +
                `<p>${e.seriesName}</p></div>` +
                `<p style="margin-left:16px;">${Number(e.value).toFixed(
                  4
                )}&nbsp;${
                  this.selectCoin === "TRX" ? this.selectCoin : "U"
                }</p></div>`;
            });
            return params[0].name + result;
          },
        },
        legend: {
          data: [
            "商户充值",
            "商户提币",
            "用户提币",
            "用户充值",
            "Search Engine",
          ],
          icon: "circle",
          itemWidth: 6,
          itemGap: 48,
          textStyle: {
            fontSize: 14,
            color: "#999",
            padding: [0, 0, 0, 10],
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: _date,
            axisTick: false,
            offset: 10,
            axisLabel: {
              color: "#999999",
              fontSize: 14,
            },
            axisLine: false,
          },
        ],
        yAxis: [
          {
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#F5F5FC",
                width: 2,
              },
            },
            axisLabel: {
              color: "#999999",
            },
            splitLine: false,
          },
        ],
        series: [
          {
            name: "商户充值",
            type: "line",
            stack: "Total",
            itemStyle: {
              color: "rgb(101,220,123)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(101,220,123,.3)",
                },
                {
                  offset: 1,
                  color: "rgba(101,220,123,.1)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: _deposits,
          },
          {
            name: "商户提币",
            type: "line",
            stack: "Total",
            itemStyle: {
              color: "rgb(76,227,249)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(76,227,249,.3)",
                },
                {
                  offset: 1,
                  color: "rgba(76,227,249,0.1)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: _withdraw,
          },
          {
            name: "用户提币",
            type: "line",
            stack: "Total",
            itemStyle: {
              color: "rgb(255,212,130)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(255,212,130,.4)",
                },
                {
                  offset: 1,
                  color: "rgba(255,212,130,0.2)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: _userWithdraw,
          },
          {
            name: "用户充值",
            type: "line",
            stack: "Total",
            itemStyle: {
              color: "rgb(107,128,251)",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(107,128,251,.3)",
                },
                {
                  offset: 1,
                  color: "rgba(107,128,251,0.1)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: _userDeposits,
          },
        ],
      };
      opreateBox = echarts.getInstanceByDom(
        document.getElementById("echarts-box-mine")
      );
      if (!opreateBox) {
        opreateBox = echarts.init(document.getElementById("echarts-box-mine"));
      }
      opreateBox.setOption(option);
    },
    //下载echarts
    downEcharts() {
      html2canvas(document.getElementById("echarts-box-mine")).then(
        (canvas) => {
          const img = canvas
            .toDataURL("image/png")
            .replace("image/png", "image-octet/stream");
          const downImg = document.createElement("a");
          downImg.download = "经营概况.png";
          downImg.href = img;
          document.body.appendChild(downImg);
          downImg.click();
          downImg.remove();
        }
      );
    },
  },
};
</script>

<style>
</style>