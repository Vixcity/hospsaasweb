<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="form.username" class="h40" placeholder="请输入账号" />
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码" class="h40" />
    </FormItem>
    <!-- <FormItem prop="verificationCode">
      <Input
        type="text"
        v-model="form.verificationCode"
        placeholder="请输入验证码"
        class="h40"
      >
        <span class="checkCode" @click="createCode">{{ checkCode }}</span>
      </Input>
    </FormItem> -->
    <Checkbox v-model="remember">记住我</Checkbox>
    <FormItem class="login-form">
      <Button @click="handleSubmit" type="primary" long class="loginBtn">登录</Button>
    </FormItem>
    <div style="font-weight: 400; font-size: 16px">温馨提示</div>
    <div style="margin-top: 8px; font-size: 12px">
      您的浏览器为：{{ browser }}，如果不能正常登录，请下载
      <a href="https://www.google.cn/intl/zh-CN/chrome/">Chrome浏览器</a>
      进行使用。
    </div>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    usernameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'blur' }]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
    // verificationCodeRules: {
    //   type: Array,
    //   default: () => {
    //     return [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
    //   }
    // }
  },
  data () {
    return {
      form: {
        username: '',
        password: '',
        verificationCode: ''
      },
      browser: '',
      remember: true
    }
  },
  computed: {
    rules () {
      return {
        username: this.usernameRules,
        password: this.passwordRules,
        verificationCode: this.verificationCodeRules
      }
    }
  },
  created () {
    this.getExplore()
    this.form = localStorage.getItem('loginAccount') ? JSON.parse(localStorage.getItem('loginAccount')) : {
      username: '',
      password: '',
      verificationCode: ''
    }
  },
  methods: {
    createCode () {
      let code = ''
      const codeLength = 4 // 验证码的长度
      /* eslint-disable */
      const random = new Array(
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ) // 随机数
      for (let i = 0; i < codeLength; i++) {
        // 循环操作
        let index = Math.floor(Math.random() * 36) // 取得随机数的索引（0~35）
        code += random[index] // 根据索引取得随机数加到code上
      }
      this.checkCode = code // 把code值赋给验证码
    },
    getExplore () {
      let Sys = {}
      let ua = navigator.userAgent.toLowerCase()
      let s
        /* eslint-disable */
        ; (s = ua.match(/rv:([\d.]+)\) like gecko/))
          ? (Sys.ie = s[1])
          : (s = ua.match(/msie ([\d\.]+)/))
            ? (Sys.ie = s[1])
            : (s = ua.match(/edge\/([\d\.]+)/))
              ? (Sys.edge = s[1])
              : (s = ua.match(/firefox\/([\d\.]+)/))
                ? (Sys.firefox = s[1])
                : (s = ua.match(/(?:opera|opr).([\d\.]+)/))
                  ? (Sys.opera = s[1])
                  : (s = ua.match(/chrome\/([\d\.]+)/))
                    ? (Sys.chrome = s[1])
                    : (s = ua.match(/version\/([\d\.]+).*safari/))
                      ? (Sys.safari = s[1])
                      : 0
      // 根据关系进行判断
      if (Sys.ie) {
        this.browser = 'IE: ' + Sys.ie
      } else if (Sys.edge) {
        this.browser = 'EDGE: ' + Sys.edge
      } else if (Sys.firefox) {
        this.browser = 'Firefox: ' + Sys.firefox
      } else if (Sys.chrome) {
        this.browser = 'Chrome: ' + Sys.chrome
      } else if (Sys.opera) {
        this.browser = 'Opera: ' + Sys.opera
      } else if (Sys.safari) {
        this.browser = 'Safari: ' + Sys.safari
      } else {
        this.browser = 'Unkonwn'
      }
    },
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.remember) {
            localStorage.setItem('loginAccount', JSON.stringify({
              username: this.form.username,
              password: this.form.password
            }))
          } else {
            localStorage.removeItem('loginAccount')
          }
          this.$emit('on-success-valid', {
            username: this.form.username,
            password: this.form.password,
            verificationCode: this.form.verificationCode
          })
        }
      })
    }
  }
}
</script>
