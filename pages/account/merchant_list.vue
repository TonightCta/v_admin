<template lang="html">
  <div class="merchant-addresses pa-6">
    <v-card style="flex-grow: 1">
      <v-card-title>
        <div class="title">{{ $vuetify.lang.t("$vuetify.mine.商家列表") }}</div>
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
            <!-- <v-text-field
              v-model="query.merchant"
              style="width: 240px; transform: scale(0.85)"
              item-text="state"
              item-value="abbr"
              :placeholder="$vuetify.lang.t('$vuetify.merchantInfo.merchantName')"
              dense
              outlined
              hide-details
            >
            </v-text-field> -->
            <el-select
              v-model="query.merchant"
              filterable
              style="width: 150px; transform: scale(0.9)"
              :placeholder="$vuetify.lang.t('$vuetify.mine.商户邮箱')"
            >
              <el-option
                v-for="(item, index) in merchantListVal"
                :key="index"
                :label="item"
                :value="item"
              >
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
          <p class="lable-line" v-if="isAdmin"></p>
          <!-- 新开商户 -->
          <v-btn
            v-if="isAdmin"
            depressed
            color="primary"
            @click="addMerchantBox = true"
          >
            {{ $vuetify.lang.t("$vuetify.mine.新增商户") }}
          </v-btn>
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
            <div class="list-oper" style="display: flex">
              <div
                class="can-click bg-click"
                @click="
                  $store.state.bossAssetsCenter.merchantInfo.is_admin
                    ? autoLogin(item)
                    : null
                "
                :style="{
                  cursor: $store.state.bossAssetsCenter.merchantInfo.is_admin
                    ? 'pointer'
                    : 'not-allowed',
                  color: $store.state.bossAssetsCenter.merchantInfo.is_admin
                    ? '#5f74d2'
                    : '#999',
                }"
              >
                <!-- {{ $vuetify.lang.t("$vuetify.mine.导入地址") }} -->
                <el-button
                  size="mini"
                  type="default"
                  style="background:#0068FF;"
                  >登录</el-button
                >
              </div>
              <div
                class="can-click"
                @click="
                  editName = item.name;
                  editID = item.mch_id;
                  editEmail = item.email;
                  editNicknameBox = true;
                "
              >
                <el-button
                  size="mini"
                  type="default"
                  >编辑</el-button
                >
              </div>
              <div class="can-click-icon" @click="deleteAccount(item)">
                <img :src="require('../../assets/images/delete_btn.png')" alt="">
              </div>
            </div>
          </template>
          <template v-slot:item.status="{ item }">
  <div :class="['status-box', item.status == 1 ? 'on-status' : 'off-status']">
    {{
      item.status == 1
        ? $vuetify.lang.t("$vuetify.mine.正常")
        : $vuetify.lang.t("$vuetify.mine.冻结")
    }}
  </div>
</template>
                                <template v-slot:item.ip_list="{ item }">
  <div>{{ item.ip_list ? item.ip_list : "-" }}</div>
</template>
                                <template v-slot:item.create="{ item }">
  <div>
    {{ item.created_at }}
  </div>
</template>
                                <template v-slot:item.switch="{ item }">
  <div class="">
    <el-switch
      v-model="item.status"
      active-color="#18C711"
      inactive-color="#FF4D4E"
      :active-value="1"
      :inactive-value="0"
      @change="changeStatus('status', item)"
    >
    </el-switch>
  </div>
</template>
          <template v-slot:item.switch_admin="{ item }">
  <el-switch
    v-model="item.is_admin"
    active-color="#18C711"
    inactive-color="#FF4D4E"
    :active-value="1"
    :inactive-value="0"
    @change="changeStatus('is_admin', item)"
  >
  </el-switch>
</template>
        </v-data-table>
      </div>
      <v-divider />
      <v-card-text class="d-flex align-center justify-center">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="pageChange"
          :total="pagination.total"
        >
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
          {{ $vuetify.lang.t("$vuetify.mine.导入地址") }}
          <v-btn icon @click="showTransModel = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="my-2 px-24">
          <div class="up-file-box">
            <input type="file" @change="chooseWalletFile" />
            <p>
              {{
                fileStatus
                  ? fileStatus
                  : this.$vuetify.lang.t("$vuetify.mine.请选择文件")
              }}
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :loading="transfetPending"
            @click="turnTransfer()"
          >
            {{ $vuetify.lang.t("$vuetify.mine.确认") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 新增商户 -->
    <v-dialog
      v-model="addMerchantBox"
      v-if="addMerchantBox"
      width="800"
      persistent
      no-click-animation
    >
      <v-card class="headline pr-2 pb-6">
        <div class="add-title">
          <p>
            {{ $vuetify.lang.t("$vuetify.mine.新增商户") }}
          </p>
          <img
            @click="addMerchantBox = false"
            :src="require('../../assets/images/close_icon_2.png')"
            alt=""
          />
        </div>
        <div class="add-content">
          <div class="inp-box-parent">
            <div class="inp-box">
              <p>
                {{ $vuetify.lang.t("$vuetify.loginPage.email") }}<span></span>
              </p>
              <input
                type="text"
                v-model="add.email"
                :placeholder="$vuetify.lang.t('$vuetify.mine.请输入邮箱地址')"
              />
            </div>
            <div class="inp-box">
              <p>商户名称<span></span></p>
              <input
                type="text"
                v-model="add.merchant_name"
                placeholder="请输入商户名称"
              />
            </div>
          </div>
          <div class="inp-box-parent">
            <div class="inp-box">
              <p>{{ $vuetify.lang.t("$vuetify.mine.登录密码") }}</p>
              <input
                :type="passType"
                v-model="add.password"
                :placeholder="
                  $vuetify.lang.t('$vuetify.mine.请输入登录密码(至少8位)')
                "
              />
              <div v-if="add.password" class="type-oper">
                <img
                  :src="require('../../assets/images/see.png')"
                  @click="passType = 'text'"
                  v-if="passType == 'password'"
                  alt=""
                />
                <img
                  :src="require('../../assets/images/un_see.png')"
                  @click="passType = 'password'"
                  alt=""
                  v-else
                />
              </div>
            </div>
            <div class="inp-box">
              <p>{{ $vuetify.lang.t("$vuetify.mine.交易密码") }}</p>
              <input
                :type="tradeType"
                v-model="add.tradePass"
                :placeholder="
                  $vuetify.lang.t('$vuetify.mine.请输入交易密码(至少6位)')
                "
              />
              <div v-if="add.tradePass" class="type-oper">
                <img
                  :src="require('../../assets/images/see.png')"
                  @click="tradeType = 'text'"
                  v-if="tradeType == 'password'"
                  alt=""
                />
                <img
                  :src="require('../../assets/images/un_see.png')"
                  @click="tradeType = 'password'"
                  alt=""
                  v-else
                />
              </div>
            </div>
          </div>
          <div class="inp-box">
            <p>选择类型</p>
            <div class="inp-select">
              <el-radio v-model="add.accountType" label="1"
                >内部(自有服务)</el-radio
              >
              <el-radio v-model="add.accountType" label="2"
                >外部(UDUN服务)</el-radio
              >
            </div>
          </div>
          <div class="inp-box">
            <p>归集地址</p>
            <input
              type="text"
              :class="add.accountType == 2 && 'dis-inp'"
              :disabled="add.accountType == 2"
              v-model="add.address"
              placeholder="请输入归集地址"
            />
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="inp-oper">
            <v-btn
              color="primary"
              class="default-btn"
              text
              @click="addMerchantBox = false"
            >
              {{ $vuetify.lang.t("$vuetify.lable.cancel") }}
            </v-btn>
            <v-btn
              color="primary"
              class="primary-btn"
              :loading="loadAdd"
              text
              @click="submitAddMerchant"
            >
              {{ $vuetify.lang.t("$vuetify.mine.确认") }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <el-dialog title="编辑名称" :visible.sync="editNicknameBox" width="30%">
      <div class="edit-nickname">
        <p>邮箱</p>
        <input type="text" v-model="editEmail" placeholder="请输入邮箱地址" />
      </div>
      <div class="edit-nickname">
        <p>商户名称</p>
        <input type="text" v-model="editName" placeholder="请输入商户名称" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editNicknameBox = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitEdit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    return {
      merchantListVal: [], //商家选择
      merchantListService: [], //商家列表
      tableLoading: false,
      query: {
        merchant: '全部',
      }, //筛选条件
      showTransModel: false, //转账窗口
      transferMsg: {}, //转账信息
      desserts: [],
      pagination: {
        total: 1,
        current: 1,
      },
      transfetPending: false, //提币等待
      transferResult: "",
      errorMessage: "", //提币回执信息
      walletFile: null, //钱包文件
      snackbar: false, //错误信息
      errorMsg: "",
      fileStatus: null,

      addMerchantBox: false, //新增商户
      add: {
        email: null,
        password: null,
        tradePass: null,
        accountType: "1",
        address: null,
        merchant_name: null,
      },
      loadAdd: false,
      passType: "password",
      tradeType: "password",
      editNicknameBox: false, //编辑商户名
      editName: null, //新的商户名
      editID: null, //当前编辑ID
      value:1,
      editEmail:null,//编辑邮箱地址
    };
  },
  // $vuetify.lang.t('$vuetify.mine.确认')
  computed: {
    headers() {
      return this.isAdmin 
        ? [
        {
          text: "商户名称",
          sortable: false,
          value: "name",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.商户号"),
          sortable: false,
          value: "mch_id",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.邮箱"),
          sortable: false,
          value: "email",
        },
        
        {
          text: '白名单IP',
          sortable: false,
          align:'center',
          value: "ip_list",
        },
        {
          text: '开户时间',
          sortable: false,
          value: "create",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.状态"),
          sortable: false,
          value: "status",
          align: "center",
        },
        {
          text: '启用/禁用',
          sortable: false,
          value: "switch",
          align: "center",
        },
        {
          text: '管理员',
          sortable: false,
          value: "switch_admin",
          align: "center",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.操作"),
          sortable: false,
          value: "action",
          align: "right",
        },
      ]
        :  [
        {
          text: "商户名称",
          sortable: false,
          value: "name",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.商户号"),
          sortable: false,
          value: "mch_id",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.邮箱"),
          sortable: false,
          value: "email",
        },
        {
          text: '白名单IP',
          sortable: false,
          value: "ip_list",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.状态"),
          sortable: false,
          value: "status",
          align: "center",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.mine.操作"),
          sortable: false,
          value: "action",
          align: "right",
        },
      ];
    },
    isAdmin() {
      return this.$store.state.bossAssetsCenter.merchantInfo.is_admin;
    },
  },
  watch: {
    showTransModel(val) {
      !val && ((this.walletFile = null), (this.fileStatus = null));
    },
    addMerchantBox(val) {
      !val &&
        (this.add = {
          email: null,
          password: null,
          tradePass: null,
          accountType: "1",
          address: null,
        });
    },
  },
  created() {
    // this.query.merchant = this.$vuetify.lang.t("$vuetify.mine.全部");
    this.getMerchantList();
    this.getAllAddress();
  },
  methods: {
    //冻结 & 启用
    async changeStatus(_type,_item){
      const next = async () => {
        const result = await this.$store.dispatch('bossAssetsCenter/changeAccountStatus',{
            id:_item.id,
            key:_type,
            status:_type === 'status' ? _item.status : _item.is_admin
          });
          const { code } = result;
          if(code !== 200){
            Message.error(result.message);
            _type === 'status' && (_item.status = _item.status == 0 ? 1 : 0)
            _type === 'is_admin' && (_item.is_admin = _item.is_admin == 0 ? 1 : 0)
            return;
          };
          Message.success('操作成功');
      }
      if(_item.status === 0){
        this.$confirm(`此操作将冻结当前账号，当前账号下的所有操作将无法进行，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          next();
        }).catch(() => {
          _type === 'status' && (_item.status = _item.status == 0 ? 1 : 0)
          _type === 'is_admin' && (_item.is_admin = _item.is_admin == 0 ? 1 : 0)
        })
      }else{
        next()
      }
      
      
    },
    //删除账户
    async deleteAccount(_item){
      this.$confirm(`此操作将删除当前账号，当前账号下的所有操作将无法进行，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(async () => {
          const result = await this.$store.dispatch('bossAssetsCenter/deleAccount',{
            id:_item.id
          });
          const { code } = result;
          if(code != 200){
            Message.error(result.message);
            return
          };
          Message.success('删除成功');
          this.getAllAddress();
        })
      
    },
    //提交编辑名称
    async submitEdit() {
      if (!this.editName) {
        Message.error("请输入商户名称");
        return;
      }
      if(!this.editEmail){
        Message.error('请输入邮箱地址');
        return
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/editMerchantName",
        { mch_id: this.editID, name: this.editName,email:this.editEmail }
      );
      const { code } = result;
      if(code !== 200){
        Message.error(result.message);
        return;
      };
      Message.success('编辑成功');
      this.editNicknameBox = false;
      this.getAllAddress();
    },
    //自动登录
    autoLogin(_item) {
      const features =
        "height=800, width=1366, top=100, left=100, toolbar=no, menubar=no,scrollbars=no,resizable=no, location=no, status=no";
      window.open(
        `https://client.ib.cc/login?auto=${_item.mch_id}`,
        "NEW",
        features
      );
    },
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
        limit: 10,
        merchant_id: this.selectMerchant(this.query.merchant),
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/getAllMerchants",
        params
      );
      this.desserts = result.data.list;
      this.pagination.total = result.data.total;
      this.tableLoading = false;
    },
    //导入钱包
    drawCoin(_item) {
      this.transferMsg = _item;
      this.showTransModel = true;
    },
    //页码事件
    pageChange(_val) {
      this.pagination.current = _val;
      this.getAllAddress();
    },
    //选择钱包文件
    chooseWalletFile($event) {
      this.fileStatus = $event.target.files[0].name;
      this.walletFile = $event.target.files[0];
    },
    //确认提币
    async turnTransfer() {
      this.transfetPending = true;

      if (!this.walletFile) {
        //this.snackbar = true;
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请选择地址文件"));
        return;
      }
      const formdata = new FormData();
      formdata.append("merchant_id", this.transferMsg?.mch_id);
      formdata.append("file", this.walletFile);
      const result = await this.$store.dispatch(
        "bossAssetsCenter/importWallet",
        formdata
      );
      this.transfetPending = false;
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success(this.$vuetify.lang.t("$vuetify.mine.导入成功"));
      this.showTransModel = false;
    },
    //新增商户
    async submitAddMerchant() {
      if (!this.add.email) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入邮箱地址"));
        return;
      }
      if (!this.add.merchant_name) {
        Message.error("请输入商户名称");
        return;
      }
      if (!this.add.password) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入登录密码"));
        return;
      }
      if (this.add.password.length < 8) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.登录密码最少8位"));
        return;
      }
      if (!this.add.tradePass) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.请输入交易密码"));
        return;
      }
      if (this.add.tradePass.length < 6) {
        Message.error(this.$vuetify.lang.t("$vuetify.mine.交易密码最少6位"));
        return;
      }
      if (this.add.onlyTrx == 1 && !this.add.address) {
        Message.error("请输入归集地址");
        return;
      }
      this.loadAdd = true;
      const params = {
        email: this.add.email,
        password: this.add.password,
        pay_password: this.add.tradePass,
        onlyTrx: this.add.accountType,
        trx_pool_address: this.add.address,
        name: this.add.merchant_name,
      };
      const result = await this.$store.dispatch(
        "bossAssetsCenter/addMerchant",
        params
      );
      this.loadAdd = false;
      const { code } = result;
      if (code != 200) {
        Message.error(result.message);
        return;
      }
      Message.success(this.$vuetify.lang.t("$vuetify.mine.新增成功"));
      this.getAllAddress();
      this.addMerchantBox = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.up-file-box {
  height: 80px;
  border: 1px dashed #efefef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  position: relative;
  input {
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: absolute;
  }
  p {
    margin-top: 13px;
    margin-left: 24px;
  }
}
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
      .lable-line {
        width: 1px;
        height: 20px;
        background: #ccc;
        margin: 0 24px;
      }
    }
  }
  .table-mine {
    padding: 12px 16px;
    padding-bottom: 30px;
    .can-click {
      cursor: pointer;
      margin-left: 16px;
      button{
        color: rgb(95, 116, 210);
      }
    }
    .bg-click{
      button{
        color: white;
      }
    }
    .can-click:nth-child(2)::before{
      content: '';
      display: inline-block;
      height: 12px;
      width: 1px;
      background-color: #DBE7FF;
      margin-right: 10px;
      transform: translateY(2px);
    }
    .can-click-icon{
      img{
        width: 16px;
        height: 17px;
        vertical-align: middle;
        cursor: pointer;
      }
    }
    .can-click-icon::before{
      content: '';
      display: inline-block;
      height: 12px;
      width: 1px;
      background-color: #DBE7FF;
      margin:0 10px;
      transform: translateY(2px);
    }
    .list-oper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
.add-title {
  display: flex;
  justify-content: center;
  position: relative;
  height: 50px;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  align-items: center;
  margin-bottom: 30px;
  p {
    margin-bottom: 0;
  }
  img {
    width: 18px;
    height: 18px;
    top: 12px;
    right: 30px;
    position: absolute;
    cursor: pointer;
  }
}
.add-content {
  padding: 0 32px;
  .inp-box-parent {
    display: flex;
    justify-content: space-between;
    .inp-box {
      width: 47%;
    }
  }
  .inp-box {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    position: relative;
    .type-oper {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 16px;
      top: 8px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      font-size: 15px;
      width: 70px;
      text-align: justify;
      margin-bottom: 0;
      text-align-last: justify;
    }
    .inp-select {
      height: 44px;
      flex: 1;
      margin-left: 16px;
      transform: translateY(3px);
    }
    input {
      height: 44px;
      flex: 1;
      margin-left: 16px;
      border: 1px solid #f6f6f6;
      border-radius: 4px;
      font-size: 14px;
      color: #666;
      padding-left: 12px;
      outline: none;
    }
    input::placeholder {
      color: #999;
    }
    .dis-inp {
      background-color: #f8f8f8;
      cursor: no-drop;
    }
  }
}
.inp-oper {
  width: 100%;
  display: flex;
  justify-content: space-around;
  button {
    width: 48%;
    height: 40px !important;
    font-size: 14px;
  }
  .default-btn {
    background-color: white;
    border: 1px solid #eeeeee;
    color: #999 !important;
  }
  .primary-btn {
    background-color: #4266ff;
    color: white !important;
  }
}
.edit-nickname {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  p {
    white-space: nowrap;
    margin-right: 12px;
    margin-bottom: 0;
    width: 72px;
    margin-right: 16px;
    color: #666;
    font-size: 15px;
    font-weight: 500;
    text-align-last: justify;
  }
  input{
    flex: 1;
    height: 44px;
    border-radius: 4px;
    border: 1px solid #f6f6f6;
    outline: none;
    box-sizing: border-box;
    padding-left: 16px;
  }
}
.edit-nickname:last-child{
  margin-bottom: 0;
}
.status-box{
  width: 54px;
  border-radius: 4px;
  margin: 0 auto;
  font-size: 12px;
  padding: 2px 0;
}
.on-status{
  background-color: rgba(30,217,23,.1);
  color: #108F0B;
}
.off-status{
  background-color: #FFEBF0;
  color: #DE2829;
}
</style>