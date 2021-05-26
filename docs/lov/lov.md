# Lov 

目前 LOV 重构中，文档不代表最终使用方案

## 简介

Lov 的全称是 List of value，值列表，又称弹窗选择器。

前端常见的选择组件 select，难以根据多条件进行检索，数据展示维度也比较单一，而且在选择项过多时，易产生卡顿。

Lov 组件相比较于下拉列表，可以很方便的定义多个查询条件，以及展示列，同时由于是分页查询，也不会受到数据量过多时的效率影响。

当然 Lov 也不是处处都好，在选择项较少，检索条件单一的时候，使用 select 组件，可以减少用户的一次交互，提示用户体验。





## 使用示例

### 定义你的 Lov 相关 Options

在一个 `lov.js` 文件中，定义项目中所有需要的 LOV 的 Options。

```js
// Lov 搜索条件控件的类型
const SEARCH_TYPE={
	"input": "input",
	"number-input":"number-input",
	"select":"select",
	"dict-select":"dict-select"
}
// 多语言列表
const lang={1:"cn",2:"en"};


// lov 的数据交互方法，一个 promise 对象
import {getPage as userList} from '@/api/user/account'

// 定义一个 设备选择 LOV
export const equipment_lov_list={
    // lov 基础属性
	lovOption:{
		rowKey:"id", //根据id查询到
	     getPage:getPage ,
		 //-----------------以上两字段必传-------------------------//
		 modelTitle:"设备列表",
		 modelWidth:"800px",//模态框宽度
		 placeholder:"请选择设备列表",
		 tableSize:"middle",
		 fixedParams:{}, //需要添加的额外参数,
		 multiple:1,    //默认单选, 1 多选 0单选
         retField:"id",// 返回字段,默认是rowKey
		 onlyShow:1, //是否返回数据
		 showSelectAll:1,//是否展示弹框中选中的数据
		 lang:lang[1], //默认中文，用于lov里边 查询按钮和添加国际化,
		 disabled:false,//是否禁止操作 1禁止操作 0 可以操作,默认0
	},
    // 查询控件
	searchOption:[
	 {
          label:"设备号",
          field:"id",
          tag:SEARCH_TYPE.input,
          placeholder:"请输入id",
          options:[],
          dictCode:null,
          min:null,
          max:null,
	 },
	 {
		label:"设备名称",
		field:"name",
		tag:SEARCH_TYPE.input,
		placeholder:"请输入设备名称",
		options:[],
		dictCode:null,
		min:null,
		max:null,
     }		
    ],
    // 表格部分
	columnsOption:[
		{ 
			title:"设备编号", //表格展示的数据
			dataIndex:"id",
	   },
	   {
			title:"设备名", //表格展示的数据
			dataIndex:"name",
			customRender:(text)=> {
				return text;
			},
	   }
	]
};
```

### 在使用页面中引入 Lov Options

```js
import {} from
```



### 在模板中使用 Lov

使用 v-model 进行双向绑定：

```javascript
 <lov-test :keyword="userList" v-model="queryParam.userId"/>
```
也支持 `ant-design-vue` 默认的表单绑定形式：

```html
 <a-form-item label="用户">
    <lov-test v-decorator="['userId', decoratorOptions.userId]" :keyword="userList"  />
 </a-form-item>
```

你也可以给 lov 配置 disabled 属性，变为一个只读控件
```html
 <lov-test :keyword="userList" v-model="userId" :disabled="true"/>
```



## 参数说明

### lov

| 参数          | 说明                                        |     类型      | 是否必传 |
| ------------- | :------------------------------------------ | :-----------: | -------- |
| lovOption     | lov的基本属性和说明                         |    Object     | 是       |
| searchOption  | lov的搜索配置                               | Array[object] | 否       |
| columnsOption | lov表格的展示 （使用请参考ant-design 表格） | Array[object] | 是       |


### lovOption
| 参数          | 说明                                                    |   类型   | 是否必传 | 默认值 |
| ------------- | :------------------------------------------------------ | :------: | -------- | ------ |
| rowKey        | 作为 lov 表格 rowKey, 必须保证唯一                      |  String  | 是       | -      |
| getPage       | lovOption 获取数据接口                                  | Function | 是       | -      |
| modelTitle    | lov 模态框title的展示                                   |  String  | 否       | -      |
| placeholder   | lov 的 placeholder                                      |  String  | 否       | -      |
| tableSize     | lov 中表格的大小, 值可以参考 ant-design                 |  String  | 否       | middle |
| fixedParams   | 获取接口数据你需要配置的额外参数                        |  Object  | 否       | {}     |
| multiple      | 表格数据是否多选 1:多选，0:单选                         |  Number  | 否       | 0      |
| retField      | 操作数据后,返回值，如果没有，默认返回 rowKey 指定的字段 |  String  | 否       | rowKey |
| onlyShow      | 仅仅用于展示数据 1: 返回数据 0: 仅仅展示数据            |  Number  | 否       | 1      |
| showSelectAll | 是否在模态框页面展示选中的数据                          |  Number  | 否       | 1      |
| lang          | lov 公用组件语言配置，目前只有中英文                    |  String  | 否       | cn     |



### searchOption
| 参数        | 说明                                                         |  类型  | 是否必传 | 默认值 |
| ----------- | :----------------------------------------------------------- | :----: | -------- | ------ |
| label       | lov中搜索框的label （建议填写）                              | String | 否       | -      |
| field       | lov中搜索框的value                                           | String | 是       | -      |
| tag         | lov中搜索框的标签类型                                        | String | 是       | -      |
| placeholder | lov中搜索框的placeholder                                     | String | 否       | -      |
| options     | lov中搜索框的类型为selcect 时候使用（参考ant-design select 中options 用法） | Array  | 否       | -      |
| dictCode    | lov中搜索框的类型为字典时候                                  | String | 否       | -      |
| min         | lov中搜索框的类型是数字,最小值                               | Number | 否       | 0      |
| max         | lov中搜索框的类型是数字，最大值                              | Number | 否       | -      |

### columnsOption
使用方法参考 antd-vue 表格中的 columns 用法：[antd-vue-table](https://antdv.com/components/table-cn/)



