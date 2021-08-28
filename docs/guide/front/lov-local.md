# Lov Local

## 简介

Lov 的全称是 List of value，值列表，又称弹窗选择器。

前端常见的选择组件 select，难以根据多条件进行检索，数据展示维度也比较单一，而且在选择项过多时，易产生卡顿。

Lov 组件相比较于下拉列表，可以很方便的定义多个查询条件，以及展示列，同时由于是分页查询，也不会受到数据量过多时的效率影响。

当然 Lov 也不是处处都好，在选择项较少，检索条件单一的时候，使用 select 组件，可以减少用户的一次交互，提示用户体验。

> 原 lov 组件在服务端进行属性配置，增加了交互开销，以及前端的定制会比较繁琐。

> 故新增了 lov-local 的纯前端组件，之前的 lov 组件将在后续版本移除



## 使用示例

### 定义你的 Lov-Local 相关 Options

在一个 `lovOptions.js` 文件中，定义项目中所有需要的 LOV 的 Options。

```js
// Lov 搜索条件控件的类型
const SEARCH_TYPE={
    "input": "input",
    "number-input":"number-input",
    "select":"select",
    "dict-select":"dict-select"
}


import { getPage as getUserPage } from '@/api/system/user'

export const sysUserLov = {
    multiple: true,
    isNumberValue: true,
    modalTitle: '用户',
    dataKey: 'userId',
    // 自定义选择项的展示标题
    customOptionTitle (record) {
        return record.nickname
    },
    getPageData: getUserPage,
    // 搜索配置
    searchOptions: [
        {
            label: '用户名',
            field: 'username',
            type: SEARCH_TYPE.input,
            placeholder: 'message.pleaseEnter'
        },
        {
            label: '昵称',
            field: 'name',
            type: SEARCH_TYPE.input,
            placeholder: 'message.pleaseEnter'
        }
    ],
    // 表格列
    tableColumns:
        [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '昵称',
                dataIndex: 'nickname'
            },
            {
                title: '组织',
                dataIndex: 'organizationName'
            }
        ]
}
```

### 在使用页面中引入 Lov Options

```js
import { sysUserLov } from '@/components/Lov/lovOptions'
```

### 放入 vue 组件的 data 中
```js
export default {
    data() {
        return {
            sysUserLov
        }
    },
}
```

### 在模板中使用 Lov

使用 v-model 进行双向绑定：

```javascript
 <lov-local v-model="queryParam.userId" v-bind="sysUserLov"/>
```
也支持 `ant-design-vue` 默认的表单绑定形式：

```html
 <a-form-item label="用户">
    <lov-local v-decorator="['userId', decoratorOptions.userId]" v-bind="sysUserLov" />
</a-form-item>
```

你也可以给 lov 配置 disabled 属性，变为一个只读控件
```html
 <lov-local v-model="userId" v-bind="sysUserLov" :disabled="true"/>
```


## 参数说明

| 参数              | 说明                                                |        类型         | 是否必传 | 默认值   |
| ----------------- | :-------------------------------------------------- | :-----------------: | -------- | -------- |
| isNumberValue     | lov 值是否是 Number 类型（由于 antd 限制，Number 类型需要特殊处理下）   |       Boolean       | 否       | false    |
| multiple          | lov 是否多选                                        |       Boolean       | 否       | false    |
| disabled          | lov 是否禁用                                        |       Boolean       | 否       | false    |
| placeholder       | lov 未选中时的提示占位符                            |       String        | 否       | ''       |
| dataKey           | lov 选中数据后的 value 对应属性名（该属性必须唯一） |       String        | 是       | -        |
| customOptionTitle | 自定义选择项的展示标题，默认直接展示 value 属性     |      Function       | 否       | -        |
| modalTitle        | lov 弹出框的标题                                    |       String        | 否       | ''       |
| modalWidth        | lov 弹出框的宽度                                    |       String        | 否       | '600px'  |
| searchOptions     | lov 弹出框的搜索区域配置                            | Array[SearchOption] | 否       | []       |
| getPageData       | lov 表格数据加载方法，返回 promise                  |      Function       | 是       | -        |
| tableColumns      | lov 表格的列展示选项，对应 a-table 的 column 属性   |    Array[Column]    | 是       | -        |
| tableSize         | String，值为 a-table 支持的 size 类型               |       String        | 否       | 'middle' |

### SearchOption
| 参数        | 说明                                                         |  类型  | 是否必传 | 默认值 |
| ----------- | :----------------------------------------------------------- | :----: | -------- | ------ |
| label       | lov中搜索框的 label （建议填写）                             | String | 否       | -      |
| field       | lov中搜索框的 value 对应的 name                              | String | 是       | -      |
| type        | lov中搜索框的标签类型                                        | String | 是       | -      |
| placeholder | lov中搜索框的 placeholder                                    | String | 否       | -      |
| options     | lov中搜索框的类型为 selcect 时候使用（参考ant-design select 中options 用法） | Array  | 否       | -      |
| dictCode    | lov中搜索框的类型为字典时候                                  | String | 否       | -      |
| min         | lov中搜索框的类型是数字, 最小值                              | Number | 否       | 0      |
| max         | lov中搜索框的类型是数字，最大值                              | Number | 否       | -      |

### Column
使用方法参考 antd-vue 表格中的 columns 用法：[antd-vue-table](https://antdv.com/components/table-cn/)



## 事件

| 事件名称  | 说明                                                         |             回调参数              |
| --------- | :----------------------------------------------------------- | :-------------------------------: |
| change    | 当选中值变更时触发，回调入参多选时为数组                     | selectedValue \|\| selectedValues |
| input     | 同 change 事件                                               | selectedValue \|\| selectedValues |
| rowChange | 也是值变更时触发，不同的是，回调入参为数据对象或数据对象数组 |   selectedRow \|\| selectedRows   |
