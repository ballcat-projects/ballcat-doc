# ProTable
目前文档内容对标 ballcat v0.7.0 以上版本

在原生 antd Table 的初始上进行了一层封装，功能实现参考了 react 版 [ProTable](https://procomponents.ant.design/components/table/#protable---%E9%AB%98%E7%BA%A7%E8%A1%A8%E6%A0%BC)。


## API

支持原生 Antd Table 的所有 prop，具体配置参看 [Antd Vue 官方文档](https://antdv.com/components/table-cn/#Table)。

但是 ProTable 对以下默认值做了一些调整：



### Antd Table 属性调整

| 属性       | 描述                                                         | 类型                              | 默认值   |
| ---------- | ------------------------------------------------------------ | --------------------------------- | -------- |
| size       | 表格密度                                                     | `string`                          | "middle" |
| rowKey     | 表格行 key 的取值，可以是字符串或一个函数                    | `string` | `(record) => {string}` | 'id'     |
| pagination | 分页器，参考[配置项](https://antdv.com/components/table-cn/#pagination) 或 [pagination](https://antdv.com/components/pagination-cn/)文档，设为 false 时不展示和进行分页 | `boolean` | `object`              | 如下所示 |

```js
// 默认分页器 pagination 属性
{
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total, range) => {
      let rangeBegin = range[0]
      let rangeEnd = range[1]
      if (enableI18n) {
         return this.$t('pagination.pageInfo', { rangeBegin: rangeBegin, rangeEnd: rangeEnd, total: total })
      } else {
         return rangeBegin + '-' + rangeEnd + ' ' + '共' + total + '条'
      }
    }
}
```



### Antd Column 额外属性

| 属性        | 描述             | 类型      | 默认值 |
| ----------- | ---------------- | --------- | ------ |
| hideIntable | 是否在表格中隐藏 | `boolean` | -      |



### ProTable 额外属性

除此之外 ProTable  还额外提供了一些配置属性，如下表所示：

| 属性                   | 描述                                                                                | 类型                                                   | 默认值                        |
| ---------------------- |-----------------------------------------------------------------------------------|------------------------------------------------------|----------------------------|
| request                | 获取 `dataSource` 的方法                                                               | `(params) => responseData`                           | -                          |
| responseDataProcess    | 再 `request` 获取到 `responseData` 后，将其处理为 `pageInfo` 的方法                             | `(responseData) => {records: string, total: number}` | (data) => retrurn data  |
| onPageLoadSuccess      | 分页数据加载成功时调用的钩子方法                                                                  | `(dataSource) => void`                               | () => { }                  |
| lazyLoad               | 是否延迟加载，默认表格初始化时即会调用 `request`                                                     | `boolean`                                            | false                      |
| defaultColumnState     | 默认的 column 的显示状态, key 为 column 的 dataIndex 或 key 属性，value 为 boolean，表示默认是否展示在表格中。 | `object`                                             | {}                         |
| defaultSortField       | 默认排序字段，为 null 时使用 rowKey，为 false 时不排序                                             | `string`                                             | `boolean`                  |
| defaultSortOrder       | 默认排序字段的排序规则，升序 asc/降序 desc                                                        | `string`                                             | "desc"                     |
| searchFormClassName    | 搜索表单区域的 className                                                                 | `string`                                             | -                          |
| toolbarEnabled         | 表格顶部的 toolbar 区域是否开启                                                              | `boolean`                                            | true                       |
| toolbarTitle           | 表格在 toolbar 区展示的标题的文本，当有 name 为 `toolbar-title` 的 slot 时，会使用该 slot，此配置不生效         | `string`                                             | -                          |
| toolbarOptions         | toolbar option 配置                                                                 | `{ fullScreen: boolean                               | function, reload: boolean  |function,setting: true, density?: boolean }` | `{fullScreen: true, reload: true,setting: true, density: true }` |
| tableAlertRender       | 自定义批量操作工具栏左侧信息区域的 scopedSlotName, false 时整个 alert 都不显示                            | `string`                                             | `boolean`                  |
| tableAlertOptionRender | 自定义批量操作工具栏右侧选项区域的 scopedSlotName, false 时不显示                                      | `string`                                             | `boolean`                  |
| alwaysShowAlert        | 总是显示 alert 信息（必须开启 rowSelection ）                                                 | `boolean`                                            | false                      |
| cardProps              | 包裹表格的 tableCard 属性，属性列表参看 Antd Card 组件。当值 为 false 时，不在表格外包裹一层 card                | `boolean`                                            | `object`                   |
| showPagination         | 是否展示表格自带的分页器                                                                      | `boolean`                                            | true                       |
| onPaginationChange     | 分页属性改变事件，主要用于自定义的分页器                                                              | `(localPagination) => void`                          | () => { }                  |



#### 表格列的隐藏

proTable 的 `defaultColumnState` 属性和 column 中扩展的 `hiddenInTable` 属性并不相同

`hiddenInTable`  是在表格和列设置中都隐藏，可用于权限控制。

`defaultColumnState`，只是默认不显示，可以在列设置中恢复显示，用于表格列太多时的简化展示。



#### 分页器属性介绍

将 ant table 自带的属性 `pagination` 设置为 false， 可以取消表格的分页器。

而 ProTable 的 `showPagination` 设置为 false 时，也会取消表格的分页器。

这两者的区别主要在于 `pagination=false` 主要用于不需要分页的表格，比如树形表格，可能会一次性加载全部数据，或懒加载处理。

而 `showPagination=false`，需要配合自定义的 `pagination` 属性以及 `onPaginationChange` 事件，用于取消表格自带的分页器显示，使用自定义的分页器（可以参看 LovLocal 组件）





## 方法

ProTable 组件中定义了一些方法，用户在使用 ref 引用组件时，可以对这些方法进行直接调用

| 名称                  | 描述                                                         | 类型                              |
| --------------------- | ------------------------------------------------------------ | --------------------------------- |
| switchTableSize       | 切换表格的 size                                              | `({key: size}) => void`           |
| switchTableFullScreen | 切换全屏状态                                                 | `() => void`                      |
| reloadTable           | 表格重新加载方法, 在开启分页情况下，withFirstPage 为 true，则强制表格回到第一页 | `(withFirstPage:boolean) => void` |
| loadData              | 表格数据加载方法                                             | `() => void`                      |
| toggleSearchCollapsed | 展开/关闭 搜索条件                                           | `() => void`                      |
| resetSearchForm       | 清空搜索条件                                                 | `() => void`                      |



## 插槽

除了属性中自定义的`tableAlertRender`, `tableAlertOptionRender` 等几个动态 name 的 slot 外，ProTable 还固定了一下几种 slot:

### Slot

| 名称           | 描述                       |
| -------------- | -------------------------- |
| toolbar-title  | 表格工具列中标题区域       |
| toolbar-action | 表格工具列中的操作区域     |
| extend-box     | 在搜索和表格之间的扩展区域 |

### ScopedSlot

| 名称        | 描述         | scope           |
| ----------- | ------------ | --------------- |
| search-form | 搜索表单区域 | searchFormState |

**SearchFormState**

| 属性                  | 描述                                               | 类型       |
| --------------------- | -------------------------------------------------- | ---------- |
| loading               | 表格的加载状态，一般用于同步控制查询按钮的 loading | `boolean`  |
| reloadTable           | 表格的刷新方法                                     | `function` |
| queryParam            | 搜索表单区域数据的双向绑定对象                     | `object`   |
| collapsed             | 搜索表单区域的的折叠情况                           | `boolean`  |
| resetSearchForm       | 清空 queryParam 的方法                             | `function` |
| toggleSearchCollapsed | 切换表单折叠的方法                                 | `function` |





## 常见问题

### 如何传递额外的查询条件

表格需要额外传参时，可以将 axios 方法包装一层，在调用前使用 Object.assign 进行参数合并

```js
tableRequest: (requestParam) => {
    return getPage(Object.assign({}, requestParam, { yourParam: 'test' }))
},
```

### 如何在外部调用表格方法或者属性

先使用 ref 持有 ProTable 的引用

```vue
<pro-table ref="table"></pro-table>
```

在利用 ref 调用组件提供的方法

```js
 this.$refs.table.reloadTable(withFirstPage)
```

获取表格的一些状态属性同理，比如一个按钮的 loading 状态需要和表格同步，可以通过表格的 localLoading 参数进行同步

```vue
<a-button :loading="$refs.table ? $refs.table.localLoading : false">
```

### 如何让操作按钮展示在左侧

默认操作按钮是居右显示的，如果不想显示表格 toolbar 的标题，想让操作区域在左侧，那么只需要将操作按钮放到 `toolbar-title` 的 slot 中即可。

```vue
<pro-table>
    <!-- 操作按钮区域 -->
    <template #toolbar-title>
		<a-button type="primary" >新建</a-button>
    </template>
</pro-table>
```
