# Ant Desgin Pro V5 动态路由
> 主要步骤如下

### 1. 使用自定义Layout
> [参考示例](https://github.com/ballcat-projects/ballcat-ui-react/blob/main/src/layouts/BasicLayout.tsx)
>
> 主要是用来重写路由的. 主要代码如下
```typescript
...

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
    const {
    children,
    location = {
      pathname: '/',
    },
    route,
  } = props;
    // 自定义 model 从服务端加载数据
    // 可以使用其他方式实现, 效果一样就可以了
      const { routeArray, firstPath, load, setLoad } = useModel('dynamic-route');
    
    // 加载动态的路由数据
  useEffect(() => {
      // 已加载路由则不在重载
    if (load) {
      return;
    }
    const newRoute: ExpandRoute = { ...route };
    newRoute.routes = [];
    newRoute.children = [];

      // 路由处理
    if (routeArray && routeArray.length > 0) {
      for (let i = 0; i < routeArray.length; i += 1) {
        const menu = routeArray[i];
        newRoute.children.push(menu);
        newRoute.routes.push(menu);
      }

      route.routes = newRoute.routes;
      route.children = newRoute.routes;
      setLoad(true);

        // 初次加载页面非根页面处理
      if (location.pathname && location.pathname !== '/') {
        history.replace(location.pathname);
      }
    }
  }, [routeArray, load]);

    // 首页处理
  if (location.pathname === '/' && firstPath && firstPath !== '/') {
    history.push(firstPath);
  }

  return (
    <ProLayout
	...
      // 写入动态路由
      route={route}
     ...
    </ProLayout>
  );
};

export default BasicLayout;
```



### 2. 从服务端加载数据

> 实现方式很多, [示例使用 model 实现](https://github.com/ballcat-projects/ballcat-ui-react/blob/main/src/models/dynamic-route.ts)

```typescript
import { useCallback, useState, useEffect } from 'react';
import { useModel, dynamic } from 'umi';
import type { ExpandRoute } from '@/utils/RouteUtils';
import { getRoute } from '@/utils/RouteUtils';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';
import I18n from '@/utils/I18nUtils';

const getFirstUrl = (menuArray: ExpandRoute[]): string | undefined => {
  for (let index = 0; index < menuArray.length; index += 1) {
    const menu = menuArray[index];
    // 菜单未隐藏
    if (!menu.hideInMenu) {
      // 如果存在子级 且子级的第一个菜单存在路径
      if (menu.children && menu.children.length > 0 && menu.children[0].path) {
        const url = getFirstUrl(menu.children);
        // 存在首页
        if (url) {
          return url;
        }
      }
      // 不存在, 且当前菜单是页面
      else if (menu.exact) {
        return menu.path;
      }
    }
  }

  return undefined;
};

export default () => {
  const { initialState } = useModel('@@initialState');
  const [routeArray, setMenuArray] = useState<ExpandRoute[]>([]);
  const [firstPath, setMenuFirst] = useState<string>();
  const [load, setLoad] = useState<boolean>(false);

    // 刷新路由
  const refresh = useCallback(async () => {
    return getRoute()
      .then((resMenuArray) => {
        const newMenuArray: ExpandRoute[] = [];
        newMenuArray.push(...resMenuArray);
        // 路由末尾插入 404 页面, 用来处理未知路由的渲染
        newMenuArray.push({
          component: dynamic({
            loader: () => import('@/pages/exception/404'),
            loading: LoadingComponent,
          }),
        });
        setMenuArray(newMenuArray);
        setMenuFirst(getFirstUrl(newMenuArray));
        setLoad(false);
      })
      .catch(() => {
        I18n.error('menu.load.failed');
      });
  }, []);

    // 刷新路由
  useEffect(() => {
      // 在更新有效用户时触发
    if (initialState?.user?.access_token) {
      refresh();
    }
  }, [initialState, refresh]);

  return { routeArray, firstPath, refresh, load, setLoad };
};
```

