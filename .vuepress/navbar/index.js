import { navbar } from "vuepress-theme-hope";

export const Navbar = navbar([
  {
    text: "主页",
    icon: "home",
    link: "/",
  },
  {
    text: "随笔",
    icon: "note",
    link: "/essay/",
  },
  {
    text: "Code",
    icon: "exercise",
    prefix: "/code",
    children: [
      {
        text: "开发",
        prefix: "/develop/",
        children: [
          {
            text: "前端",
            icon: "flex",
            link: "frontend/",
          },
          {
            text: "后端",
            icon: "back-stage",
            link: "backend/",
          },
        ],
      },
      {
        text: "编程语言",
        prefix: "/language",
        children: [
          {
            text: "Python",
            icon: "python",
            link: "/python/",
          },
          {
            text: "C",
            icon: "c",
            link: "/c/",
          },
          {
            text: "Java",
            icon: "java",
            link: "/java/",
          },
          {
            text: "更多",
            icon: "more",
            link: "/",
          },
        ],
      },
      {
        text: "算法",
        prefix: "/algorithm/",
        children: [
          {
            text: "数据结构",
            icon: "any",
            link: "structure/",
          },
          {
            text: "算法",
            icon: "condition",
            link: "算法/",
          },
        ],
      },
      {
        text: "AI",
        children: [
          {
            text: "理解黑盒",
            icon: "eye",
            link: "/ai",
          },
        ],
      },
    ],
  },
  {
    text: "计算机",
    icon: "computer",
    prefix: "/computer/",
    children: [
      {
        text: "计算机组成原理",
        icon: "IO",
        link: "compose/",
      },
      {
        text: "计算机网络",
        icon: "http",
        link: "network/",
      },
      {
        text: "Linux",
        icon: "linux",
        link: "linux/",
      },
      {
        text: "更多",
        icon: "more",
        link: "",
      },
    ],
  },
  {
    text: "Math",
    icon: "calculate",
    prefix: "/math/",
    children: [
      {
        text: "高数",
        icon: "function",
        link: "advanced/",
      },
      {
        text: "线代",
        icon: "state",
        link: "line/",
      },
      {
        text: "概率",
        icon: "diagram",
        link: "prob/",
      },
    ],
  },
  {
    text: "杂项",
    icon: "context",
    link: "/sundry/",
  },
  {
    text: "关于我",
    icon: "info",
    link: "/intro.html",
  },
]);
