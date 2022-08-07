<template lang="pug">
.merchant-withdraw-addr.pa-6
  v-card(style="flex-grow:1")
    v-card-title
      v-breadcrumbs.pa-0(large, :items="breadCrumbs")
      v-spacer
      v-btn(depressed, @click="addAddress", color="primary") {{ $vuetify.lang.t('$vuetify.lable.add') }}
    v-divider
    v-card-text
      v-data-table.elevation-0(
        :loading="tableLoading",
        :headers="allAddress.headers",
        :items="allAddress.items",
        :items-per-page="pagination.size",
        hide-default-footer
      )
        template(v-slot:item.address="{ item }")
          span {{ getItemAddress(item.address) }}
        template(v-slot:item.note="{ item }")
          span {{ getItemTag(item.address) }}
        template(v-slot:item.operation="{ item }")
          v-btn(small, text, color="primary", @click="withdrawCoin(item)") {{ $vuetify.lang.t('$vuetify.table.withdraw') }}
          v-btn(small, text, color="primary", @click="updateAddress(item)") {{ $vuetify.lang.t('$vuetify.lable.edit') }}
          v-btn(small, text, color="error", @click="deleteAddress(item)") {{ $vuetify.lang.t('$vuetify.lable.delete') }}

    v-divider
    v-card-text.d-flex.align-center.justify-center
      v-pagination.custom-pagination(
        circle,
        v-model="pagination.current",
        :length="pagination.total",
        @input="pageChange"
      )

  v-dialog(
    v-model="showDeleteAddress",
    max-width="460",
    v-if="showDeleteAddress"
  )
    v-card
      v-card-title {{ $vuetify.lang.t('$vuetify.lable.prompt') }}
      v-card-text.subtitle-1 {{ $vuetify.lang.t('$vuetify.lable.delete_address_tip') }}
      v-card-actions.py-4.px-6
        v-spacer
        v-btn.mr-2(outlined, @click="closeDelete") {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
        v-btn(color="primary", depressed, @click="submitDelete") {{ $vuetify.lang.t('$vuetify.lable.ok') }}

  v-dialog(
    v-model="showEditAddress",
    max-width="550",
    persistent,
    no-click-animation,
    v-if="showEditAddress"
  )
    v-card
      v-card-title {{ editType == 'add' ? $vuetify.lang.t('$vuetify.lable.add_address') : $vuetify.lang.t('$vuetify.lable.edit_address') }}
      v-divider.mb-6

      v-card-text.my-0.px-12
        v-select(
          v-model="coinType",
          :label="$vuetify.lang.t('$vuetify.table.currency')",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.select_currency')",
          :items="Object.keys(allCoins)",
          item-text="shortname",
          item-value="shortname",
          :rules="[rules.required]"
        ) 

      v-card-text.my-0.px-12
        v-text-field(
          v-model="coinAddress",
          :loading="addrLoading",
          :label="$vuetify.lang.t('$vuetify.table.address')",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.address')",
          :rules="[rules.required]",
          :error="address_error_status",
          :error-messages="address_error_msg",
          @blur="checkAddress"
        ) 

      v-card-text.my-0.px-12(
        v-if="coinType == 'XRP' || coinType == 'EOS'",
        style="padding-bottom:0;"
      )
        v-text-field(
          v-model="coinTag",
          :label="$vuetify.lang.t('$vuetify.table.tag')",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.tag')",
          :disabled="hasTag"
        ) 
      v-card-text.my-0.px-14(v-if="coinType == 'XRP' || coinType == 'EOS'")
        .card-label
        v-checkbox.mt-0.pt-0(
          v-model="hasTag",
          :label="$vuetify.lang.t('$vuetify.lable.not_tag')",
          hide-details,
          small
        )

      v-card-text.my-0.px-12
        v-text-field(
          v-model="verifyCode",
          :label="$vuetify.lang.t('$vuetify.loginPage.verifyCode')",
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterVerifyCode')",
          :rules="[rules.verifyCode]"
        ) 
          template(slot="append")
            v-btn(
              small,
              rounded,
              outlined,
              style="margin-top:-6px",
              :disabled="disabledVerifyCode",
              @click="sendVerifyCode"
            ) {{ sendingTime > 0 ? sendingTime + 's' : $vuetify.lang.t('$vuetify.loginPage.getVerifyCode') }}

      v-card-text.my-0.px-12.pb-0
        v-text-field(
          v-model="transPwd",
          :label="$vuetify.lang.t('$vuetify.loginPage.transPwd')",
          :placeholder="$vuetify.lang.t('$vuetify.loginPage.enterTransPwd')",
          type="password",
          :rules="[rules.transPwd]"
        )

      v-card-text.px-12.text-right.pb-0
        v-btn(text, color="primary", @click="toForgetTransPwd") {{ $vuetify.lang.t('$vuetify.loginPage.forget') }}

      v-card-actions.pl-12.py-4
        v-btn.mr-2(
          depressed,
          color="primary",
          :disabled="disabledAddAddress",
          :loading="isSubmitting",
          @click="submitAddress"
        ) {{ $vuetify.lang.t('$vuetify.lable.save') }}

        v-btn(outlined, @click="closeEdit") {{ $vuetify.lang.t('$vuetify.lable.cancel') }}
</template>
    
<script>
import eVue from "~/plugins/eVue";
var that = null;
export default {
  data: () => {
    return {
      tableLoading: false,
      isSubmitting: false,
      addrLoading: false,
      coinType: "",
      coinAddress: "",
      coinTag: "",
      hasTag: false,
      verifyCode: "",
      transPwd: "",
      currentCoin: {},
      sendingTimer: null,
      sendingTime: 0,
      editType: "add",
      showDeleteAddress: false,
      showEditAddress: false,
      address_error_status: false,
      address_error_msg: "",
      breadCrumbs: [],
      allAddress: {
        headers: [],
        items: [],
      },
      rules: {
        required: (value) => {
          return !!value || that.$vuetify.lang.t("$vuetify.loginPage.required");
        },
        verifyCode: (value) => {
          const pattern = /^[a-zA-Z0-9]*$/;
          return (
            (pattern.test(value) && value.length > 0) ||
            that.$vuetify.lang.t("$vuetify.loginPage.inValidVerifyCode")
          );
        },
        transPwd: (value) => {
          const pattern = /^[0-9]*$/;
          return (
            (pattern.test(value) && value.length == 6) ||
            that.$vuetify.lang.t("$vuetify.loginPage.inValidTransPwd")
          );
        },
      },
      pagination: {
        current: 1,
        size: 15,
        total: 10,
      },
    };
  },
  computed: {
    allCoins() {
      return this.$store.state.bossAssetsCenter.allCoins;
    },
    disabledVerifyCode() {
      return this.sendingTime > 0;
    },
    disabledAddAddress() {
      return (
        this.rules.required(this.coinType) != true ||
        this.rules.required(this.coinAddress) != true ||
        this.rules.verifyCode(this.verifyCode) != true ||
        this.rules.transPwd(this.transPwd) != true ||
        this.isSubmitting ||
        this.address_error_status != false
      );
    },
    currentLang() {
      return this.$vuetify.lang.current;
    },
  },
  watch: {
    currentLang() {
      that.breadCrumbs = [
        {
          disabled: false,
          to: "/funding/merchant_withdraw",
          text: that.$vuetify.lang.t("$vuetify.defaultLayout.manageFunding"),
        },
        {
          disabled: false,
          to: "/funding/merchant_withdraw",
          text: that.$vuetify.lang.t("$vuetify.defaultLayout.merchantWithdraw"),
        },
        {
          disabled: true,
          to: "/funding/merchant_withdraw_address",
          text: that.$vuetify.lang.t(
            "$vuetify.defaultLayout.merchantWithdrawAddress"
          ),
        },
      ];
      that.allAddress.headers = [
        {
          text: that.$vuetify.lang.t("$vuetify.lable.add_time"),
          align: "start",
          sortable: false,
          value: "createTime",
        },
        {
          text: that.$vuetify.lang.t("$vuetify.table.asset"),
          align: "start",
          sortable: false,
          value: "supportCoin",
        },
        {
          text: that.$vuetify.lang.t("$vuetify.table.address"),
          align: "start",
          sortable: false,
          value: "address",
        },
        {
          text: that.$vuetify.lang.t("$vuetify.table.tag"),
          align: "start",
          sortable: false,
          value: "note",
        },
        {
          text: that.$vuetify.lang.t("$vuetify.lable.operating"),
          align: "center",
          sortable: false,
          value: "operation",
          width: "220",
        },
      ];
    },
  },
  created() {
    that = this;
  },
  async mounted() {
    await this.$nextTick();
    this.calcHeaders();
    this.getAddressBook();
  },
  methods: {
    calcHeaders() {
      this.breadCrumbs = [
        {
          disabled: false,
          to: "/funding/merchant_withdraw",
          text: this.$vuetify.lang.t("$vuetify.defaultLayout.manageFunding"),
        },
        {
          disabled: false,
          to: "/funding/merchant_withdraw",
          text: this.$vuetify.lang.t("$vuetify.defaultLayout.merchantWithdraw"),
        },
        {
          disabled: true,
          to: "/funding/merchant_withdraw_address",
          text: this.$vuetify.lang.t(
            "$vuetify.defaultLayout.merchantWithdrawAddress"
          ),
        },
      ];
      this.allAddress.headers = [
        {
          text: this.$vuetify.lang.t("$vuetify.lable.add_time"),
          align: "start",
          sortable: false,
          value: "createTime",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.asset"),
          align: "start",
          sortable: false,
          value: "supportCoin",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.address"),
          align: "start",
          sortable: false,
          value: "address",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.table.tag"),
          align: "start",
          sortable: false,
          value: "note",
        },
        {
          text: this.$vuetify.lang.t("$vuetify.lable.operating"),
          align: "center",
          sortable: false,
          value: "operation",
          width: "270",
        },
      ];
    },
    getItemAddress(address) {
      let _data = address.split("|");
      return _data[0] || address;
    },
    getItemTag(address) {
      let _data = address.split("|");
      return _data[1] || "-";
    },
    pageChange(value) {
      this.getAddressBook();
    },
    withdrawCoin(coin) {
      this.$router.push(
        `/funding/merchant_withdraw?coin=${coin.supportCoin}&id=${coin.id}`
      );
    },
    updateAddress(addr) {
      this.editType = "update";
      this.currentCoin = addr;
      this.coinType = addr.supportCoin;
      this.coinAddress = addr.address.includes("|")
        ? this.getItemAddress(addr.address)
        : addr.address;
      this.coinTag = addr.address.includes("|")
        ? this.getItemTag(addr.address)
        : "";
      this.verifyCode = "";
      this.transPwd = "";
      this.showEditAddress = true;
    },
    addAddress() {
      this.currentCoin = {};
      this.editType = "add";
      this.coinType = "";
      this.coinAddress = "";
      this.coinTag = "";
      this.verifyCode = "";
      this.transPwd = "";
      this.showEditAddress = true;
    },
    deleteAddress(addr) {
      this.currentCoin = addr;
      this.showDeleteAddress = true;
    },
    closeEdit() {
      this.currentCoin = {};
      this.showEditAddress = false;
      this.address_error_status = false;
      this.address_error_msg = "";
      this.hasTag = false;
      this.getAddressBook();
    },
    closeDelete() {
      this.currentCoin = {};
      this.showDeleteAddress = false;
      this.getAddressBook();
    },
    toForgetTransPwd() {
      eVue.$emit("forgetTransPwd");
    },
    startSendingTime() {
      this.sendingTimer = setTimeout(() => {
        if (this.sendingTime > 0) {
          this.sendingTime -= 1;
          this.startSendingTime();
        } else {
          clearTimeout(this.sendingTimer);
        }
      }, 1000);
    },
    async submitDelete() {
      try {
        let res = await this.$store.dispatch("addressCenter/deleteAddress", {
          id: this.currentCoin.id,
          walletId: window.localStorage.getItem("userId"),
        });
        if (res.code == "200") {
          this.$success(
            this.$vuetify.lang.t("$vuetify.message.delete_success")
          );
          this.closeDelete();
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.delete_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    async submitAddress() {
      if (this.isSubmitting && !this.address_error_status) {
        return;
      }
      this.isSubmitting = true;
      let res = {};
      try {
        let address = null;
        if (this.coinType == "XRP" || this.coinType == "EOS") {
          if (this.hasTag) {
            //没有标签
            address = this.coinAddress;
          } else {
            //可能有标签
            address =
              this.coinTag == ""
                ? this.coinAddress
                : `${this.coinAddress}|${this.coinTag}`;
          }
          if (this.editType == "add") {
            res = await this.$store.dispatch("addressCenter/addAddress", {
              address: address,
              supportCoin: this.coinType,
              walletId: window.localStorage.getItem("userId"),
              verifyCode: this.verifyCode,
              password: this.transPwd,
              accountNumber:this.$store.state.bossMember.user.email
            });
          } else {
            res = await this.$store.dispatch("addressCenter/updateAddress", {
              id: this.currentCoin.id,
              address: address,
              supportCoin: this.coinType,
              walletId: window.localStorage.getItem("userId"),
              verifyCode: this.verifyCode,
              password: this.transPwd,
            });
          }
        } else {
          if (this.editType == "add") {
            res = await this.$store.dispatch("addressCenter/addAddress", {
              address: this.coinAddress,
              supportCoin: this.coinType,
              walletId: window.localStorage.getItem("userId"),
              verifyCode: this.verifyCode,
              password: this.transPwd,
              accountNumber:this.$store.state.bossMember.user.email
            });
          } else {
            res = await this.$store.dispatch("addressCenter/updateAddress", {
              id: this.currentCoin.id,
              address: this.coinAddress,
              supportCoin: this.coinType,
              walletId: window.localStorage.getItem("userId"),
              verifyCode: this.verifyCode,
              password: this.transPwd,
            });
          }
        }
        if (res.code == "200") {
          this.$success(
            this.$vuetify.lang.t("$vuetify.message.submit_success")
          );
          this.closeEdit();
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.submit_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
      this.isSubmitting = false;
    },
    async sendVerifyCode() {
      if (this.sendingTime > 0) {
        return;
      }
      try {
        this.sendingTime = 60;
        this.startSendingTime();
        let res = await this.$store.dispatch("bossMember/sendVerifyCode", {
          accountNumber: this.$store.state.bossMember.user.email,
          accountType: 1,
          businessType: 3,
        });
        if (res.code == "200") {
          // this.$success('success')
          // this.sendingTime = 60
          // this.startSendingTime()
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.send_code_failed")
          );
          this.sendingTime = 0;
          clearTimeout(this.sendingTimer);
        }
      } catch (error) {
        console.log(error);
        this.sendingTime = 0;
        clearTimeout(this.sendingTimer);
      }
    },
    async getAddressBook() {
      this.tableLoading = true;
      try {
        let res = await this.$store.dispatch(
          "addressCenter/getAddressBookPage",
          {
            pageNumber: this.pagination.current,
            pageSize: this.pagination.size,
          }
        );
        if (res.code == "200") {
          this.pagination.size = res.data.pageSize;
          this.pagination.current = res.data.pageNumber;
          this.pagination.total = res.data.totalPage;
          this.allAddress.items = res.data.items;
        } else {
          this.$error(res.message || this.$vuetify.lang.t("$vuetify.message.get_address_failed"));
        }
      } catch (error) {
        console.log(error);
      }
      this.tableLoading = false;
    },
    async checkAddress() {
      if (!this.coinType) {
        return;
      }
      this.addrLoading = true;
      try {
        let res = await this.$store.dispatch("bossAssetsCenter/checkAddress", {
          address: this.coinAddress,
          asset: this.coinType,
        });
        if (res.code == "200") {
          this.address_error_status = !res.data.result;
          this.address_error_msg = !res.data.result ? this.$vuetify.lang.t("$vuetify.message.invalid_address_format") : "";
        } else {
          this.address_error_status = true;
          this.$error(res.message || this.$vuetify.lang.t("$vuetify.message.checking_address_format_failed"));
        }
      } catch (error) {
        this.address_error_msg = this.$vuetify.lang.t("$vuetify.message.checking_address_format_exception");
        this.address_error_status = true;
        console.log(error);
      }
      this.addrLoading = false;
    },
  },
};
</script>

<style lang="stylus">
.merchant-withdraw-addr {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .card-label {
    min-width: 115px;
    text-align: right;
    margin: 0 20px 0 0;
    line-height: 48px;
  }
}
</style>