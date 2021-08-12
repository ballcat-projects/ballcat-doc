# 字典组件

主要用于缓存字典数据，减少和服务端的交互，提高渲染效率。  

字典数据，将在第一次从服务端返回时被存储到 LocalStorage，且缓存到 vuex 中，后续使用时从 vuex 中读取，不再请求服务端

为了保证数据一致性，在用户登陆时，会向服务端发起一个校验请求，携带LS存储的字典的对应Hash值，服务端校验后，返回已经变更的字典Code，前端根据其删除对应存储。当开启 websocket 时，可以根据服务端发送消息，实时更新字典数据。



## 组件使用

字典组件分为 **display** 和 **group** 两类。

**display** ：主要针对某一个表单项的渲染，根据表单项的值，转换为对应的样式显示，内容文字即为表单项的文本。

**group**：一组字典项的集合，一般用于根据指定 dict-code 对应的一组字典项数据，渲染一个 select，radio group 等表单选择组件



### 字典组件公用属性

| 属性           | 备注                                                         |
| -------------- | ------------------------------------------------------------ |
| dictCode       | 字典标识                                                     |
| itemFilter     | Function 类型，用于过滤出指定的字典项，入参为 dictItem，出参为 boolean |
| itemIsDisabled | Function 类型，根据方法返回结果给字典项添加 disabled 禁用属性，入参为 dictItem，出参为 boolean |



### display 类型组件

display 类型额外还有个共用属性 value

| 属性  | 备注                                                         |
| ----- | ------------------------------------------------------------ |
| value | 双向绑定属性，用于标识当前组件的值，type: [String, Number, Boolean] |



#### dict-tag

包装了一个`a-tag`，主要用于表格，或者部分详情页根据字典数据回显为一个 tag 标签。

默认标签显示色为灰色，用户可以在 系统管理 => 字典管理 => 字典项 中对各个字典项进行编辑，指定其显示的标签颜色。



**正常使用：**

```html
	<dict-tag dict-code="operation_type" :value="dict-value" />
```



**配合 a-table 使用**

在表格中定制插槽：

```vue
    <a-table :columns="columns">
        <template #type-slot="text">
            <dict-tag dict-code="operation_type" :value="text" />
        </template>
    </a-table>
```

定义表格的列：

```js
export default {
  data () {
    return {
        columns: [
            {
                title: '类型',
                dataIndex: 'type',
                align: 'center',
                scopedSlots: { customRender: 'type-slot' }
            },
        ]
    }
  }
}
```



#### dict-text

使用方式和 dict-tag 基本一致，只是其显示方式是纯文字而已。同样可以在字典项中定制其显示的文本颜色：

```js
<dict-text dict-code="log_status" :value="text" />
```



### group 类型组件

group 类型也额外还有个共用属性 value，但是由于 group 可能多选，所以其 value 属性可为 Array 类型

| 属性  | 备注                                                         |
| ----- | ------------------------------------------------------------ |
| value | 双向绑定属性，用于标识当前组件的值，type: [String, Number, Boolean, Array] |



#### dict-select

根据字典项生成的 select 下拉框，除了公用属性外，额外提供了以下几个属性

| 属性              | 备注                                                         |
| ----------------- | ------------------------------------------------------------ |
| placeholder       | 占位文本                                                     |
| placeholderOption | 是否要渲染一个占位文本的selectOption，默认false              |
| mode              | 参看 antd 文档，设置 Select 的模式为多选或标签，'default' \|'multiple' \|'tags' \|'combobox' |
| allowClear        | 是否允许清除已选择条目，布尔类型，默认 true                  |

使用示例：

```html
<!--V-modal 方式 -->
<dict-select dict-code="dict_property"
             placeholder="字典属性"
             v-model="queryParam.editable">
</dict-select>

<!-- Antd 表单方式 -->
<dict-select placeholder="字典类型"
    v-decorator="['editable']"
    dict-code="dict_property">
</dict-select>
```





#### dict-radio-group

字典Radio组件，类似于 DictSelet，只不过其默认渲染出来的时Radio Group

其除了共用属性外，也额外有一个可定制属性

| 属性 | 备注                                                         |
| ---- | ------------------------------------------------------------ |
| type | 用于决定渲染为 antd 的 radio还是 radio-button, 默认 radio 。值为  'radio' 或者 'button' |

使用示例：

```html
<!--V-modal 方式 -->
<dict-radio-group 
	dict-code="dict_property"
	v-model="queryParam.editable">
</dict-radio-group>

<!-- Antd 表单方式 -->
<dict-radio-group
    v-decorator="['editable']"
    dict-code="dict_property">
</dict-radio-group>
```



#### dict-check-box-group

字典 CheckBox 组件，该类型没有自定义属性。

使用示例：

```html
<!--V-modal 方式 -->
<dict-check-box-group
	dict-code="dict_property"
	v-model="queryParam.editable">
</dict-check-box-group>

<!-- Antd 表单方式 -->
<dict-check-box-group
    v-decorator="['editable']"
    dict-code="dict_property">
</dict-check-box-group>
```



## 重要文件

### dictPlugin.js

文件地址：`/src/components/Dict/dictPlugin.js`

该文件为一个 vue plugin，默认会将所有的字典组件注册，系统在 main.js 中，加载并使用此插件

```js
// 字典注册
import DictPlugin from '@/components/Dict/dictPlugin'
Vue.use(DictPlugin)
```

### dictMixin.js

文件地址：`/src/components/Dict/dictMixin.js`

所有字典组件都会直接或者间接的混入此文件。

此 mixin 中，主要提供了一个 **dictItems** 的计算属性，方便所有的字典组件实时获取当前字典数据。

且在计算属性中，进行了过滤和国际化处理。

### dict.js

文件地址：`/src/store/modules/dict.js`

vuex moudle，提供了一个缓存所有字典数据的对象 **dictDataCache**，并在此 moudle 中进行控制字典数据的加载。



当指定的字典标识对应的数据在 **dictDataCache** 中找不到时，就会去 localStorage 中加载。

若 localStorage 中也没有数据，就会向服务端发起请求。

请求的响应数据，将会被存储到 localStorage 中，并缓存在 **dictDataCache** 中，以此减少 ls 的读取开销。

### Login.vue

文件地址：`/src/views/user/Login.vue`

用户成功登录后，将会去主动校验服务端字典数据是否更新，删除本地缓存的过期数据

```js
 loginSuccess (res) {
      // 校验并删除过期字典数据
      this.checkDictStatus()
	 // ..... 后续操作省略
}
```

### GlobalWebSocketListener.vue

文件地址：`/src/components/WebSocket/GlobalWebSocketListener.vue`

当前后台都开启了 websocket 时，此组件中监听了服务端发送的字典更新消息，当字典更新时，会触发主动删除缓存的操作，以保证字典数据的实时性，而不是等到重新登陆才能发现字典数据过期。
