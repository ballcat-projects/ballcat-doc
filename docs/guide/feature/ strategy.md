# 策略模式工具

## 简介
> 策略模式是一种行为设计模式， 它能让你定义一系列算法， 并将每种算法分别放入独立的类中， 以使算法的对象能够相互替换。

## 示例
传统代码使用策略模式时的实现方式，伪代码
> 示例代码来自：[《深入设计模式》](https://refactoringguru.cn/design-patterns/strategy)
```java
// 策略接口声明了某个算法各个不同版本间所共有的操作。上下文会使用该接口来
// 调用有具体策略定义的算法。
interface Strategy is
    method execute(a, b)

// 具体策略会在遵循策略基础接口的情况下实现算法。该接口实现了它们在上下文
// 中的互换性。
class ConcreteStrategyAdd implements Strategy is
    method execute(a, b) is
        return a + b

class ConcreteStrategySubtract implements Strategy is
    method execute(a, b) is
        return a - b

class ConcreteStrategyMultiply implements Strategy is
    method execute(a, b) is
        return a * b

// 上下文定义了客户端关注的接口。
class Context is
    // 上下文会维护指向某个策略对象的引用。上下文不知晓策略的具体类。上下
    // 文必须通过策略接口来与所有策略进行交互。
    private strategy: Strategy

    // 上下文通常会通过构造函数来接收策略对象，同时还提供设置器以便在运行
    // 时切换策略。
    method setStrategy(Strategy strategy) is
        this.strategy = strategy

    // 上下文会将一些工作委派给策略对象，而不是自行实现不同版本的算法。
    method executeStrategy(int a, int b) is
        return strategy.execute(a, b)


// 客户端代码会选择具体策略并将其传递给上下文。客户端必须知晓策略之间的差
// 异，才能做出正确的选择。
class ExampleApplication is
    method main() is
        
        // 1.创建上下文对象。
        // 2.读取第一个数。
        // 3.读取最后一个数。
        // 4.从用户输入中读取期望进行的行为。

        if (action == addition) then
            context.setStrategy(new ConcreteStrategyAdd())

        if (action == subtraction) then
            context.setStrategy(new ConcreteStrategySubtract())

        if (action == multiplication) then
            context.setStrategy(new ConcreteStrategyMultiply())

        result = context.executeStrategy(First number, Second number)

        // 打印结果。
```
## 策略工具类的使用

现在，你可以使用`org.ballcat.common.core.strategy.StrategyInterface`该注解来标记一个接口为策略接口

```java
@StrategyInterface
public interface Strategy {
    Number execute(int a, int b);
}
```

接着来实现这个策略接口, 并用`org.ballcat.common.core.strategy.StrategyComponent`标记为策略`Bean`
```java
@StrategyComponent("ADD")
public class ConcreteStrategyAdd implements Strategy {
	@Override
	public Number execute(int a, int b) {
		return a + b;
	}
}

@StrategyComponent("SUBTRACT")
public class ConcreteStrategySubtract implements Strategy {
    @Override
    public Number execute(int a, int b) {
        return a - b;
    }
}

@StrategyComponent("MULTIPLY")
public class ConcreteStrategyMultiply implements Strategy {
    @Override
    public Number execute(int a, int b) {
        return a * b;
    }
}
```

最后通过策略工厂`org.ballcat.common.core.strategy.StrategyFactory`来获取对应的策略

```java
public class StrategyTest {

    @Test
    void test() {
        Strategy addStrategy = StrategyFactory.getNonNullStrategy(Strategy.class, "ADD");
        System.out.println(addStrategy.execute(1, 2));

        Strategy subtractStrategy = StrategyFactory.getNonNullStrategy(Strategy.class, "SUBTRACT");
        System.out.println(subtractStrategy.execute(1, 2));

        Strategy multiplyStrategy = StrategyFactory.getNonNullStrategy(Strategy.class, "MULTIPLY");
        System.out.println(multiplyStrategy.execute(1, 2));
    }
}
```
