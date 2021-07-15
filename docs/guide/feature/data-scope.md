# 数据权限



## 简介

数据权限可细分分为垂直权限和水平权限。

以下表为例：

| user_id | name | class | gender |
| ------- | ---- | ----- | ------ |
| 1       | 小明 | 一班  | 男     |
| 2       | 小王 | 二班  | 男     |
| 3       | 小方 | 一班  | 女     |
| 4       | 小红 | 二班  | 女     |

- 垂直权限按列划分权限范围

  例如用户 A 只能看到 name 和 class 两个字段，而用户 B 可以看到所有字段

- 水平权限按行划分权限范围

  例如用户 A 只能看到 user_id 为 1 和 2 这两行数据，而用户 B 可以看到所有

`ballcat-spring-boot-starter-datascope` 提供了水平数据权限处理的能力。



## 核心概念

### 数据即资源

- **数据是一种资源，数据权限，就是保证每个人只能访问自己所拥有的资源。**

- **同一个数据资源按照不同的资源维度归类**

比如示例表中的小明，按班级分，他归属于一班，按性别分，他属于男性。

所以要实现数据权限，首先要明确资源维度，其次要明确每个人在当前资源唯独下拥有的资源列表。



### 数据范围

Ballcat 抽象出了一个`DateScope` 接口，用来表示某个资源维度下需要控制的数据库表，以及控制方式。

```java
public interface DataScope {

	/**
	 * 数据所对应的资源
	 * @return 资源标识
	 */
	String getResource();

	/**
	 * 该资源相关的所有表，推荐使用 Set 类型。 <br/>
	 * 如需忽略表名大小写判断，则可以使用 TreeSet，并设置忽略大小写的自定义Comparator。 <br/>
	 * eg. new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
	 * @return tableNames
	 */
	Collection<String> getTableNames();

	/**
	 * 根据表名和表别名，动态生成的 where/or 筛选条件
	 * @param tableName 表名
	 * @param tableAlias 表别名，可能为空
	 * @return 数据规则表达式
	 */
	Expression getExpression(String tableName, Alias tableAlias);

}
```

- `getResource()`

  用于返回资源维度标识，如按班级维护划分数据资源，则可以返回标识 “class”，按性别维度划分，则可返回 “gender”

- `getTableNames()`

  返回在该资源维度下设计到的表名集合，只会对此集合中的表进行数据权限控制

- `getExpression()`

  返回数据权限的控制表达式。

  如用户 A 只能看到一班的数据，则在 sql 中，应该追加 where 条件 `class = '一班'`

  方法返回类型 `Expression` 就是 jsqlparser 工具类对这些 SQL 表达式的抽象表示。



这里其实是屏蔽了 getExpression 的细节的，因为实际项目开发中，数据会以何种资源维度划分，每个人拥有的资源列表怎么获取是不尽相同，所以这些交给项目的使用者自己去实现。



## 实现示例

我们以班级维度的数据权限控制为示例：

### 1. 定义自己的用户资源类

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomUserResources extends DefaultUserResources {
	/**
	* 班级列表
	*/
	private List<String> classList;
    
}
```

### 2. 定义并注册自己的资源协调者

```java
@Component
public class CustomUserInfoCoordinator extends UserInfoCoordinator {

	@Override
	public UserResources coordinateResource(SysUser user, Set<String> roles, Set<String> permissions) {
		// 用户资源，角色和权限
		CustomUserResources userResources = new CustomUserResources();
		userResources.setRoles(roles);
		userResources.setPermissions(permissions);

		// 这里仅仅是示例，实际使用时一定是根据当前用户名去查询出其所拥有的资源列表
		if("A".equals(user.getUsername())) {
			userResources.setClassList(Collections.singletonList("一班"));
		}else {
			userResources.setClassList(Arrays.asList("一班","二班"));
		}
		
		return userResources;
	}
}
```

资源协调者必须注册进 spring 容器中，`coordinateResource()` 方法将在用户登录时进行执行

### 3. 定义自己的 DataScope 类

```java
public class UserDataScope implements DataScope {
	// 列名
	private static final String CLASS = "class";

	@Override
	public String getResource() {
		return CLASS;
	}

	@Override
	public Collection<String> getTableNames() {
		Set<String> tableNames = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
		tableNames.addAll(Collections.singletonList("tbl_student"));
		return tableNames;
	}

	@Override
	public Expression getExpression(String tableName, Alias tableAlias) {
		// 获取当前登录用户
		SysUserDetails userDetails = SecurityUtils.getSysUserDetails();
		if (userDetails == null) {
			return null;
		}
		// 获取用户拥有的班级列表
		UserResources userResources = userDetails.getUserResources();
		List<Expression> list = ((CustomUserResources)userResources).getClassList().stream()
				.map(x -> new StringValue(String.valueOf(x)))
				.collect(Collectors.toList());

		// 列对象
		Column column = new Column(tableAlias == null ? CLASS : tableAlias.getName() + "." + CLASS);
		// 数据权限规则，where class in ("一班"，"二班")
		ExpressionList expressionList = new ExpressionList();
		expressionList.setExpressions(list);
		return new InExpression(column, expressionList);
	}
}
```

### 4. 定义并注册自己的 DataPermissionHandler 类

```java
public class CustomDataPermissionHandler extends AbstractDataPermissionHandler {

	public CustomDataPermissionHandler(List<DataScope> dataScopes) {
		super(dataScopes);
	}

	@Override
	public boolean ignorePermissionControl(String mappedStatementId) {
		return false;
	}

}
```

### 5. 注册 DatePermissionInterceptor

```java
@Configuration(proxyBeanMethods = false)
public class DataScopeConfiguration {

	@Bean
	public DataPermissionInterceptor dataPermissionInterceptor() {
		CustomDataScope customDataScope = new CustomDataScope();
		List<DataScope> list = new ArrayList<>();
		list.add(customDataScope);
		CustomDataPermissionHandler dataPermissionHandler = new CustomDataPermissionHandler(list);
		return new DataPermissionInterceptor(new DataScopeSqlProcessor(), dataPermissionHandler);
	}
}
```



**以上 5 步中，1、2 两步主要是为了方便获取用户资源列表，非必选。用户只要能在 DataScope 中正确的返回 Expression 即可，不拘泥于实现形式。**



## 扩展控制

### 1. 全局的数据权限忽略

**DataPermissionHandler#ignorePermissionControl**

该方法每次操作数据库之前都会执行，用户可在这里实现对特定用户或特定方法进行权限控制的跳过处理

### 2. @DataPermission 注解控制

@DataPermission 注解可标记在 Mapper 层的类或者方法上，用于动态控制数据权限

```java
public @interface DataPermission {

	/**
	 * 当前类或方法是否忽略数据权限
	 * @return boolean 默认返回 false
	 */
	boolean ignore() default false;

	/**
	 * 仅对指定资源类型进行数据权限控制，只在开启情况下有效，当该数组有值时，exclude不生效
	 * @see DataPermission#excludeResources
	 * @return 资源类型数组
	 */
	String[] includeResources() default {};

	/**
	 * 对指定资源类型跳过数据权限控制，只在开启情况下有效，当该includeResources有值时，exclude不生效
	 * @see DataPermission#includeResources
	 * @return 资源类型数组
	 */
	String[] excludeResources() default {};
}
```

例如：

```java
// 该方法忽略数据权限控制
@DataPermission(ignore = true)
List<SysUser> listIgnoreDataPermission;

// 该方法查询时只做性别类型的数据权限控制
@DataPermission(includeResources = "gender")
List<SysUser> list1;
  
// 该方法查询时排除性别类型的数据权限控制
@DataPermission(excludeResources = "gender")
List<SysUser> list2;
```



### 3. 组织(部门)数据资源

虽然数据权限控制各项目不尽相同，但是大多数项目还是会根据组织(部门)来划分，Ballcat 也为此留了扩展空间：

在角色表中预留了一个字段 `scope_type`，表示数据资源范围，1全部，2本人，3本人及子部门，4本部门。

用户可以在 资源协调者中根据用户拥有的角色，以及用户所在的组织信息，合并出用户真实拥有的资源列表。
