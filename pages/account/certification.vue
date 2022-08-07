<template lang="pug">
.certification-info.pa-6
  .submit-result(v-if="showSubmitResult")
    v-icon.mb-10(color="success", size="64", v-if="submitResult.pass") mdi-check-circle
    .title.mb-6(v-if="submitResult.pass") {{ $vuetify.lang.t('$vuetify.lable.under_review') }}
    .title(v-if="submitResult.pass") {{ $vuetify.lang.t('$vuetify.lable.moderated') }}

    v-icon.mb-10(color="secondary", size="64", v-if="!submitResult.pass") mdi-alert
    .title.mb-6(v-if="!submitResult.pass") {{ $vuetify.lang.t('$vuetify.lable.audit_not_passed') }}
    .title.text--disabled.mb-6(v-if="!submitResult.pass") {{ $vuetify.lang.t('$vuetify.lable.reason') }}：{{ submitResult.reason }}
    v-btn(
      depressed,
      color="primary",
      @click="showSubmitResult = false",
      v-if="!submitResult.pass"
    ) {{ $vuetify.lang.t('$vuetify.lable.resubmit') }}

  v-card(style="flex-grow:1", v-else, v-show="is_open")
    v-card-title {{ $vuetify.lang.t('$vuetify.merchantInfo.companyCertification') }}
    v-divider
    v-card-text.px-8.py-6
      .title.mb-4 {{ $vuetify.lang.t('$vuetify.merchantInfo.basicInfo') }}
      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label 
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.merchantName') }}：
        v-text-field.pa-0.ma-0(
          v-model="merchant.merchantName",
          outlined,
          dense,
          style="max-width:420px",
          :rules="[rules.verifyMerchantName]",
          @blur="allowSubmit",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.merchant_name')",
          maxLength="100"
        )

      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label 
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.contact') }}：
        v-text-field.pa-0.ma-0(
          v-model="merchant.contactName",
          outlined,
          dense,
          style="max-width:420px",
          :rules="[rules.verifyContactName]",
          @blur="allowSubmit",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.contact_person')",
          maxLength="50"
        )

      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label 
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.telephone') }}：
        v-text-field.pa-0.ma-0(
          v-model="merchant.phone",
          outlined,
          dense,
          style="max-width:420px",
          :rules="[rules.verifyPhone]",
          @blur="allowSubmit",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.phone')",
          type="number",
          maxLength="20"
        )
          template(v-slot:prepend)
            v-autocomplete(
              v-model="area",
              outlined,
              dense,
              :items="area_list",
              style="margin-top:-8px;"
            )

      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.lable.url_name') }}：
        v-text-field.pa-0.ma-0(
          v-model="merchant.merchantWebsiteUrl",
          outlined,
          dense,
          style="max-width:420px",
          :rules="[rules.verifyIp]",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.url_enter')",
          @blur="allowSubmit",
          maxLength="500"
        )

      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label 
          span {{ $vuetify.lang.t('$vuetify.lable.business_introduction') }}：
        v-textarea.pa-0.ma-0(
          v-model="merchant.merchantDesc",
          outlined,
          dense,
          rows="3",
          style="max-width:420px",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.business_introduction_enter')",
          maxLength="200"
        )

    v-card-text.px-8.py-6
      .title.mb-4.info-label {{ $vuetify.lang.t('$vuetify.merchantInfo.companyCertificationData') }}
      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.companyCountry') }}：
        v-autocomplete.pa-0.ma-0(
          v-model="merchant.country",
          :items="allCountry",
          outlined,
          dense,
          style="max-width:420px",
          :rules="[rules.verifyCountry]",
          @blur="allowSubmit"
        )

      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label 
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.companyName') }}：
        v-text-field.pa-0.ma-0(
          v-model="merchant.companyName",
          outlined,
          dense,
          style="max-width:420px",
          :rules="[rules.verifyCompanyName]",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.company_name_enter')",
          @blur="allowSubmit",
          maxLength="100"
        )

      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label 
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.registerDate') }}：
        v-menu(
          v-model="showPickDate",
          :close-on-content-click="false",
          :nudge-right="40",
          transition="scale-transition",
          offset-y,
          max-width="290",
          min-width="290"
        )
          template(v-slot:activator="{ on, attrs }")
            v-text-field.pa-0.ma-0(
              v-model="merchant.companyRegistTime",
              outlined,
              dense,
              readonly,
              append-icon="mdi-calendar-month",
              style="max-width:420px",
              v-bind="attrs",
              v-on="on",
              @click:append="showPickDate = true",
              @blur="allowSubmit"
            )
          v-date-picker(
            v-model="merchant.companyRegistTime",
            no-title,
            scrollable,
            @input="showPickDate = false"
          )

      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label 
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.companyLicenseNumber') }}：
        v-text-field.pa-0.ma-0(
          v-model="merchant.companyRegistrationNumber",
          outlined,
          dense,
          style="max-width:420px",
          :rules="[rules.verifyCompanyRegistrationNumber]",
          @blur="allowSubmit",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.company_registration_number_enter')",
          maxLength="200"
        )

      .subtitle-1.px-6.py-1.cer-item
        .mr-4.info-label 
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.operatingAddress') }}：
        v-textarea.pa-0.ma-0(
          v-model="merchant.companyAddress",
          outlined,
          dense,
          rows="3",
          auto-grow,
          style="max-width:420px",
          :rules="[rules.verifyCompanyAddress]",
          @blur="allowSubmit",
          :placeholder="$vuetify.lang.t('$vuetify.placeholder.company_address_enter')",
          maxLength="500"
        )

      .subtitle-1.px-6.py-2.mb-4.cer-item
        .mr-4.info-label 
          span.red_star *
          span {{ $vuetify.lang.t('$vuetify.merchantInfo.companyLicensePic') }}：
        .img-preview
          .preview-tip
            v-icon(size="80") mdi-plus
            .subtitle-1 {{ $vuetify.lang.t('$vuetify.placeholder.upload_img_enter') }}（jpg/png/jpeg）
          img(:src="merchant.companyBusinessLicensePic")
          v-file-input(accept="image/*", @change="uploadImg")

      .subtitle-1.px-6.py-4.cer-item
        .mr-4.info-label
        v-btn(
          depressed,
          large,
          :disabled="!allowSubmit()",
          :loading="isSubmitting",
          color="primary",
          @click="updateMerchantVerifyInfo"
        ) {{ $vuetify.lang.t('$vuetify.lable.submit') }}
</template>
    
<script>
var that = null;
import ImageUploader from "vue-image-upload-resize";
export default {
  components: {
    ImageUploader,
  },
  data: () => {
    return {
      is_open: false,
      isSubmitting: false,
      showSubmitResult: false,
      area: "+86",
      area_list: [],
      submitResult: {
        pass: true,
        reason: "",
      },
      merchant: {
        merchantName: "",
        contactName: "",
        phone: "",
        merchantWebsiteUrl: "",
        merchantDesc: "",
        country: "China",
        companyName: "",
        companyRegistTime: null,
        companyRegistrationNumber: "",
        companyAddress: "",
        companyBusinessLicensePic: "",
      },
      allCountry: [],
      cerCountry: "",
      showPickDate: false,
      selectedImg: "",
      rules: {
        verifyMerchantName: (value) => {
          if (value == "") {
            return that.$vuetify.lang.t("$vuetify.placeholder.merchant_name");
          } else {
            return true;
          }
        },
        verifyContactName: (value) => {
          if (value == "") {
            return that.$vuetify.lang.t("$vuetify.placeholder.contact_person");
          } else {
            return true;
          }
        },
        verifyPhone: (value) => {
          if (value == "") {
            return that.$vuetify.lang.t("$vuetify.placeholder.phone");
          } else {
            return true;
          }
        },
        verifyCountry: (value) => {
          if (value == "") {
            return that.$vuetify.lang.t("$vuetify.placeholder.verify_country");
          } else {
            return true;
          }
        },
        verifyCompanyName: (value) => {
          if (value == "") {
            return that.$vuetify.lang.t(
              "$vuetify.placeholder.company_name_enter"
            );
          } else {
            return true;
          }
        },
        verifyCompanyRegistrationNumber: (value) => {
          if (value == "") {
            return that.$vuetify.lang.t(
              "$vuetify.placeholder.company_registration_number_enter"
            );
          } else {
            return true;
          }
        },
        verifyCompanyAddress: (value) => {
          if (value == "") {
            return that.$vuetify.lang.t(
              "$vuetify.placeholder.company_address_enter"
            );
          } else {
            return true;
          }
        },
        verifyIp: (value) => {
          const pattern = /^((https|http)?:\/\/)[\S]{1,}/;
          if (value == "") {
            return that.$vuetify.lang.t("$vuetify.placeholder.url_enter");
          }
          if (!pattern.test(value)) {
            return that.$vuetify.lang.t("$vuetify.message.invalid_url");
          } else {
            return true;
          }
        },
        required: (value) => {
          return !!value;
        },
      },
    };
  },
  created() {
    that = this;
  },
  mounted() {
    this.queryMerchantVerifyInfo();
    this.queryCountryList();
  },
  methods: {
    async queryCountryList() {
      let res = await this.$store.dispatch("bossMember/queryCountryList", {});
      if (res.code == "200") {
        let s = new Set(
          res.data.countryList.map(function (item) {
            return `+${item.prefix}`;
          })
        );
        this.area_list = [...s];
        this.allCountry = res.data.countryList.map(function (item) {
          return item.countryEn;
        });
      } else {
        this.$error(res.message);
      }
    },
    allowSubmit() {
      return (
        this.rules.required(this.merchant.merchantName) == true &&
        this.rules.required(this.merchant.contactName) == true &&
        this.rules.required(this.merchant.phone) == true &&
        this.rules.verifyIp(this.merchant.merchantWebsiteUrl) == true &&
        this.rules.required(this.merchant.country) == true &&
        this.rules.required(this.merchant.companyName) == true &&
        this.rules.required(this.merchant.companyRegistTime) == true &&
        this.rules.required(this.merchant.companyRegistrationNumber) == true &&
        this.rules.required(this.merchant.companyAddress) == true &&
        this.rules.required(this.merchant.companyBusinessLicensePic) == true
      );
    },
    async uploadImg(file) {
      if (file) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImg = e.target.result;
          this.merchant.companyBusinessLicensePic = e.target.result;
        };
        reader.readAsDataURL(file);
        let formData = new FormData();
        formData.append("imageFile", file);
        let res = await this.$store.dispatch("bossMember/uploadFile", formData);
        if (res.code == "200") {
          this.merchant.companyBusinessLicensePic = res.data;
          this.allowSubmit();
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.upload_failed")
          );
        }
      }
    },
    async queryMerchantVerifyInfo() {
      try {
        let res = await this.$store.dispatch(
          "bossMember/queryMerchantVerifyInfo",
          {}
        );
        this.is_open = true;
        if (res.code == "200") {
          if (res.data && res.data.level > 0) {
            this.$router.replace("/account/merchant");
            this.$store.dispatch('closeCertificationPage')
            return;
          }
          // this.merchant = res.data || {};
          if (res.data.verifyStatus == 3) {
            this.merchant = JSON.parse(JSON.stringify(res.data));
            this.merchant.phone = res.data.phone.split("-")[1] || "";
            this.area = res.data.phone.split("-")[0] || "+86";
          }
          if (res.data.verifyStatus == 0) {
            this.submitResult.pass = false;
            this.showSubmitResult = false;
          } else {
            this.submitResult.reason = res.data.note;
            this.submitResult.pass = res.data.verifyStatus == 3 ? false : true;
            this.showSubmitResult = true;
          }
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.obtain_merchant_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    async updateMerchantVerifyInfo() {
      this.isSubmitting = true;
      if (!this.allowSubmit()) {
        return;
      }
      try {
        let data = {};
        data.email = this.merchant.email;
        data.merchantName = this.merchant.merchantName;
        data.contactName = this.merchant.contactName;
        data.phone = `${this.area}-${this.merchant.phone}`;
        data.merchantWebsiteUrl = this.merchant.merchantWebsiteUrl;
        data.merchantDesc = this.merchant.merchantDesc;
        data.country = this.merchant.country;
        data.companyName = this.merchant.companyName;
        data.companyRegistrationNumber = this.merchant.companyRegistrationNumber;
        data.companyAddress = this.merchant.companyAddress;
        data.companyBusinessLicensePic = this.merchant.companyBusinessLicensePic;
        data.companyRegistTime = this.$formatTime(
          "yyyy-mm-dd HH:MM:SS",
          this.merchant.companyRegistTime
        );
        let res = await this.$store.dispatch(
          "bossMember/updateMerchantVerifyInfo",
          data
        );
        if (res.code == "200") {
          this.queryMerchantVerifyInfo();
        } else {
          this.$error(
            res.message ||
              this.$vuetify.lang.t("$vuetify.message.edit_merchant_failed")
          );
        }
      } catch (error) {
        console.log(error);
      }
      this.isSubmitting = false;
    },
  },
};
</script>

<style lang="stylus">
.certification-info {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  position: relative;
  background-color: #F5F5FC;

  .submit-result {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .cer-item {
    display: flex;
    align-items: flex-start;

    .info-label {
      line-height: 40px;
      text-align: right;
      min-width: 145px;

      .red_star {
        color: red;
        margin-right: 10px;
      }
    }
  }

  .img-preview {
    border: 1px solid rgba(51, 51, 51, 0.8);
    width: 200px;
    min-height: 150px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    .preview-tip {
      opacity: 0.7;
      // z-index: 1;
      position: absolute;
    }

    img {
      width: 198px;
    }

    .v-input {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0;

      // z-index: 10;
      button {
        z-index: 1;
        position: absolute !important;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>