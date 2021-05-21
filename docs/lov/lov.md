# 关于lov的使用说明规范


### lov 使用api

| 参数        | 说明   |  类型  |  是否必传  |
| --------   | :----- | :----:  |
| lovOption     | lov的基本属性和说明  |   Object     |  -（必传） |
| searchOption        |  lov的搜索配置   |   Array[object]   |   -|
| columnsOption        |    lov表格的展示 （使用请参考ant-design 表格）  |  Array[object]   |  -必传 |


### lov 中lovOption的参数使用方法
| 参数        | 说明   |  类型  |  是否必传  | 默认值|
| --------   | :----- | :----:  |
| rowKey     | 作为lov表格rowKey,必须保证唯一   |   String     | 是 | -|
| getPage        | lovOption获取数据接口  |   Function   |   是|-|
| modelTitle        |    lov模态框title的展示  |  String  | - |-|
| placeholder        |    lov的placeholder  |  String  | - |-|
| tableSize        |    lov中表格的大小,值可以参考ant-design |  String |- |middle|
| fixedParams        |  获取接口数据你需要配置的额外参数 |  Object |- |{}|
| multiple        |  表格数据是否多选 1:多选，0:单选 |  Number |- |0|
| retField        |  操作数据后,返回值，如果没有，默认返回rowKey指定的字段 |  String |- |rowKey|
| onlyShow        |  仅仅用于展示数据 1:返回数据 0:仅仅展示数据 |  Number |- |1|
| showSelectAll        |  是否在模态框页面展示选中的数据 |  Number |- |1|
| lang        |  lov公用组件语言配置，目前只有中英文 |  String |- |cn|



### lov 中searchOption的参数使用方法
| 参数        | 说明   |  类型  |  是否必传  | 默认值|
| --------   | :----- | :----:  |
| label     | lov中搜索框的label （建议填写） |   String     | - | -|
| field        |  lov中搜索框的value  |   String   |   是|-|
| tag        |    lov中搜索框的标签类型  |  String  | 是 |-|
| placeholder        |    lov中搜索框的placeholder |  String  | - |-|
| options        |    lov中搜索框的类型为selcect 时候使用（参考ant-design select 中options 用法） |  Array  | - |-|
| dictCode        |    lov中搜索框的类型为字典时候 |  String  | - |-|
| min        |    lov中搜索框的类型是数字,最小值|  Number  | - |0|
| max     |    lov中搜索框的类型是数字，最大值|  Number  | - |-|

### lov 中columnsOption的使用方法
使用方法参考ant-vue表格中的columns用法

### lov 中使用查询示例
首先在lov.js 中配置你的lov
#### JS代码　

```javascript
import {getPage as userList} from '@/api/user/account'
const SEARCH_TYPE={
	"input": "input",
	"number-input":"number-input",
	"select":"select",
	"dict-select":"dict-select"
}
const lang={1:"cn",2:"en"};
export const equipment_lov_list={
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
###页面中model方式使用
```javascript
<a-form-item label="用户Id">
     <lov-test :keyword="userList" v-model="queryParam.userId"/>
</a-form-item>
```
### 页面中decorator方式使用
```javascript
 <a-form-item label="用户">
        <lov-test v-decorator="['userId', decoratorOptions.userId]" :keyword="userList"  />
      </a-form-item>
```

### 备注
你也可以给lov 配置 disabled属性
```javascript
 <a-form-item label="用户">
        <lov-test v-decorator="['userId', decoratorOptions.userId]" :keyword="userList"  :disabled="true" />
      </a-form-item>
```
