TypeScript Webpack5 React Tree Shaking Demo
=======================================

按照另一个 `typescript-webpack5-tree-shaking-demo`的做法，为了让typescript能将代码以module方式编译，我们需要做很多设置，
而这些设置会让我们使用时（如webpack, cli）等带来很多麻烦

所以在这个demo里，使用`@type/preset-typescript`可以忽略tsconfig.json，仅仅把type annotation去掉，所以不需要对tsconfig.json进行特殊设置。

另外，在这个demo里尝试了：
1. 以commonjs格式导入react
2. 使用core-js进行polyfill
3. src中代码使用ESM模式以方便tree shaking

结果是可行的

```
npm install
npm run demo
```

然后

```
cat ./dist/bundle.js
```

内容如下：

```
(() => {
    "use strict";
    function util1() {
        return "util1";
    }
    const utilStr = util1();
    console.log(utilStr);
})();
```

看起来`util2`的确是被去掉了。
