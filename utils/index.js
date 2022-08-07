//邮箱格式校验
export function checkEmail(arg) {
    const rule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return rule.test(arg);
}