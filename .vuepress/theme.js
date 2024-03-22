import { hopeTheme } from "vuepress-theme-hope";
import { Navbar } from "./navbar/index.js";
import { Sidebar } from "./sidebar/index.js";
import { shikiPlugin } from "@vuepress/plugin-shiki";

export default hopeTheme({
  hostname: "https://slsj0813.github.io",
  author: {
    name: "slsj",
    url: "https://slsj0813.github.io",
    email: "slsj1314@163.com",
  },
  // 编辑 贡献者 更新时间
  lastUpdated: "最新一次更新",
  contributors: true,
  editLink: true,
  // icon
  iconAssets: "iconfont",
  iconPrefix: "iconfont icon-",
  //页脚
  displayFooter: true, //是否默认展示页脚
  footer:
    "欢迎来到slsj的小站 | 由 <a href='https://theme-hope.vuejs.press' target='_blank'>Theme Hope</a> 驱动", //默认页脚
  copyright: "Copyright © 2023 slsj", //默认版权
  //导航栏
  logo: "/logo.png",
  repo: "https://github.com/slsj0813", //导航栏仓库链接
  repoDisplay: true, //是否显示导航栏仓库链接
  navbar: Navbar, //导航栏配置
  navbarLayout: {
    // 配置导航栏各个东西的位置
    start: ["Brand"],
    center: ["Links"],
    end: ["Repo", "Outlook", "Search"],
  },
  darkmode: "toggle", //设置深色模式
  themeColor: {
    //设置主题色
    // default: "#71EEB2",
    blue: "#2196f3",
    red: "#f26d6d",
    orange: "#fb9b5f",
  },
  fullscreen: true, //全屏模式
  // 侧边栏
  sidebar: Sidebar, //侧边栏配置
  //编辑页面
  docsRepo: "https://github.com/slsj0813/slsj_blog", //编辑页面
  backToTop: true, //到顶部 默认情况下将在下滑 300px 后显示或者是设置为一个数字以更改默认的触发距离

  blog: {
    name: "slsj",
    avatar: "/logo.png",
    description: "当你重新踏上旅途之后，一定要记得旅途本身的意义",
    intro: "/intro.html",
    roundAvatar: true,
    medias: {
      BiliBili: "https://space.bilibili.com/1644064934",
      GitHub: "https://github.com/slsj0813",
      Zhihu: "https://www.zhihu.com/people/flipped-84-72-12",
      Email:
        "http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=IBgWExEZERkYYFFRDkNPTQ",
      QQ: "tencent://message/?uin=86319198",
    },
  },
  plugins: {
    // prismjs: false,  //禁用默认代码主题
    copyCode: {
      showInMobile: true, //在移动端展示复制功能
    },
    blog: true,

    mdEnhance: {
      //增强markdown
      vuePlayground: true, //支持vue
      katex: true, // 使用 KaTeX 启用 TeX 支持
      mathjax: true, // 使用 mathjax 启用 TeX 支持
      chart: true, //支持图表
      echarts: true, //图表
      mermaid: true, //流程图
      sub: true, // 启用下角标功能
      sup: true, // 启用上角标
      tabs: true, // 添加选项卡支持
      codetabs: true, //对代码块支持
      container: true, //自定义容器
      // 启用 figure
      figure: true,
      // 启用图片懒加载
      imgLazyload: true,
      // 启用图片标记
      imgMark: true,
      // 启用图片大小
      imgSize: true,
      attrs: true, //css属性
      mark: true,
      tasklist: true,
      align: true,
    },
    components: {
      components: ["BiliBili", "Badge", "ArtPlayer"],
    },
  },
});
