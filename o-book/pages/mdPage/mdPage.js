Page(async (load) => {
    // md解析器
    await load("./marked.min.js", "./highlight.min.js");

    const pubData = await load("../../data");

    return {
        async ready() {
            // 还原loading
            this.attrs.oLoading = 1;

            let { url } = this.params;

            // 请求并转换数据
            let mdData = await load(url);
            let mdText = marked(mdData);

            // 修正图片资源
            {
                let rootDir = url.replace(/(.+\/).+/, "$1");
                mdText = mdText.replace(/<img.*?>/g, (imgEleStr) => {
                    let newstr = imgEleStr.replace(/src=['"](.+?)['"]/, (srcStr, matchStr) => {
                        if (/^.+:/.test(matchStr)) {
                            return srcStr;
                        } else {
                            return srcStr.replace(matchStr, rootDir + matchStr);
                        }
                    });

                    return newstr;
                });
            }

            // 查找下一篇文章的地址
            let inItem = false;
            let nextItem;
            pubData.summary.links.some(e => {
                if (e.type == "item") {
                    if (e.path == url) {
                        inItem = true;
                    } else if (inItem) {
                        nextItem = e;
                        return true;
                    }
                }
            });

            if (nextItem && nextItem.path) {
                // 存在下一节的，设置下一页按钮
                mdText += `\n\n<a href="${nextItem.path}">⏭️ ${nextItem.name}</a>`;
            }

            this.$article.html = mdText;

            // 对lang内容进行高亮
            this.$article.all('code').forEach(e => {
                let block = e.ele;
                if (block.getAttribute("class")) {
                    hljs.highlightBlock(block);
                } else {
                    Object.assign(block.style, {
                        color: "#24292e",
                        backgroundColor: "#f6f8fa"
                    });
                }
            });

            // 修正a标签跳转路径（md文档）
            this.$article.all("a").forEach(aEle => {
                let href = aEle.attrs.href;
                if (/\.md$/.test(href)) {
                    aEle.on("click", e => {
                        // 禁止默认跳转行为
                        e.preventDefault();

                        this.navigate({
                            src: `@obook/pages/mdPage/mdPage?url=${href}`
                        });
                    });
                } else {
                    // 如果是链接，就新标签打开
                    aEle.attrs.target = "_blank";
                }
            });

            this.attrs.oLoading = null;
        }
    };
});