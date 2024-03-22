---

category: frontend

tag: vue

order: 1

excerpt: vue全家桶

---
# :frog: Vue
vue是一个遵循MVVM的渐进式Javascript框架
## 模板语法
### 插值语法
```vue
<div id="root">
<h1>{{name}}</h1>
</div>
<script>
new Vue({
    el:"#root",
    data() {
        return{
            name:"wjj"
        }
    }
})
</script>
```

我们称id为root的div为容器，我们new出来的vue实例为这个容器服务。插值语法可以直接访问这个vue实例的属性。vue底层通过代理的方式将data中的数据绑定到vue实例上，因此我们可以直接访问data中的数据，而且当data中数据发生改变时，vue会自动修改容器中的数据，我们称之为响应式。

`{{xxx}}`xx中的语句会被作为js表达式

## 指令语法
用于给html的属性赋值
### 数据绑定
- `v-bind:href='xx'` xx 会作为 js 表达式被解析。同样的，可以直接访问data中的数据。只不过当页面的数据被修改时data中的数据不变。比如input框的value属性。可以用v-bind:value给input绑定初始值，当value被修改时，data中数据不变。简写为`:href`
- `v-model:value='xx'`当data中数据被修改时，页面会被修改，当页面的数据被修改时，data数据也会跟着改变。可以简写为 v-model，因为v-model默认收集的就是value值。
### 事件
我们用指令`v-on:xxx="fun"`给元素绑定事件
1. 使用v-on:xxx 或 @xxx 绑定事件，其中xxx是事件名；
2. 事件的回调需要配置在methods对象中，最终会在vm上；
3. methods中配置的函数，不要用箭头函数！否则this就不是vm了；
4. methods中配置的函数，都是被Vue所管理的函数，this的指向是vm 或 组件实例对象；
5. `@click="demo"` 和 `@click="demo($event)"` 效果一致，但后者可以传参；默认传event参数，若给了别的参数，event就没了，所以可以传`$event`来防止event消失
#### 修饰符
Vue中的事件修饰符：
1. prevent：阻止默认事件（常用）；
2. stop：阻止事件冒泡（常用）；
3. once：事件只触发一次（常用）；
4. capture：使用事件的捕获模式；
5. self：只有event.target是当前操作的元素时才触发事件；
6. passive：事件的默认行为立即执行，无需等待事件回调执行完毕；
```js
@click.stop
```
对于键盘事件，有下面的修饰符
1. Vue中常用的按键别名：
    - 回车 => enter
    - 删除 => delete (捕获“删除”和“退格”键)
    - 退出 => esc
    - 空格 => space
    - 换行 => tab (特殊，必须配合keydown去使用)
    - 上 => up
    - 下 => down
    - 左 => left
    - 右 => right

2. Vue未提供别名的按键，可以使用按键原始的key值去绑定，但注意要转为kebab-case（短横线命名）

3. 系统修饰键（用法特殊）：ctrl、alt、shift、meta
    - .配合keyup使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。
    - .配合keydown使用：正常触发事件。

### 条件渲染
条件渲染：
1. v-if
    - .v-if="表达式" 
    - .v-else-if="表达式"
    - .v-else="表达式"
    - 适用于：切换频率较低的场景。
    - 特点：不展示的DOM元素直接被移除。
    - 注意：v-if可以和:v-else-if、v-else一起使用，但要求结构不能被“打断”。

2. v-show
    - 写法：v-show="表达式"
    - 适用于：切换频率较高的场景。
    - 特点：不展示的DOM元素未被移除，仅仅是使用样式隐藏掉
    
3. 备注：使用v-if的时，元素可能无法获取到，而使用v-show一定可以获取到。
```vue
<div v-if="n === 1">Angular</div>
<div v-else-if="n === 2">React</div>
<div v-else-if="n === 3">Vue</div>
<div v-else>哈哈</div>
<h2 v-show="1 === 1">欢迎来到{{name}}</h2>
```
### 列表渲染
v-for指令:
1. 用于展示列表数据
2. 语法：v-for="(item, index) in xxx" :key="yyy"
3. 可遍历：数组、对象、字符串（用的很少）、指定次数（用的很少）
		
#### key
面试题：react、vue中的key有什么作用？（key的内部原理）

1. 虚拟DOM中key的作用：

key是虚拟DOM对象的标识，当数据发生变化时，Vue会根据【新数据】生成【新的虚拟DOM】, 
随后Vue进行【新虚拟DOM】与【旧虚拟DOM】的差异比较，比较规则如下：
    
2. 对比规则：
    1. 旧虚拟DOM中找到了与新虚拟DOM相同的key：
        1. 若虚拟DOM中内容没变, 直接使用之前的真实DOM！
        2. 若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM。

    2. 旧虚拟DOM中未找到与新虚拟DOM相同的key
            创建新的真实DOM，随后渲染到到页面。
            
3. 用index作为key可能会引发的问题：
    1. 若对数据进行：逆序添加、逆序删除等破坏顺序操作:
        - 会产生没有必要的真实DOM更新 ==> 界面效果没问题, 但效率低。

    2. 如果结构中还包含输入类的DOM：
        - 会产生错误DOM更新 ==> 界面有问题。

4. 开发中如何选择key?:
    1. 最好使用每条数据的唯一标识作为key, 比如id、手机号、身份证号、学号等唯一值。
    2. 如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用index作为key是没有问题的。
		

### 其他指令
- v-text指令：
    1. 作用：向其所在的节点中渲染文本内容。
    2. 与插值语法的区别：v-text会替换掉节点中的内容，`{{xx}}`则不会。

```vue
<div v-text="name"></div>
```
- v-html指令：
    1. 作用：向指定节点中渲染包含html结构的内容。
    2. 与插值语法的区别：
        1. v-html会替换掉节点中所有的内容，`{{xx}}`则不会。
        2. v-html可以识别html结构。
    3. 严重注意：v-html有安全性问题！！！！
        1. 在网站上动态渲染任意HTML是非常危险的，容易导致XSS攻击。
        2. 一定要在可信的内容上使用v-html，永不要用在用户提交的内容上！
- v-cloak指令（没有值）：
    1. 本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性。
    2. 使用css配合v-cloak可以解决网速慢时页面展示出`{{xxx}}`的问题。		
- v-once指令：
    1. v-once所在节点在初次动态渲染后，就视为静态内容了。
    2. 以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能。

- v-pre指令：
    1. 跳过其所在节点的编译过程。
    2. 可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。

		

### 自定义指令
一、定义语法：
1. 局部指令：
```js
directives : {
    'my-directive' : {
        bind (el, binding) {
            el.innerHTML = binding.value.toupperCase()
        }
    }
}
```
2. 全局指令：
```js
Vue.directive('my-directive', function(el, binding){
    el.innerHTML = binding.value.toupperCase()
})
```
二、配置对象中常用的3个回调：
1. bind：指令与元素成功绑定时调用。
2. inserted：指令所在元素被插入页面时调用。
3. update：指令所在模板结构被重新解析时调用。

三、备注：
1. 指令定义时不加v-，但使用时要加v-；
2. 指令名如果是多个单词，要使用kebab-case命名方式，不要用camelCase命名。
```js

//定义全局指令
/* Vue.directive('fbind',{
    //指令与元素成功绑定时（一上来）
    bind(element,binding){
        element.value = binding.value
    },
    //指令所在元素被插入页面时
    inserted(element,binding){
        element.focus()
    },
    //指令所在的模板被重新解析时
    update(element,binding){
        element.value = binding.value
    }
}) */
```
## 计算属性和监视属性
### 计算属性
1. 定义：要用的属性不存在，要通过已有属性计算得来。
2. 原理：底层借助了Objcet.defineproperty方法提供的getter和setter。
3. get函数什么时候执行？
    1. 初次读取时会执行一次。
    2. 当依赖的数据发生改变时会被再次调用。
4. 优势：与methods实现相比，内部有缓存机制（复用），效率更高，调试方便。
5. 备注：
    1. 计算属性最终会出现在vm上，直接读取使用即可。
    2. 如果计算属性要被修改，那必须写set函数去响应修改，且set中要引起计算时依赖的数据发生改变。

```js
computed:{
    fullName:{
        //get有什么作用？当有人读取fullName时，get就会被调用，且返回值就作为fullName的值
        //get什么时候调用？1.初次读取fullName时。2.所依赖的数据发生变化时。
        get(){
            console.log('get被调用了')
            // console.log(this) //此处的this是vm
            return this.firstName + '-' + this.lastName
        },
        //set什么时候调用? 当fullName被修改时。
        set(value){
            console.log('set',value)
            const arr = value.split('-')
            this.firstName = arr[0]
            this.lastName = arr[1]
        }
    }
}

// 当只有get时，简写成
fullName(){
    console.log('get被调用了')
    return this.firstName + '-' + this.lastName
}
```
### 监视属性
1. 当被监视的属性变化时, 回调函数自动调用, 进行相关操作
2. 监视的属性必须存在，才能进行监视！！
3. 监视的两种写法：
    1. new Vue时传入watch配置
    2. 通过vm.$watch监视
```js
watch:{
    //正常写法
    /* isHot:{
        // immediate:true, //初始化时让handler调用一下
        // deep:true,//深度监视
        handler(newValue,oldValue){
            console.log('isHot被修改了',newValue,oldValue)
        }
    }, */
    //简写
    /* isHot(newValue,oldValue){
        console.log('isHot被修改了',newValue,oldValue,this)
    } */
}
```
## 绑定样式
1. class样式
    写法:class="xxx" xxx可以是字符串、对象、数组。
    - 字符串写法适用于：类名不确定，要动态获取。
    - 对象写法适用于：要绑定多个样式，个数不确定，名字也不确定。
    - 数组写法适用于：要绑定多个样式，个数确定，名字也确定，但不确定用不用。
2. style样式
    - :style="{fontSize: xxx}"其中xxx是动态值。
    - :style="[a,b]"其中a、b是样式对象。

```js
classArr:['atguigu1','atguigu2','atguigu3'],
classObj:{
    atguigu1:false,
    atguigu2:false,
},
styleObj:{
    fontSize: '40px',
    color:'red',
},
styleObj2:{
    backgroundColor:'orange'
},
styleArr:[
    {
        fontSize: '40px',
        color:'blue',
    },
    {
        backgroundColor:'gray'
    }
]
```
## 收集表单数据
若：`<input type="text"/>`，则v-model收集的是value值，用户输入的就是value值。
若：`<input type="radio"/>`，则v-model收集的是value值，且要给标签配置value值。
若：`<input type="checkbox"/>`
1. 没有配置input的value属性，那么收集的就是checked（勾选 or 未勾选，是布尔值）
2. 配置input的value属性:
    1. v-model的初始值是非数组，那么收集的就是checked（勾选 or 未勾选，是布尔值）
    2. v-model的初始值是数组，那么收集的的就是value组成的数组
3. v-model的三个修饰符：
    - lazy：失去焦点再收集数据
    - number：输入字符串转为有效的数字
    - trim：输入首尾空格过滤
## 过滤器
1. 定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）。
2. 语法：
    1. 注册过滤器：`Vue.filter(name,callback)` 或 `new Vue{filters:{}}`
    2. 使用过滤器：`{{ xxx | 过滤器名}}`  或  `v-bind:属性 = "xxx | 过滤器名"`
3. 备注：
    1. 过滤器也可以接收额外参数、多个过滤器也可以串联
    2. 并没有改变原本的数据, 是产生新的对应的数据

```vue
<div id="root">
    <h2>显示格式化后的时间</h2>
    <!-- 计算属性实现 -->
    <h3>现在是：{{fmtTime}}</h3>
    <!-- methods实现 -->
    <h3>现在是：{{getFmtTime()}}</h3>
    <!-- 过滤器实现 -->
    <h3>现在是：{{time | timeFormater}}</h3>
    <!-- 过滤器实现（传参） -->
    <h3>现在是：{{time | timeFormater('YYYY_MM_DD') | mySlice}}</h3>
    <h3 :x="msg | mySlice">尚硅谷</h3>
</div>
filters:{
    timeFormater(value,str='YYYY年MM月DD日 HH:mm:ss'){
        // console.log('@',value)
        return dayjs(value).format(str)
    }
}
```
## 生命周期钩子
下面的钩子直接定义在new vue时
```vue
new Vue({
    el:'#root',
    // template:`
    // 	<div>
    // 		<h2>当前的n值是：{{n}}</h2>
    // 		<button @click="add">点我n+1</button>
    // 	</div>
    // `,
    data:{
        n:1
    },
    methods: {
        add(){
            console.log('add')
            this.n++
        },
        bye(){
            console.log('bye')
            this.$destroy()
        }
    },
    watch:{
        n(){
            console.log('n变了')
        }
    },
    beforeCreate() {
        console.log('beforeCreate')
    },
    created() {
        console.log('created')
    },
    beforeMount() {
        console.log('beforeMount')
    },
    mounted() {
        console.log('mounted')
    },
    beforeUpdate() {
        console.log('beforeUpdate')
    },
    updated() {
        console.log('updated')
    },
    beforeDestroy() {
        console.log('beforeDestroy')
    },
    destroyed() {
        console.log('destroyed')
    },
})
```
## 组件

Vue中使用组件的三大步骤：
1. 如何定义一个组件？

使用Vue.extend(options)创建，其中options和new Vue(options)时传入的那个options几乎一样，但也有点区别；
区别如下：

1. el不要写，为什么？ ——— 最终所有的组件都要经过一个vm的管理，由vm中的el决定服务哪个容器。
2. data必须写成函数，为什么？ ———— 避免组件被复用时，数据存在引用关系。

备注：使用template可以配置组件结构。

2. 如何注册组件？
    1. 局部注册：靠new Vue的时候传入components选项
    2. 全局注册：靠Vue.component('组件名',组件)

3. 编写组件标签：`<school></school>`

### 单文件组件
Vue 的单文件组件 (即 *.vue 文件，英文 Single-File Component，简称 SFC) 是一种特殊的文件格式，使我们能够将一个 Vue 组件的模板、逻辑与样式封装在单个文件中。下面是一个单文件组件的示例：
```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```
## 组合式API和响应式API
### 选项式 API (Options API)​
使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 data、methods 和 mounted。选项所定义的属性都会暴露在函数内部的 this 上，它会指向当前的组件实例。

```vue
<script>
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      count: 0
    }
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件处理器绑定
  methods: {
    increment() {
      this.count++
    }
  },

  // 生命周期钩子会在组件生命周期的各个不同阶段被调用
  // 例如这个函数就会在组件挂载完成后被调用
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

### 组合式 API (Composition API)​
通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 `<script setup>` 搭配使用。这个 setup attribute 是一个标识，告诉 Vue 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API。比如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

下面是使用了组合式 API 与` <script setup> `改造后和上面的模板完全一样的组件：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

若不用setup语法糖
```vue
<script>
expert default{
    props:[age];
    setup(props){
        name: ref(0);
        return name;
    }
}
</script>
```

setup的返回值会绑定到组件实例上去，在模板中一样可以使用。下面我们就对上面的那些选项式API进行改变
### data methods
在选项式api中我们是
```vue
<script>
expert default{
    data(){
        return{
            name:xxx;
        }
    }
    methods: {
        kk: function(){

        }
    }
}
</script>
```

而在组合式API中，我们是
```vue
<script>
expert default{
    setup(){
        name = ref(0)
        kk = function(){

        }
        return name,kk
    }
}
</script>
```

由于要返回，特别麻烦，于是我们把返回交给脚手架做
```vue
<script setup>
name = ref(0);
kk = ()->{

}
</script>
```
我们使用ref和reactive来使数据有响应式，ref的底层是Object.defineProperties.而reactive的底层是Proxy代理对象。
```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

在set中我们渲染页面.

### 计算 监视
#### 计算
在选项式API中，我们是
```vue
<script>
expert default{
    data(){
        return 
    }
    computed:{
        fullName:{
            //get有什么作用？当有人读取fullName时，get就会被调用，且返回值就作为fullName的值
            //get什么时候调用？1.初次读取fullName时。2.所依赖的数据发生变化时。
            get(){
                console.log('get被调用了')
                // console.log(this) //此处的this是vm
                return this.firstName + '-' + this.lastName
            },
            //set什么时候调用? 当fullName被修改时。
            set(value){
                console.log('set',value)
                const arr = value.split('-')
                this.firstName = arr[0]
                this.lastName = arr[1]
            }
        }
        // 当只有get时，简写成
        fullName(){
            console.log('get被调用了')
            return this.firstName + '-' + this.lastName
        }
    }
}
</script>
```

在组合式API中，我们没有选项于是需要导入`computed`api
```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
// 当然可以传递一个对象和选项式一样
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```
#### 监视
```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

这是我们的组合式API，导入watch。有的时候需要监听对象的某个值，但这个值并不是响应式的，我们不能这样写
```js
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```
我们应该
```js
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```
用一个函数去获取对象的值，还可以是多个数据源组成的数组
```js
// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

直接给 watch() 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发：

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})
```
相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调：

```js
watch(
  () => state.someObject,
  () => {
    // 仅当 state.someObject 被替换时触发
  }
)
你也可以给上面这个例子显式地加上 deep 选项，强制转成深层侦听器：
```
```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)

watch(source, (newValue, oldValue) => {
  // 立即执行，且当 `source` 改变时再次执行
}, { immediate: true })
```

##### watchEffect()​
侦听器的回调使用与源完全相同的响应式状态是很常见的。例如下面的代码，在每当 todoId 的引用发生变化时使用侦听器来加载一个远程资源：

```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })
```
特别是注意侦听器是如何两次使用 todoId 的，一次是作为源，另一次是在回调中。

我们可以用 watchEffect 函数 来简化上面的代码。watchEffect() 允许我们自动跟踪回调的响应式依赖。上面的侦听器可以重写为：

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```
这个例子中，回调会立即执行，不需要指定 immediate: true。在执行期间，它会自动追踪 todoId.value 作为依赖（和计算属性类似）。每当 todoId.value 变化时，回调会再次执行。有了 watchEffect()，我们不再需要明确传递 todoId 作为源值。
```js
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```
### 生命周期钩子
```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```
## 模板引用
虽然 Vue 的声明性渲染模型为你抽象了大部分对 DOM 的直接操作，但在某些情况下，我们仍然需要直接访问底层 DOM 元素。要实现这一点，我们可以使用特殊的 ref attribute：

```html
<input ref="input">
```
ref 是一个特殊的 attribute，和 v-for 章节中提到的 key 类似。它允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。这可能很有用，比如说在组件挂载时将焦点设置到一个 input 元素上，或在一个元素上初始化一个第三方库。
​
挂载结束后引用都会被暴露在 this.$refs 之上：

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```
注意，你只可以在组件挂载后才能访问模板引用。如果你想在模板中的表达式上访问 $refs.input，在初次渲染时会是 null。这是因为在初次渲染前这个元素还不存在呢！
### 组合式API
```vue
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```
## 深入组件
### 注册
一个 Vue 组件在使用前需要先被“注册”，这样 Vue 才能在渲染模板时找到其对应的实现。组件注册有两种方式：全局注册和局部注册。

1. 全局注册​
我们可以使用 Vue 应用实例的 app.component() 方法，让组件在当前 Vue 应用中全局可用。

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // 注册的名字
  'MyComponent',
  // 组件的实现
  {
    /* ... */
  }
)
```
如果使用单文件组件，你可以注册被导入的 .vue 文件：

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
app.component() 方法可以被链式调用：
```
```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```
全局注册的组件可以在此应用的任意组件的模板中使用：

```vue
<!-- 这在当前应用的任意组件中都可用 -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```
所有的子组件也可以使用全局注册的组件，这意味着这三个组件也都可以在彼此内部使用。

2. 局部注册​
全局注册虽然很方便，但有以下几个问题：

全局注册，但并没有被使用的组件无法在生产打包时被自动移除 (也叫“tree-shaking”)。如果你全局注册了一个组件，即使它并没有被实际使用，它仍然会出现在打包后的 JS 文件中。

全局注册在大型项目中使项目的依赖关系变得不那么明确。在父组件中使用子组件时，不太容易定位子组件的实现。和使用过多的全局变量一样，这可能会影响应用长期的可维护性。

相比之下，局部注册的组件需要在使用它的父组件中显式导入，并且只能在该父组件中使用。它的优点是使组件之间的依赖关系更加明确，并且对 tree-shaking 更加友好。

局部注册需要使用 components 选项：

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```
在使用 `<script setup>` 的单文件组件中，导入的组件可以直接在模板中使用，无需注册：

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

如果没有使用` <script setup>`，则需要使用 components 选项来显式注册：

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```
对于每个 components 对象里的属性，它们的 key 名就是注册的组件名，而值就是相应组件的实现。上面的例子中使用的是 ES2015 的缩写语法，等价于：

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```
请注意：局部注册的组件在后代组件中并不可用。在这个例子中，ComponentA 注册后仅在当前组件可用，而在任何的子组件或更深层的子组件中都不可用。
### props
#### 定义
1. 选项式
一个组件需要显式声明它所接受的 props，这样 Vue 才能知道外部传入的哪些是 props，哪些是透传 attribute (关于透传 attribute，我们会在专门的章节中讨论)。

props 需要使用 props 选项来定义：

```js
export default {
  props: ['foo'],
  created() {
    // props 会暴露到 `this` 上
    console.log(this.foo)
  }
}
```
除了使用字符串数组来声明 prop 外，还可以使用对象的形式：

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```
对于以对象形式声明中的每个属性，key 是 prop 的名称，而值则是该 prop 预期类型的构造函数。比如，如果要求一个 prop 的值是 number 类型，则可使用 Number 构造函数作为其声明的值。

2. 组合式
在使用 `<script setup> `的单文件组件中，props 可以使用 defineProps() 宏来声明：

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```
在没有使用 `<script setup>` 的组件中，prop 可以使用 props 选项来声明：

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() 接收 props 作为第一个参数
    console.log(props.foo)
  }
}
```


在父组件调用子组件使我们就可以使用
```vue
<MyComponent greeting-message="hello" />
```
#### 单向数据流​
所有的 props 都遵循着单向绑定原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。

另外，每次父组件更新后，所有的子组件中的 props 都会被更新到最新值，这意味着你不应该在子组件中去更改一个 prop。若你这么做了，Vue 会在控制台上向你抛出警告：

```js
const props = defineProps(['foo'])

// ❌ 警告！prop 是只读的！
props.foo = 'bar'
```
导致你想要更改一个 prop 的需求通常来源于以下两种场景：

prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性。在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：

```js
const props = defineProps(['initialCounter'])

// 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const counter = ref(props.initialCounter)
```
需要对传入的 prop 值做进一步的转换。在这种情况中，最好是基于该 prop 值定义一个计算属性：

```js
const props = defineProps(['size'])

// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```
更改对象 / 数组类型的 props​

当对象或数组作为 props 被传入时，虽然子组件无法更改 props 绑定，但仍然可以更改对象或数组内部的值。这是因为 JavaScript 的对象和数组是按引用传递，而对 Vue 来说，禁止这样的改动，虽然可能生效，但有很大的性能损耗，比较得不偿失。

这种更改的主要缺陷是它允许了子组件以某种不明显的方式影响父组件的状态，可能会使数据流在将来变得更难以理解。在最佳实践中，你应该尽可能避免这样的更改，除非父子组件在设计上本来就需要紧密耦合。在大多数场景下，子组件应该抛出一个事件来通知父组件做出改变。

#### Prop 校验​
Vue 组件可以更细致地声明对传入的 props 的校验要求。比如我们上面已经看到过的类型声明，如果传入的值不满足类型要求，Vue 会在浏览器控制台中抛出警告来提醒使用者。这在开发给其他开发者使用的组件时非常有用。

要声明对 props 的校验，你可以向 defineProps() 宏提供一个带有 props 校验选项的对象，例如：

```js
defineProps({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // Number 类型的默认值
  propD: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propE: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  propF: {
    validator(value) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propG: {
    type: Function,
    // 不像对象或数组的默认，这不是一个
    // 工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
})
TIP
```
defineProps() 宏中的参数不可以访问 `<script setup> `中定义的其他变量，因为在编译时整个表达式都会被移到外部的函数中。

一些补充细节：

所有 prop 默认都是可选的，除非声明了 required: true。

除 Boolean 外的未传递的可选 prop 将会有一个默认值 undefined。

Boolean 类型的未传递 prop 将被转换为 false。这可以通过为它设置 default 来更改——例如：设置为 default: undefined 将与非布尔类型的 prop 的行为保持一致。

如果声明了 default 值，那么在 prop 的值被解析为 undefined 时，无论 prop 是未被传递还是显式指明的 undefined，都会改为 default 值。

当 prop 的校验失败后，Vue 会抛出一个控制台警告 (在开发模式下)。

如果使用了基于类型的 prop 声明 ，Vue 会尽最大努力在运行时按照 prop 的类型标注进行编译。举例来说，defineProps<{ msg: string }> 会被编译为 `{ msg: { type: String, required: true }}。`

运行时类型检查​
校验选项中的 type 可以是下列这些原生构造函数：

- String
- Number
- Boolean
- Array
- Object
- Date
- Function
- Symbol
另外，type 也可以是自定义的类或构造函数，Vue 将会通过 instanceof 来检查类型是否匹配。例如下面这个类：

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```
你可以将其作为一个 prop 的类型：

```js
defineProps({
  author: Person
})
```
Vue 会通过 instanceof Person 来校验 author prop 的值是否是 Person 类的一个实例。

#### Boolean 类型转换​
为了更贴近原生 boolean attributes 的行为，声明为 Boolean 类型的 props 有特别的类型转换规则。以带有如下声明的 `<MyComponent> `组件为例：

```js
defineProps({
  disabled: Boolean
})
```
该组件可以被这样使用：

```vue
<!-- 等同于传入 :disabled="true" -->
<MyComponent disabled />

<!-- 等同于传入 :disabled="false" -->
<MyComponent />
```
当一个 prop 被声明为允许多种类型时，例如：

```js
defineProps({
  disabled: [Boolean, Number]
})
```
无论声明类型的顺序如何，Boolean 类型的特殊转换规则都会被应用。