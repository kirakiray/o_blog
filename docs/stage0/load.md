## `load`的入门教程

当引入 **ofa.js** 文件成功后，会在全局变量内添加一个 `load` 方法

`load`方法是 **模块加载器** ，作用跟ES6的 `import` 和 nodejs的 `require` 相似。但使用 **load** 方法返回的是 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 对象，当操作成功后，会从then内返回当前模块的内容。

```html
<script>
    load("https://ofajs.com/fntui/fnt-button/fnt-button.js").then(() => {
        console.log("fnt-button 加载完成!");
    });
</script>
```

搭配async function 使用，效果更佳； 

```html
<script>
    (async () => {
        await load("https://ofajs.com/fntui/fnt-button/fnt-button.js");

        console.log("fnt-button 加载完成!");
    })();
</script>
```

当加载的文件和目录同名时，可以在目录前添加 `-p` 参数，就能省略文件名;

```javascript
 // await load("https://ofajs.com/fntui/fnt-button/fnt-button.js");
await load("https://ofajs.com/fntui/fnt-button -p");
```

后续的添加脚本请使用 `load` 方法；不要再使用 `script` 标签添加脚本；

load模块化系统还有很多内容，在stage0范围内不是必学内容，你可选择自行学习。