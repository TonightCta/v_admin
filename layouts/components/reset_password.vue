<template>
  <div class="reset-password">
    <el-dialog :visible.sync="setPassBox" width="634px" :show-close="false">
      <div class="set-header" slot="title">
        <p>
          {{ type === 1 ? "修改登录密码" : "修改交易密码" }}
        </p>
        <img
          @click="setPassBox = false"
          :src="require('../../assets/images/close_icon_2.png')"
          alt=""
        />
      </div>
      <div class="set-content">
        <div class="inp-slide">
          <p class="slide-lable">登录密码</p>
          <input
            type="password"
            placeholder="请输入登录密码"
            v-model="ruleForm.loginPass"
          />
        </div>
        <div class="inp-slide">
          <p class="slide-lable">
            {{ type === 1 ? "新登录密码" : "新交易密码" }}
          </p>
          <input
            :type="turnType"
            placeholder="请输入登录密码"
            v-model="ruleForm.newPass"
          />
          <img
            v-if="ruleForm.newPass"
            class="change-inp-type"
            :src="
              turnType === 'password'
                ? require('../../assets/images/see.png')
                : require('../../assets/images/un_see.png')
            "
            @click="turnType = turnType === 'password' ? 'text' : 'password'"
            alt=""
          />
        </div>
        <div class="inp-slide">
          <p class="slide-lable">确认密码</p>
          <input
            :type="repeatType"
            placeholder="请输入登录密码"
            v-model="ruleForm.repeatPass"
          />
          <img
            v-if="ruleForm.repeatPass"
            class="change-inp-type"
            :src="
              repeatType === 'password'
                ? require('../../assets/images/see.png')
                : require('../../assets/images/un_see.png')
            "
            alt=""
            @click="
              repeatType = repeatType === 'password' ? 'text' : 'password'
            "
          />
        </div>
        <div class="inp-slide">
          <p class="slide-lable">验证码</p>
          <input
            type="number"
            placeholder="请输入登录密码"
            v-model="ruleForm.code"
          />
          <p
            class="send-code"
            @click="sendCodeService"
            :class="[count > 0 && 'gray-btn']"
          >
            {{ count > 0 ? `${count}s后重发` : "获取验证码" }}
          </p>
        </div>
        <div class="oper-box">
          <button class="default-btn" @click="setPassBox = false">取消</button>
          <p class="lable-mask"></p>
          <button class="primary-btn" @click="submitSet">确认</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
  },
  data: () => {
    return {
      setPassBox: false,
      turnType: "password",
      repeatType: "password",
      count: 0,
      ruleForm: {
        loginPass: null,
        newPass: null,
        repeatPass: null,
        code: null,
      },
      //   rules: {
      //     setPassBox: [
      //       { required: true, message: "请输入登录密码", trigger: "blur" },
      //     ],
      //     newPass: [
      //       { required: true, message: "请输入新密码", trigger: "blur" },
      //       { min: 8, message: "密码最少8位", trigger: "blur" },
      //     ],
      //     repeatPass: [
      //       { required: true, message: "请再次输入新密码", trigger: "blur" },
      //       {
      //         validate: (rule, value, callback) => {
      //           if (value !== this.ruleForm.newPass) {
      //             callback(new Error("两次输入密码不一致"));
      //           } else {
      //             callback();
      //           }
      //         },
      //         trigger: "blur",
      //       },
      //     ],
      //   },
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler: function (v) {
        this.setPassBox = v;
      },
    },
    setPassBox(val) {
      this.$emit("input", val);
      const reset = () => {
        this.ruleForm = {
          loginPass: null,
          newPass: null,
          repeatPass: null,
          code: null,
        };
      };
      !val && reset();
    },
  },
  computed: {
    user() {
      return this.$store.state.bossAssetsCenter.merchantInfo;
    },
  },
  methods: {
    //提交重置
    async submitSet() {
      console.log(this.ruleForm);
      if (!this.ruleForm.loginPass) {
        Message.error("请输入登录密码");
        return;
      }
      if (!this.ruleForm.newPass) {
        Message.error(`请输入新${this.type === 1 ? "登录" : "交易"}密码`);
        return;
      }
      if (!this.ruleForm.repeatPass) {
        Message.error(`请再次输入新${this.type === 1 ? "登录" : "交易"}密码`);
        return;
      }
      if (this.ruleForm.repeatPass !== this.ruleForm.newPass) {
        Message.error("两次输入密码不一致");
        return;
      }
      if (!this.ruleForm.code) {
        Message.error("请输入邮箱验证码");
        return;
      }
      const result = await this.$store.dispatch("bossMember/updatePwd", {
        accountNumber: this.user.email,
        code: Number(this.ruleForm.code),
        accountType: 1,
        businessType: 3,
        oldpassword: this.ruleForm.loginPass,
        password: this.ruleForm.newPass,
        passwordType: this.type === 1 ? 0 : 1,
        verifyCode: this.ruleForm.code,
      });
      console.log(result);
      const { code } = result;
      if(code !== 200){
        Message.error(result.message);
        return;
      }
      Message.success('修改成功');
      this.setPassBox = false;
    },
    //发送验证码
    async sendCodeService() {
      if (this.count > 0) return;
      const result = await this.$store.dispatch("bossMember/sendVerifyCode", {
        scene: this.type,
      });
      const { code } = result;
      if (code !== 200) {
        Message.error(result.Message);
        return;
      }
      Message.success("验证码发送成功");
      this.count = 60;
      const countdown = setInterval(() => {
        this.count--;
        if (this.count <= 0) {
          clearInterval(countdown);
        }
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>