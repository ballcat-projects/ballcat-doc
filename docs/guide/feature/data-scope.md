# 数据权限

目前文档内容对标 ballcat v1.1.0 以上版本

## 简介

为了数据安全与企业组织分工，有时会需要划分每个用户可见的数据范围，例如：

- 普通的销售人员只能看到自己的数据

- 地区的销售经理能看到当前地区的所有数据
- 销售总监可以看到所有的销售数据

如果这些规则使用硬编码的方式进行处理，开发和维护成本极高。

而 Ballat 提供的数据权限组件**只需进行少量的规则代码配置，即可实现数据权限控制**。



## 使用方式

### 依赖引入

- 组件已经推送到中央仓库，直接引入即可使用：

```xml
<dependency>
  <groupId>com.hccake</groupId>
  <artifactId>ballcat-spring-boot-starter-datascope</artifactId>
  <version>${lastedVersion}</version>
</dependency>
```



### 数据规则定制

在使用数据权限之前，首先要定义自己项目的数据权限规则，在 Ballcat 中，数据权限规则对应的抽象表示为 `DataScope`。

```java
public interface DataScope {

	/**
	 * 数据所对应的资源
	 * @return 资源标识
	 */
	String getResource();

	/**
	 * 判断当前数据权限范围是否需要管理此表
	 * @param tableName 当前需要处理的表名
	 * @return 如果当前数据权限范围包含当前表名，则返回 true，否则返回 false
	 */
	boolean includes(String tableName);

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

  用于标识控制的数据资源，如按部门维护划分数据资源，则可以返回标识 “dept”，按班级维度划分，则可返回 “class”，这个标识会在部分需要进行数据权限忽略的场景使用

- `includes(tableName)`

  根据传入的表名，判断是否需要进行数据权限控制，判断逻辑用户可以完全自定义，例如通过前缀匹配、正则匹配、全等判断等。

- `getExpression(tableName, tableAlias)`

  返回数据权限的控制表达式，如用户 A 只能看到研发部的数据，则在 sql 中，应该追加 where 条件 `dept = '研发部'`。

  方法返回类型 `Expression` 是 **jsqlparser** 工具对这个 Where 条件的 SQL 的抽象表示，返回 null 时则不拼接。

  

**用户需要编写自己的 `DataScope`**，并注册到 Spring 容器中，**可以同时注册多个 `DataScope` 实例**，以实现多个维度的数据权限规则。



## 使用示例

**无法打开 github 的小伙伴可以去 gitee 镜像库上查看代码示例。**

::: tip 示例源码

本节的示例代码，可以在 [ballcat-spring-boot-starter-datascope](https://github.com/ballcat-projects/ballcat) 模块的单元测试用例中查看。

:::

::: tip 更多示例

在 [ballcat-sample-admin](https://github.com/ballcat-projects/ballcat-samples) 模块下有一个基于部门的完整数据权限使用示例

:::

### 示例背景

#### 数据结构

假设系统中只有一张学生表需要做数据权限控制，学生表的数据如下：

| id   | name | class_name |
| ---- | ---- | ---------- |
| 1    | 张三 | 一班       |
| 2    | 李四 | 一班       |
| 3    | 王五 | 二班       |
| 4    | 老六 | 三班       |

#### 数据权限规则

在本示例中，有如下两个维度的数据权限规则：

1. 针对于班级维度的数据资源：老师可以看到他所带的班级的所有数据，根据班级 class_name 划分
2. 针对于学生维度的数据资源：学生只能看到他自己的数据，根据 id 划分

比如：

- 对于只教授一班的老师 B，他登录系统后可以看到张三和李四的数据信息

- 对于同时教授二班和三班的老师 A，他登录系统后可以看到王五和老六的数据信息

- 对于学生王五，登录后只能看到王五本人的数据信息

#### 登录用户

对于登录用户的数据信息抽象为一个 `LoginUser` 对象，在用户登录后将 `LoginUser` 的信息存储到 `LoginUserHolder` 中

```java
@Data
public class LoginUser {

	/**
	 * 登录用户 id
	 */
	private Integer id;

	/**
	 * 用户角色: 老师或者学生
	 */
	private UserRoleType userRoleType;

	/**
	 * 当前登录用户所拥有的班级，只有老师才有此属性
	 */
	private List<String> classNameList;

}
```



### DataScope 编写

针对两种数据维度的权限规则，**我们只需要对应编写两个 `DataScope`**，并注册到 spring 容器中，即完成了数据权限的控制处理。

#### 班级维度

```java
public class ClassDataScope implements DataScope {

	private final Set<String> tableNames = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

	public ClassDataScope() {
		tableNames.addAll(Arrays.asList("h2student", "h2teacher"));
	}

	@Override
	public String getResource() {
		return "class";
	}

	@Override
	public boolean includes(String tableName) {
		// 使用 new TreeSet<>(String.CASE_INSENSITIVE_ORDER) 的形式判断，可忽略表名大小写
		return tableNames.contains(tableName);
	}

	@Override
	public Expression getExpression(String tableName, Alias tableAlias) {
        // 假设登录用户信息可以从内存中获取
		LoginUser loginUser = LoginUserHolder.get();

		// 如果当前登录用户为空，或者是老师，但是没有任何班级权限
		if (loginUser == null || (UserRoleType.TEACHER.equals(loginUser.getUserRoleType())
				&& CollectionUtils.isEmpty(loginUser.getClassNameList()))) {
			// where 1 = 2 永不满足
			return new EqualsTo(new LongValue(1), new LongValue(2));
		}

		// 如果是学生，则不控制，因为学生的权限会在 StudentDataScope 中处理
		if (UserRoleType.STUDENT.equals(loginUser.getUserRoleType())) {
			return null;
		}

		
		// 提取当前登录用户拥有的班级权限
        List<Expression> list = loginUser.getClassNameList().stream().map(StringValue::new)
            .collect(Collectors.toList());
        ExpressionList expressionList = new ExpressionList();
		expressionList.setExpressions(list);
        // 列名
        Column column = new Column(tableAlias == null ? "class_name" : tableAlias.getName() + "." + "class_name");
        // 条件：class_name in (xxx, xxx)
		return new InExpression(column, expressionList);
	}

}
```

#### 学生维度

```java
public class StudentDataScope implements DataScope {

	public static final String RESOURCE_NAME = "student";
	
	private static final Pattern TABLE_NAME_PATTEN = Pattern.compile("^h2student*$");

	@Override
	public String getResource() {
		return RESOURCE_NAME;
	}

	@Override
	public boolean includes(String tableName) {
		// 可以利用正则做匹配
		Matcher matcher = TABLE_NAME_PATTEN.matcher(tableName);
		return matcher.matches();
	}

	@Override
	public Expression getExpression(String tableName, Alias tableAlias) {
		LoginUser loginUser = LoginUserHolder.get();

		// 如果当前登录用户为空
		if (loginUser == null) {
			// where 1 = 2 永不满足
			return new EqualsTo(new LongValue(1), new LongValue(2));
		}

		// 如果是老师则直接放行
		if (UserRoleType.TEACHER.equals(loginUser.getUserRoleType())) {
			return null;
		}

		// 学生只能查到他自己的数据 where id = xx
		Column column = new Column(tableAlias == null ? "id" : tableAlias.getName() + "." + "id");
		return new EqualsTo(column, new LongValue(loginUser.getId()));
	}

}

```



### 权限测试

我们在 `StudentService` 中提供一个 `listStudent()` 方法，对应的查询 SQL 为 `select * from h2student`。

在不同用户登录后调用同一个方法，会根据他们的角色以及拥有的班级返回不同的数据。

#### 老师用户查询

```java
void testStudentSelect1() {
    // 用户登录
    LoginUser loginUser = new LoginUser();
    loginUser.setId(10);
    loginUser.setUserRoleType(UserRoleType.TEACHER); // 教师
    loginUser.setClassNameList(Collections.singletonList("一班"));
    LoginUserHolder.set(loginUser);

    // 一班有两个学生：张三和李四
    List<Student> studentList1 = studentService.listStudent();
    Assertions.assertEquals(2, studentList1.size());
    Assertions.assertEquals("张三", studentList1.get(0).getName());
    Assertions.assertEquals("李四", studentList1.get(1).getName());

    // 切换登录用户所管理的班级
    loginUser.setClassNameList(Collections.singletonList("二班"));
    
    // 二班只有一个学生：王五
    List<Student> studentList2 = studentService.listStudent();
    Assertions.assertEquals(1, studentList2.size());
    Assertions.assertEquals("王五", studentList2.get(0).getName());
}
```

#### 学生用户查询

```java
void testStudentSelect2() {
    // 用户登录
    LoginUser loginUser = new LoginUser();
    loginUser.setId(1);
    loginUser.setUserRoleType(UserRoleType.STUDENT); // 学生
    LoginUserHolder.set(loginUser);

    // id 为 1 的学生叫 张三
    List<Student> studentList1 = studentService.listStudent();
    Assertions.assertEquals(1, studentList1.size());
    Assertions.assertEquals("张三", studentList1.get(0).getName());

    // 切换登录用户
    loginUser.setId(2);
    
    // id 为 2 的学生叫 李四
    List<Student> studentList2 = studentService.listStudent();
    Assertions.assertEquals(1, studentList2.size());
    Assertions.assertEquals("李四", studentList2.get(0).getName());
}
```







## 局部规则修改

**默认注册的 `DataScope` 会对全局的所有 SQL 进行拦截处理。**

> 对于不涉及到权限的表的 SQL，在第一次执行后将会被记录下来，后续直接跳过 SQL 处理，提升性能

而在这些使用场景下，我们需要进行局部的数据权限规则修改，例如：

- 某些方法需要忽略数据权限控制
- 配置了多个 `DataScope`，只想其中的某个规则生效
- 配置了多个 `DataScope`，需要忽略其中的某个规则

### 声明式规则修改

`@DataPermission` 注解可标记在类或者方法上，用于动态控制数据权限

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



#### **基本使用**

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



#### **注解的查找规则**

方法执行时，会按以下顺序依次查找可用的 `@DataPermission` 注解：

​	**当前方法上的注解** => **超类方法上的注解** => **当前类上注解** => **超类上的注解**

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

#### 局部规则的传递

当执行方法上根据注解的查找规则，没有查询到注解时，则会使用调用者的数据权限规则：

```java
class A {

    @DataPermission(includeResources = {"gender"})
    test1(){
        B.method1(); // 该方法上有自己的 @DataPermission 注解，只会对 class 资源进行控制
        B.method2(); // 该方法则跟随 test() 方法的数据权限注解，只对 gender 资源进行控制
    };
    
    test2(){
        B.method1(); // 依然只会对 class 资源进行控制
        B.method2(); // 跟随全局的数据权限规则
    };

}

class B {
    @DataPermission(includeResources = {"class"})
    method1(){};
    
    method2(){};
}

```



### 编程式规则修改

从版本 **v0.7.0** 开始，`DataPermissionHandler` 提供了编程式的局部数据权限修改功能。

#### 基本使用

和 `@DataPermission` 注解的属性对应，我们需要构建一个 `DataPermissionRule` 对象来标识当前的数据权限规则：

```java
// 数据权限规则：忽略全部数据权限
DataPermissionRule dataPermissionRule = new DataPermissionRule(true);
// 或者
DataPermissionRule dataPermissionRule = new DataPermissionRule().setIgnore(true); 
```

```java
// 数据权限规则：只根据班级维度查询
DataPermissionRule dataPermissionRule = new DataPermissionRule()
        .setIncludeResources(new String[] { "class" });
```

```java
// 数据权限规则：不根据班级维度查询
DataPermissionRule dataPermissionRule = new DataPermissionRule()
        .setExcludeResources(new String[] { "class" });
```

在指定的规则下进行操作

```java
// 在指定数据权限规则下进行查询
List<Student> studentList = null;
DataPermissionUtils.executeWithDataPermissionRule(dataPermissionRule,
				() -> studentList = studentService.listStudent());
```

#### 嵌套使用

```java
// 编程式数据权限，
DataPermissionRule dataPermissionRule = new DataPermissionRule()
        .setIncludeResources(new String[] { "class" });
DataPermissionUtils.executeWithDataPermissionRule(dataPermissionRule, () -> {
    // 编程式数据权限内部方法，根据 class 维度进行数据权限控制
    List<Student> studentList = studentService.listStudent();

    // 嵌套的权限控制: 内部忽略数据权限控制
    DataPermissionRule innerIgnoreRule = new DataPermissionRule(true);
    DataPermissionUtils.executeWithDataPermissionRule(innerRule, () -> {
        // 规则嵌套时，优先使用内部规则, 会忽略数据权限查询出全部学生
        List<Student> allStudent = studentService.listStudent();
    });
});
```



### 声明式和编程式的混合使用

混合使用时，权限规则按照由近及远的顺序查找：

**方法内部的编程式规则** > **当前方法查找出来的注解规则** > **调用者的权限规则** > **全局规则**

```java
public class StudentService {

	public List<Student> listStudent() {}

    // 忽略权限控制
	@DataPermission(ignore = true)
	public List<Student> listStudentWithoutDataPermission() {}
    
}
```

```java
@DataPermission(includeResources = {"gender"})
void testStudentSelect() {
    
    // 根据方法上的 @DataPermission 注解，只根据 gender 维度进行数据权限控制
    List<Student> studentList1 = studentService.listStudent();
    
    // 编程式数据权限规则
    DataPermissionRule dataPermissionRule = new DataPermissionRule()
            .setIncludeResources(new String[] { "class" });
    DataPermissionUtils.executeWithDataPermissionRule(dataPermissionRule, () -> {
        // 编程式数据权限内部方法，根据 class 维度进行数据权限控制
        List<Student> studentList2 = studentService.listStudent();

        // 由于 listStudentWithoutDataPermission 添加了 @DataPermission 注解
        // 会忽略权限控制，查询出所有的学生
        List<Student> allStudent = studentService.listStudentWithoutDataPermission();
    });
}


```

