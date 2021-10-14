# 数据权限

目前文档内容对标 ballcat v0.4.0 以上版本



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



## 使用介绍

在示例项目  [ballcat-samples](https://github.com/ballcat-projects/ballcat-samples) 中，提供了一个基于组织机构的维度的数据权限实现供大家参考，这里简单的用一个班级维度的数据权限 demo 描述下实现过程。

### 1. 获取用户的数据权限

想要做到数据权限控制，首先要知道用户拥有哪些权限，比如小明可以看到一班和二班两个班的数据，那么这个 ["一班"，“二班”] 的数据权限范围，我们肯定要有一个方法可以通过当前登录用户小明获取到。

例如：我们在用户登录时，将用户的权限放入用户信息中，那么用户下次请求的时候，我们可以根据 token 直接获取到其对应的数据权限了。

**如果是基于 Ballcat 的授权服务器搭建的后台管理系统**，可以自定义资源协调者 **UserInfoCoordinator**，资源协调者将在用户登陆时被调用，将用户的的资源信息存放到 User 中，在 DataScope 里即可以通过 `User user = SecurityUtils.getUser()` 来获取到 user 对象，并从中取出对应的资源信息。

```java
@Component
public class CustomUserInfoCoordinator extends UserInfoCoordinator {

    // 默认的 attribute 参数中，有角色和权限的数据，用户可以这些数据对用户资源进行动态组装
	@Override
	public Map<String, Object> coordinateAttribute(SysUser sysUser, Map<String, Object> attribute) {
		// 用户资源，角色和权限
		List<String> classList;
		// 这里仅仅是示例，实际使用时一定是根据当前用户名去查询出其所拥有的资源列表
		if ("A".equals(sysUser.getUsername())) {
			classList = Collections.singletonList("一班");
		}
		else {
			classList = Arrays.asList("一班", "二班");
		}
		attribute.put("classList", classList);

		return attribute;
	}

}
```

> 资源协调者必须注册进 spring 容器中，`coordinateResource()` 方法将在用户登录时进行执行

**当然，这里不是唯一的解决方案，非 ballcat 项目，可以按照自己项目的逻辑，将用户数据权限存储在别的地方，只要在需要获取时可以方便拿到即可**



**组织(部门)数据资源**

虽然数据权限控制各项目不尽相同，但是大多数项目还是会根据组织(部门)来划分，Ballcat 也为此留了扩展空间：

在角色表中预留了一个字段 `scope_type`，表示数据资源范围，用户可以自定义该字段的值含义，

如：0全部，1本人，2本人及子部门，3本部门，4本部门及子部门，5自定义 等数据权限范围。

用户可以在 资源协调者中根据用户拥有的角色，以及用户所在的组织信息，合并出用户真实拥有的资源列表，合并方法可以参看示例项目中的 `SampleDataScopeProcessor` 类。



### 2. 定义自己的 DataScope

从 0.3.0 开始，ballcat 提供了默认的自动配置，现在只需定义自己的 DataScope 类，并将其注册进 spring 容器中即可实现数据权限控制。

我们以班级维度的数据权限控制为示例，自定义一个 `CustomDataScope` 类。

- **getResource()**  标识了当前 DataScope 处理的资源类型为 **class**
- **getTableNames()** 标识了对涉及到表名为 "tbl_student" 的所有 SQL 进行权限控制。

- **getExpression()** 标识了数据权限的拼接条件 SQL 为 `where class in (xxx)`，”xxx“ 即是当前用户拥有的班级列表，这里从当前登录用户的信息中获取，可以自由根据业务实现。

> getExpression 方法，每次执行数据库操作前都会执行，当其返回 null 值时，则不进行数据权限控制。对于一些拥有全部权限的角色可以跳过拼接，提升执行效率

```java
@Component
public class CustomDataScope implements DataScope {

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
		User user = SecurityUtils.getUser();
		if (user == null) {
			return null;
		}
		// 获取用户拥有的班级列表
		Map<String, Object> attributes = user.getAttributes();
		@SuppressWarnings("unchecked")
		List<String> classList = (List<String>) attributes.get("classList");
		List<Expression> list = classList.stream().map(x -> new StringValue(String.valueOf(x)))
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



### 3. 数据权限 SQL 拦截修改

这里是通过 mybatis 的拦截器实现的，项目已经完成自动配置，用户仅需了解原理即可。

在用户执行 sql 时，会通过解析 Jsqlparse 解析 sql，获取该 sql 应用到的表名，并根据表名获取到用户提供的 DataScope，执行 `DataScope#getExpression` 方法获取到控制条件，然后将条件注入到原 sql 中。



## 扩展控制

### 1. 全局的数据权限忽略

**DataPermissionHandler#ignorePermissionControl**

该方法每次操作数据库之前都会执行，用户可在这里实现对特定用户或特定方法进行权限控制的跳过处理，默认注册的实现类为 `DefaultDataPermissionHandler`.

在每次执行 sql 解析后，若此次 sql 对应的 DataScope 皆未匹配，则会将当前 sql 对应的 mappedStatementId，与这些 DataScope 做一个关联记录，

在下次执行 sql 时，**DefaultDataPermissionHandler** 会判断当前的 mappedStatementId，是否对于所有的 DataScope 都存在一个忽略的关联记录，如果是，则会跳过后续的 sql 解析，以提升性能。

```java
@RequiredArgsConstructor
public class DefaultDataPermissionHandler implements DataPermissionHandler {

    // 省略若干代码
    
	/**
	 * <p>
	 * 是否忽略权限控制
	 * </p>
	 * 若当前的 mappedStatementId 存在于 <Code>MappedStatementIdsWithoutDataScope<Code/>
	 * 中，则表示无需处理
	 * @param dataScopeList 当前需要控制的 dataScope 集合
	 * @param mappedStatementId Mapper方法ID
	 * @return always false
	 */
	@Override
	public boolean ignorePermissionControl(List<DataScope> dataScopeList, String mappedStatementId) {
		return MappedStatementIdsWithoutDataScope.onAllWithoutSet(dataScopeList, mappedStatementId);
	}

}
```



用户可以继承此类 DefaultDataPermissionHandler（需注册到 spring 容器中），重写该方法实现自己的忽略逻辑，做到根据用户动态控制某些方法的跳过数据权限，或者根据 mappedStatementId 的规则，直接对某些包下的方法进行忽略处理。



### 2. @DataPermission 注解控制

@DataPermission 注解可标记在类或者方法上，用于动态控制数据权限

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

**@DataPermission 基本使用**

```java
// 该方法忽略数据权限控制
@DataPermission(ignore = true)
List<SysUser> listIgnoreDataPermission();

// 该方法执行时只会根据资源标识为 gender 和 class 的 DataScope 进行数据权限处理
@DataPermission(includeResources = {"gender", "class"})
List<SysUser> list1();
  
// 该方法执行时排除资源标识为 class 的 DataScope，不对其进行数据权限处理，其他 DataScope 不受影响
@DataPermission(excludeResources = "class")
List<SysUser> list2();
```

**@DataPermission 的规则**

方法的 @DataPermission 确认顺序为：当前方法上的注解 => 没有则查询超类方法上的注解 => 当前类上注解 => 超类上的注解

```java
@DataPermission(includeResources = {"gender", "class"})
class A {
    
    test(){
        method1(); // 该方法只对 class 资源进行控制
        method2(); // 该方法只对 gender 资源进行控制
        method3(); // 该方法忽略所有的数据权限控制
        method4(); // 该方法只对 gender 和 class 进行数据权限控制
    }
    
    @DataPermission(includeResources = {"class"})
    method1(){}
    
    @DataPermission(includeResources = {"gender"})
    method2(){}
    
    @DataPermission(ignore = true)
    method3(){}
    
    method4(){}
    
}
```



**@DataPermission 的嵌套使用**

当 @DataPermission 的方法嵌套调用时，每个方法会优先使用它自己的 @DataPermission 注解信息作为权限控制的依据，如果自己没有，则根据其调用者的 @DataPermission 环境进行数据权限控制

```java
@DataPermission(includeResources = {"gender", "class"})
class A {

    @DataPermission(includeResources = {"gender"})
    test(){
        B.method1(); // 该方法上有自己的 @DataPermission 注解，只会对 class 资源进行控制
        B.method2(); // 该方法则跟随 test() 方法的数据权限注解，只对 gender 资源进行控制
    };

}

class B {
    @DataPermission(includeResources = {"class"})
    method1(){};
    
    method2(){};
}

```
