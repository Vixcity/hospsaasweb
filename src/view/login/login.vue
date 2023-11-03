<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login" id="login">
    <div class="titleTextImg">
      <img src="@/assets/images/titleText.png" style="width: 100%" alt="" />
    </div>
    <canvas id="starry-sky-vixcity" className="fixed"></canvas>
    <div class="login-con" style="z-index: 6">
      <div class="flex" style="background: white">
        <div class="form-con" style="background: #3171ff">
          <img
            src="@/assets/images/login_small_bg.png"
            style="
              position: relative;
              top: 50%;
              transform: translateY(-50%);
              display: block;
              width: 100%;
            "
            alt=""
          />
        </div>
        <div class="form-con pd90">
          <div class="title">用户登录</div>
          <login-form class="login-form" @on-success-valid="handleSubmit"></login-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { home } from '@/api/home/index'
export default {
  components: {
    LoginForm
  },
  mounted () {
    this.dark()
  },
  methods: {
    ...mapActions(['handleLogin']),
    handleSubmit ({ username, password }) {
      this.handleLogin({ username, password }).then(res => {
        this.getMenu()
        // if (JSON.parse(localStorage.userInfo).realname === '数智医济') {
        //   let allMenuList = this.$store.getters.menuList
        //   allMenuList.forEach(item => {
        //     item.meta.show = true
        //     if (item.children.length > 1) {
        //       item.children.forEach(itemChild => {
        //         itemChild.meta.show = true
        //       })
        //     }
        //   })
        //   this.menuList = allMenuList
        //   localStorage.showMenuList = JSON.stringify(allMenuList)
        //   this.$router.push({
        //     name: this.$config.homeName
        //   })
        // } else {
        //   this.$router.push({
        //     name: this.$config.homeName
        //   })
        // }
      })
    },
    getMenu () {
      // if (JSON.parse(localStorage.userInfo).realname === '数智医济') {
      //   let allMenuList = this.$store.getters.menuList
      //   allMenuList.forEach(item => {
      //     item.meta.show = true
      //     if (item.children.length > 1) {
      //       item.children.forEach(itemChild => {
      //         itemChild.meta.show = true
      //       })
      //     }
      //   })

      //   this.menuList = allMenuList
      //   localStorage.showMenuList = JSON.stringify(allMenuList)
      //   localStorage.hasMenuList = '[]'
      //   this.$router.push({
      //     name: this.$config.homeName
      //   })
      //   return
      // }
      home.menuList().then(res => {
        let allMenuList = this.$store.getters.menuList
        allMenuList.forEach(item => {
          item.meta.show = false
          if (item.children.length > 1) {
            item.children.forEach(itemChild => {
              itemChild.meta.show = false
            })
          }
        })
        let roleMenuList = res.data
        roleMenuList.forEach(item => {
          allMenuList.forEach(itemMenu => {
            if (itemMenu.meta.tag === item.tag) {
              itemMenu.meta.show = true
              if (item.sub.length > 0) {
                item.sub.forEach(itemSub => {
                  itemMenu.children.forEach(itemChild => {
                    if (itemSub.tag === itemChild.meta.tag) {
                      itemChild.meta.show = true
                    }
                  })
                })
              }
            }
          })
        })
        this.menuList = allMenuList
        localStorage.showMenuList = JSON.stringify(this.menuList.filter(item => item.meta.show))
        localStorage.hasMenuList = JSON.stringify(roleMenuList.reverse())
        this.$router.push({
          name: this.$config.homeName
        })
      })
    },
    dark () {
      window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame
      /* eslint-disable */
      let n,
        e,
        i,
        h,
        t = 0.05,
        s = document.getElementById('starry-sky-vixcity'),
        o = !0,
        a = '180,184,240',
        r = '226,225,142',
        d = '226,225,224',
        c = []
      function f() {
        ;(n = window.innerWidth),
          (e = window.innerHeight),
          (i = 0.216 * n),
          s.setAttribute('width', n),
          s.setAttribute('height', e)
      }
      function u() {
        h.clearRect(0, 0, n, e)
        for (var t = c.length, i = 0; i < t; i++) {
          var s = c[i]
          s.move(), s.fadeIn(), s.fadeOut(), s.draw()
        }
      }
      function y() {
        ;(this.reset = function () {
          ;(this.giant = m(3)),
            (this.comet = !this.giant && !o && m(10)),
            (this.x = l(0, n - 10)),
            (this.y = l(0, e)),
            (this.r = l(1.1, 2.6)),
            (this.dx = l(t, 6 * t) + (this.comet + 1 - 1) * t * l(50, 120) + 2 * t),
            (this.dy = -l(t, 6 * t) - (this.comet + 1 - 1) * t * l(50, 120)),
            (this.fadingOut = null),
            (this.fadingIn = !0),
            (this.opacity = 0),
            (this.opacityTresh = l(0.2, 1 - 0.4 * (this.comet + 1 - 1))),
            (this.do = l(5e-4, 0.002) + 0.001 * (this.comet + 1 - 1))
        }),
          (this.fadeIn = function () {
            this.fadingIn &&
              ((this.fadingIn = !(this.opacity > this.opacityTresh)), (this.opacity += this.do))
          }),
          (this.fadeOut = function () {
            this.fadingOut &&
              ((this.fadingOut = !(this.opacity < 0)),
              (this.opacity -= this.do / 2),
              (this.x > n || this.y < 0) && ((this.fadingOut = !1), this.reset()))
          }),
          (this.draw = function () {
            if ((h.beginPath(), this.giant)) {
              ;(h.fillStyle = 'rgba(' + a + ',' + this.opacity + ')'),
                h.arc(this.x, this.y, 2, 0, 2 * Math.PI, !1)
            } else if (this.comet) {
              ;(h.fillStyle = 'rgba(' + d + ',' + this.opacity + ')'),
                h.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1)
              for (var t = 0; t < 30; t++) {
                ;(h.fillStyle = 'rgba(' + d + ',' + (this.opacity - (this.opacity / 20) * t) + ')'),
                  h.rect(this.x - (this.dx / 4) * t, this.y - (this.dy / 4) * t - 2, 2, 2),
                  h.fill()
              }
            } else {
              ;(h.fillStyle = 'rgba(' + r + ',' + this.opacity + ')'),
                h.rect(this.x, this.y, this.r, this.r)
            }
            h.closePath(), h.fill()
          }),
          (this.move = function () {
            ;(this.x += this.dx),
              (this.y += this.dy),
              !1 === this.fadingOut && this.reset(),
              (this.x > n - n / 4 || this.y < 0) && (this.fadingOut = !0)
          }),
          setTimeout(function () {
            o = !1
          }, 50)
      }
      function m(t) {
        return Math.floor(1e3 * Math.random()) + 1 < 10 * t
      }
      function l(t, i) {
        return Math.random() * (i - t) + t
      }
      f(),
        window.addEventListener('resize', f, !1),
        (function () {
          h = s.getContext('2d')
          for (var t = 0; t < i; t++) (c[t] = new y()), c[t].reset()
          u()
        })(),
        (function t() {
          u(), window.requestAnimationFrame(t)
        })()
    }
  }
}
</script>

<style></style>
