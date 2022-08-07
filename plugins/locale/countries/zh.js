import zhHans from "vuetify/es5/locale/zh-Hans" // 引入中文语言包

let customKey = {
    defaultLayout: {
        title: "商家平台",
        demo: "Demo",
        dev_doc: "开发文档",
        hello: "你好",
        overview: "概览",
        fundingRecords: "资金记录",
        myBill: "我的账单",
        orderManagement: "订单管理",
        userDepositOrder: "用户充币订单",
        userWithdrawOrder: "用户提币订单",
        merchantDepositOrder: "商家充币订单",
        merchantWithdrawOrder: "商家提币订单",
        exceptionCallback: "异常回调订单",
        manageFunding: "资金管理",
        merchantDeposit: "商家充币",
        merchantWithdraw: "商家提币",
        addresses:'地址管理',
        merchantWithdrawAddress: "商家提币地址",
        manageAccount: "账户管理",
        merchantInfo: "商家信息",
        merchantCertification: "企业认证",
        updateLoginPwd: "修改登录密码",
        updateTransPwd: "修改交易密码",
        logout: "退出"
    },
    loginPage: {
        login: "登录",
        register: "注册",
        forget: "忘记密码",
        finish: "完成",
        retrieveLoginPassword: "找回登录密码",
        email: "邮箱",
        pwd: "密码",
        verifyCode: "验证码",
        getVerifyCode: "获取邮箱验证码",
        newPwd: "新密码",
        newConfirmPwd: "确认新密码",
        transPwd: "交易密码",
        nextStep: "下一步",
        required: "该字段不能为空",
        confirmPwd: "确认密码",
        confirmTransPwd: "确认交易密码",
        enterPwd: "请输入密码",
        enterEmail: "请输入邮箱",
        enterConfirmPwd: "请再次输入密码",
        enterVerifyCode: "请输入邮箱验证码",
        enterNewPwd: "请输入新密码",
        enterNewConfirmPwd: "请再次输入新密码",
        enterTransPwd: "请输入交易密码",
        enterConfirmTransPwd: "请再次输入交易密码",
        inValidEmail: "邮箱地址无效",
        inValidVerifyCode: "验证码无效",
        inValidPwd: "8-20位, 至少包含字母、数字、特殊符号两种组合，不能输入空字符",
        inValidConfirmPwd: "两次密码不一致",
        inValidTransPwd: "交易密码为6位数字",
    },
    indexPage: {
        businessOverview: "经营概况",
        yesterdayReceived: "昨日收款",
        todayReceived: "今日收款",
        totalBalance: "总余额",
        currencyStatistics: "币种统计",
        collectionStatistics: "收款统计",
        showMore: "查看更多",
        income: "收入",
        expenditure: "支出",
        view: "查看",
    },
    table: {
        merchant: "商家",
        user: "用户",
        arrival: "到账",
        currency: "币种",
        withdrawBalance: "账户余额",
        currentValuation: "当前估值",
        currentExchangeRate: "当前汇率",
        time: "时间",
        incomeExpenditure: "收支",
        type: "类型",
        asset: "币种",
        amount: "金额",
        balance: "余额",
        orderId: "订单号",
        txHash: "交易哈希",
        username: "用户名",
        merchantOrderId: "商家订单号",
        arrivalTime: "到账时间",
        arrivalAmount: "到账金额",
        orderTime: "下单时间",
        tag: "标签",
        address: "地址",
        date: "年/月/日",
        to: "到",
        min: "最小",
        max: "最大",
        orderStatus: "订单状态",
        userWithdrawTag: "用户提币标签",
        userWithdrawAddress: "用户提币地址",
        userWithdrawAmount: "用户提币金额",
        merchantWithdrawTag: "商家提币标签",
        merchantWithdrawAddress: "商家提币地址",
        merchantWithdrawAmount: "商家提币金额",
        deposit: "充币",
        withdraw: "提币",
        minerFee: "矿工手续费",
        serverFee: "服务费",
        waitWithdraw: "等待提币",
        withdrawing: "提币中",
        withdrawFinished: "提币完成",
        withdrawFailed: "提币失败，请联系客服",
        all: "全部",
        withdrawFailedNoCaotace: "提币失败",
    },
    orderComponent: {
        search: "查询",
        pleaseEnter: "请输入",
        moreThanMax: "不能大于最大费用",
        myBill: "我的账单",
        merchantDepositOrder: "商家充币订单",
        merchantWithdrawOrder: "商家提币订单",
        userDepositOrder: "用户充币订单",
        userWithdrawOrder: "用户提币订单",
        exceptionCallback: "异常回调订单",
    },
    merchantInfo: {
        merchantInfo: "商家信息",
        companyCertification: "企业认证",
        companyCertificationData: "企业认证资料",
        basicInfo: "基本资料",
        merchantId: "商户号",
        merchantSdkId: "商家ID(merchantId,对接SDK用)",
        merchantName: "商家名称",
        contact: "联系人",
        telephone: "联系电话",
        companyCountry: "企业注册国家",
        companyName: "企业名称",
        companyLicenseNumber: "营业执照注册号",
        registerDate: "注册日期",
        operatingAddress: "运营地址",
        companyLicensePic: "营业执照照片",
        submitApplication: "提交申请",
        pleaseUpload: "请上传你的营业执照照片"
    },
    lable: {
        prompt: "提示",
        is_logout_info: "确定要退出登录吗？",
        cancel: "取消",
        ok: "确定",
        save: "保存",
        new_pasw: "新登录密码",
        new_pasw_again: "确认登录密码",
        new_tran_pasw: "新交易密码",
        new_tran_pasw_again: "确认交易密码",
        under_review: "正在审核中",
        moderated: "请耐心等待审核结果",
        audit_not_passed: "审核未通过",
        reason: "原因",
        resubmit: "重新提交",
        url_name: "接入网址",
        business_introduction: "业务介绍",
        submit: "提交",
        select_account: "选择币种账户",
        recharge_info: "充币详情",
        recharge_account: "充币账户",
        low_recharge: "最低充币",
        recharge_tag: "充币标签",
        recharge_address: "充币地址",
        copy: "复制 ",
        buy_currency: "购买加密货币",
        tip1: "发送任何除", //en注意顺序
        tip2: "之外的货币至这一地址都会造成永久的充币损失。",
        tip3: "使用任何除",
        tip4: "之外的其他地址都会造成永久的提币损失。",
        buy_info: "支付方式根据您当前所在的位置有所不同",
        account_freeze_reminder: "你的账户已经被冻结，无法下单",
        amount_number: "交易数量",
        call_back_status: "回调状态",
        one_click_resend: "一键重发",
        exception_back: "异常回调",
        wait_send: "等待发送",
        send_success: "发送成功",
        resend: "重发",
        tran_type: "交易类型",
        operating: "操作",
        resend_tip: "确定重发此回调吗?",
        docking_information: "对接资料",
        gateway_server: "网关服务器",
        click_to_get: "点击获取",
        get: " 获取",
        close_tip: "关闭后需重新获取，请及时保存!",
        call_back_address: "回调地址",
        verified_successfully: "验证成功",
        add: "添加",
        set: "设置",
        edit: "修改",
        delete: "删除",
        set_call_back_ip: "设置回调地址",
        edit_call_back_ip: "修改回调地址",
        merchant_email: "商户邮箱",
        set_transaction_password: "设置交易密码",
        go_to: "前往",
        to_login: "您输入的邮箱已注册,是否前往登录?",
        to_home: "您已登录过了,是否立即前往首页?",
        delete_address_tip: "删除后需要验证后方可使用，确定要删除该提币地址吗？",
        add_address: "添加提币地址",
        edit_address: "修改提币地址",
        not_tag: "我没有标签",
        add_time: "添加时间",
        number_of_withdrawals: "提币数量",
        available: "可用",
        fee: "手续费",
        min_withdrawal_amount: "最低提币数量",
        application_submitted: "已提交提币申请",
        view_record: "查看提币记录",
        freeze_info: "你的账户已经被冻结，无法下单",
        not_certified_info: "您尚未进行企业认证，认证后可用进行高额度提币哦",
        go_to_certification: "前往认证",
        not_go_to_certification: "暂不认证，继续提币",
        new_address_tip: "您正在使用新的提币地址，请校验后进行提币",
        confirm_withdrawal: "确认提币",
        withdrawal_currency: "提币币种",
        expected_arrival: "预期到账",
        deduct_cost: "扣除费用",
        balance_alert: '余额预警设置',
        balance_alert_info: '对应币种设置最低数量后，在账户内低于此数量时，会为您进行邮箱提醒。',
        low_balance_num: '最低余额数量',
        asset_low_num: '币种最低数量',
        current_valuation: '当前估值'
    },
    message: {
        forgetCardTitle: "您尚未设置交易密码，请设置后继续使用",
        is_login: "您未登录，请进行登录",
        is_expired: "身份信息已过期，请重新登录",
        logout_failed: "注销失败",
        logout_exception: "注销异常",
        code_not_null: "验证码不能为空",
        pasw_not_null: "密码不能为空",
        edit_pasw_failed: "修改登录密码失败",
        edit_pasw_exception: "修改登录密码异常",
        edit_pasw_success: "修改成功，请重新登录",
        edit_tran_success: "修改成功",
        edit_tran_failed: "修改交易密码失败",
        edit_tran_exception: "修改交易密码异常",
        send_code_failed: "发送验证码失败,请重新发送",
        send_code_exception: "发送验证码异常,请重新发送",
        invalid_url: "请输入'http://'或'https://'开头的网址",
        upload_failed: "上传失败",
        obtain_merchant_failed: "获取商家信息失败",
        edit_merchant_failed: "修改商家信息失败",
        call_back_address_not_null: "回调地址不能为空",
        currency_name_not_null: "币种名称不能为空",
        reset_pasw_failed: "重置密码失败",
        tran_pasw_not_null: "交易密码不能为空",
        tran_pasw_inconsistent: "两次交易密码不一致",
        registration_failed: "注册失败",
        email_failed: "验证邮箱失败",
        code_failed: "验证验证码失败",
        login_failed: "登录失败",
        delete_success: "删除成功",
        delete_failed: "删除失败",
        submit_success: "提交成功",
        submit_failed: "提交失败",
        get_address_failed: "获取地址失败",
        invalid_address_format: "无效的地址格式",
        checking_address_format_failed: "检查地址格式失败",
        checking_address_format_exception: "检查地址格式异常",
        amount_invalid: "提币金额无效",
        max_limit: "最多输入8位小数",
        less_than_min_limit: "不能小于最小提币金额",
        greater_than_max_limit: "不能大于可用提币金额",
        greater_than_max_amount: "不能大于单笔最大提币金额",
        insufficient_balance: "可用余额不足",
        at_least_select_currency: "至少选择一个币种",
        address_book_failed: "检查是否存在于地址薄失败",
        submit_review_failed: "提交提币审核失败",
    },
    placeholder: {
        new_pasw: "请输入新登录密码",
        new_pasw_again: "请再次输入新登录密码",
        new_tran_pasw: "请输入新交易密码",
        new_tran_pasw_again: "请再次输入新交易密码",
        merchant_name: "请填写商家名称",
        contact_person: "请填写你的联系人",
        verify_country: "请选择国家",
        phone: "请正确填写你的电话号码",
        url_enter: "请填写你的接入网址入口/app下载地址",
        business_introduction_enter: "请输入你的业务介绍，200字以内",
        company_name_enter: "请填写企业名称",
        company_registration_number_enter: "请填写你的营业执照注册号",
        company_address_enter: "请填写你的运营地址",
        upload_img_enter: "请上传您的营业执照图片",
        call_back_address: "请输入回调地址",
        select_currency: "请选择币种",
        address: "请输入地址",
        tag: "请输入标签",
        low_balance_num: '请输入最低余额数量',
        verify_low_balance_num: '请输入正确的数值(正数，最多8位小数)'
    },
    guide: {
        box_1_title: "获取API key",
        box_1_info: "前往商家信息，即可获取API key等必要参数进行对接",
        box_2_title: "进行对接",
        box_2_info: "请点击开发者文档查看文档说明进行对接",
        box_3_title: "立即使用",
        box_3_info: "对接完成后即可使用",
        btn: "立即获取"
    },
    mine:{
        '谷歌验证器设置':'谷歌验证器设置',
        '下载谷歌验证器':'下载谷歌验证器',
        '安卓本地下载':'安卓本地下载',
        '绑定谷歌验证器':'绑定谷歌验证器',
        '密文':'密文',
        '复制':'复制',
        '刷新':'刷新',
        '请输入动态密码':'请输入动态密码',
        '立即绑定':'立即绑定',
        '复制成功':'复制成功',
        '该浏览器不支持自动复制':'该浏览器不支持自动复制',
        '请输入谷歌验证码':'请输入谷歌验证码',
        '绑定成功':'绑定成功',
        '商家列表':'商家列表',
        '导入地址':'导入地址',
        '正常':'正常',
        '冻结':'冻结',
        '确认':'确认',
        '提币':'提币',
        '商户':'商户',
        '邮箱':'邮箱',
        '商户号':'商户号',
        '入金手续费':'入金手续费',
        '出金手续费':'出金手续费',
        '状态':'状态',
        '操作':'操作',
        '请选择文件':'请选择文件',
        '全部':'全部',
        '请选择地址文件':'请选择地址文件',
        '导入成功':'导入成功',
        '白名单':'白名单',
        '设置白名单地址':'设置白名单地址',
        '登录密码':'登录密码',
        '请输入登录密码':'请输入登录密码',
        '白名单IP':'白名单IP',
        '请输入白名单地址(多个IP地址请使用,隔开)':'请输入白名单地址(多个IP地址请使用 , 隔开)',
        '请输入登录密码':'请输入登录密码',
        '请输入IP地址':'请输入IP地址',
        '设置成功':'设置成功',
        '地址管理':'地址管理',
        '请输入地址':'请输入地址',
        '提币确认':'提币确认',
        '该操作会将当前操作地址资产全部提至商家归集钱包中':'该操作会将当前操作地址资产全部提至商家归集钱包中',
        '地址':'地址',
        '币种':'币种',
        '当前地址资产已全部提至商家归集钱包中':'当前地址资产已全部提至商家归集钱包中',
        '谷歌验证码':'谷歌验证码',
        '请输入谷歌验证码(未绑定请忽略)':'请输入谷歌验证码(未绑定请忽略)',
        '填写交易HASH':'填写交易HASH',
        '请输入HASH地址':'请输入HASH地址',
        '到账金额':'到账金额',
        '邮箱验证码':'邮箱验证码',
        '请输入邮箱验证码':'请输入邮箱验证码',
        '新增商户':'新增商户',
        '请输入邮箱地址':'请输入邮箱地址',
        '登录密码':'登录密码',
        '请输入登录密码(至少8位)':'请输入登录密码(至少8位)',
        '交易密码':'交易密码',
        '请输入交易密码(至少6位)':'请输入交易密码(至少6位)',
        '请输入登录密码':'请输入登录密码',
        '登录密码最少8位':'登录密码最少8位',
        '请输入交易密码':'请输入交易密码',
        '交易密码最少6位':'交易密码最少6位',
        '新增成功':'新增成功',
        'safe':'为了您的资金安全，请先绑定谷歌验证码！',
        '下次绑定':'下次绑定',
        '去绑定':'去绑定',
        '操作':'操作',
        '通过':'通过',
        '拒绝':'拒绝',
        '已拒绝':'已拒绝',
        '商户邮箱':'商户邮箱',
        '回调次数':'回调次数',
        '回调状态':'回调状态',
        '从新回调成功':'重新回调成功，请耐心等待',
        '未处理':'未处理',
        '审核成功':'审核成功',
        '审核驳回':'审核驳回',
        '交易成功':'交易成功',
        '交易失败':'交易失败',
        '重新回调':'重新回调',
        '总余额':'总余额',
        '可提现':'可提现',
        '可代付':'可代付',
        '可代付手续费额度':'可代付手续费额度',
        '可提现手续费额度':'可提现手续费额度',
        '手续费账户':'手续费账户',
        '手续费地址':'手续费地址',
        
    }
}

export default Object.assign(customKey, zhHans)