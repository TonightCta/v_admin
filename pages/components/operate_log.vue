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
              :picker-options="pickerOptions"
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
            <el-table-column prop="name" label="商户名称" width="280">
            </el-table-column>
            <el-table-column prop="ip" label="登录IP" width="280">
            </el-table-column>
            <el-table-column label="登录时间" header-align="right">
                <template slot-scope="{ row }">
                   <div class="text-right">{{row.date}} </div>
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
  </div>
</template>

<script>
import * as echarts from "echarts";
import html2canvas from "html2canvas";
let opreateBox;
export default {
  data() {
    return {
      filterDate: "",
      filterDateLog: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      tableData: [
        {
          date: "2022-02-05 14:25:56",
          name: "王小虎",
          ip: "145.25.29.36",
        },
        {
          date: "2022-02-05 14:25:56",
          name: "王小虎",
          ip: "145.25.29.36",
        },
        {
          date: "2022-02-05 14:25:56",
          name: "王小虎",
          ip: "145.25.29.36",
        },
        {
          date: "2022-02-05 14:25:56",
          name: "王小虎",
          ip: "145.25.29.36",
        },
      ],
    };
  },
  mounted() {
    this.initEchartsMine();
    setTimeout(() => {
      window.addEventListener("resize", this.turnResize, true);
    }, 3000);
  },
  methods: {
    turnResize(){
        opreateBox.resize()
    },  
    // 初始化Echarts
    async initEchartsMine() {
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            let result = "";
            params.forEach((e) => {
              result +=
                `<div style="margin-top:12px;display:flex;width:150px;justify-content: space-between;"><div style="display:flex;"><p style="transform:scale(0.7);">${e.marker}</p>` +
                `<p>${e.seriesName}</p></div>` +
                `<p>${e.value}&nbsp;U</p></div>`;
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
            data: [
              "08-08",
              "08-09",
              "08-10",
              "08-11",
              "08-12",
              "08-13",
              "08-14",
            ],
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
            data: [120, 132, 101, 134, 90, 230, 210],
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
            data: [220, 182, 191, 234, 290, 330, 310],
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
            data: [150, 232, 201, 154, 190, 330, 410],
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
            data: [320, 332, 301, 334, 390, 330, 320],
          },
        ],
      };
      opreateBox = echarts.init(document.getElementById("echarts-box-mine"));
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