/* 生成的是水平方向的树形图: x->d.y   y->d.x
若要生成垂直方向的树形图--getLinkHorizontal方法的x、y值要反过来，其他的节点(node、text)的x、y值也要反过来: x->d.x   y->d.y */
let widthP = 1,
  heightP = 0.85;

let rectW = 100, // 矩形宽
  rectH = 50, // 矩形高
  rectBW = 200, // “红楼梦任务关系图”矩形宽
  rectBH = 100, // “红楼梦任务关系图”矩形高
  initScale = 0.5, // 设置初始缩放比例
  translateX = getSVGSize().width * 0.5; // 设置g.container的x位置

let svg = d3.select('body').append('svg'),
  hierarchyData = null, // 层级布局
  tree = null, // 树形图
  treeData = null,
  nodesData = null,
  nodesDataOrigin = null,
  linksData = null,
  texts = null,
  nodes = null,
  links = null,
  g = svg.append('g').attr('class', 'container').attr('id', 'gContainer'),
  linksG = g.append('g').attr('class', 'links-group'), // linksG、nodesG、textsG三个有顺序要求，线>节点>文字（文字被覆盖是绘制的顺序问题）
  nodesG = g.append('g').attr('class', 'nodes-group'),
  textsG = g.append('g').attr('class', 'texts-group'),
  textForeignObject = null,
  globalTransform = null; // 全局记录树状图缩放值

// 缩略图相关数据
let thumbW = 400,
    thumbH = 200,
    thumbSvg = null,
    thumbG = null,
    scaleX = getSVGSize().width / thumbW,   // 缩略图与主视图的平移比列
    scaleY = getSVGSize().height / thumbH;  // 缩略图与主视图的平移比列
    thumbLinksG = null,
    thumbNodesG = null,
    thumbTextsG = null,
    thumbTexts = null,
    thumbNodes = null,
    thumbLinks = null;

// 自执行函数--引入其他js文件   https://www.jb51.net/article/195401.htm
(function () {
  document.write("<script language=javascript src='./js/d3.v5.min.js'></script>");
})()

// 初始化
function initTree(type) {
  // 重新设置svg宽高
  setSvgSize(svg);

  // 设置初始缩放比列
  // g.attr("transform", `translate(${translateX - 100}, 100) scale(${initScale})`);

  //创建一个层级布局--带有depth、data、height、parent、children等属性
  hierarchyData = d3.hierarchy(NODES_ORIGIN)
                    .sum(function (d, i) {
                      return d.level;
                    });

  // 创建树状图--nodeSize和size不能一起使用
  tree = d3.tree()
  if (type !== 'center') {
    // nodeSize可以设置兄弟、父子节点间的间隔
    tree.nodeSize([140, 160]) // [width, height]：width值越大，兄弟节点之间离的越近；height值越大，父节点与子节点之间离的越远
  } else {
    // 树状图居中展示--但是无法设置兄弟节点间的间隔(separation返回固定值不生效)
    /* tree.size([getSVGSize().width, getSVGSize().height])
        .separation(function (a,b) {
          return a.parent == b.parent ? 1 : 2;  // 设置相邻两个叶子节点的距离
        }) */

    // 使用nodeSize+separation+g初始偏移，一定程度上可以实现树状图在可视区域内水平居中
    tree.nodeSize([1, 160])
        .separation(function (a,b) {
          return 200;  // 设置相邻两个叶子节点的距离; 200实际为矩形框的宽度
        });
    // 设置g偏移--居中展示(x-svg宽度一半，y-固定值)
    setTimeout(() => {
      g.attr('transform', `translate(${getSVGSize().width / 2}, ${100}) scale(${initScale})`);
    });
  }


  // 生成树状图数据--带有depth、data、height、parent、children等属性
  treeData = tree(hierarchyData);  // tree(hierarchyData)的tree跟tree = d3.tree()一致
  console.log("treeData: ", treeData);

  // 生成nodes、links
  makeTreeData();

  // 绘制树
  drawTree();

  // 绘制缩略图
  if (type === 'thumb') drawThumb();

  // svg绑定zoom事件
  svgBindZoom(svg, initScale);
}

function makeTreeData(type) {
  //获取边和节点数据--带有depth、data、height、parent、children等属性

  /* 从当前节点开始返回其后代节点数组
   *  treeData.descendants()等同v3版本的tree.nodes()
   *  reverse():删除没有children的节点
   */
  nodesData = treeData.descendants().reverse();
  if (type !== 'remove') {
    nodesData.map(it => it._children = it.children); // _children是children的副本,记录展开时的数据(只在初始化时调用)
    nodesDataOrigin = [].concat(nodesData); // 供一键展开使用(点击"收起"后,此时nodesData的长度减少了)
  }

  linksData = treeData.links(nodesData); // 返回当前节点所在子树的所有边
  console.log("边和节点: ", nodesData, linksData);
}

// 绘制
function drawTree(type) {
  if (type === 'remove') removeTree();

  links = drawLinks(linksG); // 绘制线
  nodes = drawNodes(nodesG); // 绘制矩形节点
  texts = drawTexts(textsG); // 绘制文本
}

function removeTree() {
  if (!!links) links.remove();
  if (!!nodes) nodes.remove();
  if (!!texts) texts.remove();
}

// 获取svg宽高
function getSVGSize() {
  return {
    width: document.documentElement.clientWidth * widthP,
    height: document.documentElement.clientHeight * heightP
  }
}
// 重新设置svg宽高
function setSvgSize(svg) {
  svg.attr('width', getSVGSize().width)
     .attr('height', getSVGSize().height);
}

// svg绑定zoom事件
function svgBindZoom(svg, initScale) {
  let zoom = d3.zoom()
               .scaleExtent([0.1, 10]) // 放大倍数scaleExtent([最小倍数, 最大倍数])
               .on('zoom', zoomed);

  zoom.scaleTo(svg, initScale); // 设置初始缩放比例--缩放正确应用于svg元素,但是当你调用zoom.scaleTo(svg,2)时,你正在缩放组元素,而不是svg元素.

  function zoomed() {
    globalTransform = d3.event.transform;
    g.attr("transform", globalTransform);
    thumbG && thumbG.attr( "transform", `translate(${globalTransform.x / scaleX}, ${globalTransform.y / scaleY}) scale(0.1)`);
  }

  svg.call(zoom) // 把zoom放到整个svg上，而不是特定的元素上，才能保证在整个图形元素区域都起作用
     .on("dblclick.zoom", null); // 去除双击放大事件

}

// 绘制线--绘制直线
function drawLinks(linksG) {
  return linksG.selectAll('path.path')
              .data(linksData)
              .exit()
              .remove()
              .data(linksData)
              .enter()
              .append('line')
              .attr('class', 'path')
              .attr('x1', d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y)
              .attr("stroke", "black")
              .attr("stroke-width", "2px");
}

// 绘制矩形节点
function drawNodes(nodesG) {
  return nodesG.selectAll('rect.rect')
               .data(nodesData)
               .exit()
               .remove()
               .data(nodesData)
               .enter()
               .append('rect')
               .attr('class', d => d.data.name === '红楼梦任务关系图' ? 'rect big-rect' : 'rect')
               .attr('fill', d => d.data.name === '红楼梦任务关系图' ? 'rgb(204, 204, 204, 0.5)' : d.data.relationFamily ? d.data.relationColor : d.data.color)
               .attr('width', d => d.data.name === '红楼梦任务关系图' ? rectBW : rectW)
               .attr('height', d => d.data.name === '红楼梦任务关系图' ? rectBH : rectH)
               .attr('x', d => d.data.name === '红楼梦任务关系图' ? d.x - rectBW + 100 : d.x - rectW / 2)
               .attr('y', d => d.data.name === '红楼梦任务关系图' ? d.y - rectBH : d.y - rectH / 2)
               .attr("transform", function (d) {
                 // return "translate(" + d.y + "," + d.x + ")";
               })
}

// 绘制文本
function drawTexts(textsG) {
  // 使用text无法换行，所以使用foreignObject --https://blog.csdn.net/weixin_40126227/article/details/107041406
  /* texts = textsG.selectAll('text.text')
                .data(nodesData)
                .enter()
                .append('text')
                .attr('class', 'text')
                .attr('x', d => d.y)
                .attr('y', d => d.x)
                .attr('style', 'dominant-baseline: middle; text-anchor: middle;')   // 文本居中对齐
                .text(d => d.data.name) */
  textForeignObject = textsG.selectAll('foreignObject.text')
                            .data(nodesData)
                            .exit()
                            .remove()
                            .data(nodesData)
                            .enter()
                            .append('foreignObject')
                            .attr('class', d => d.data.name === '红楼梦任务关系图' ? 'text big-text' : 'text')
                            .attr('width', d => d.data.name === '红楼梦任务关系图' ? rectBW : rectW)
                            .attr('height', d => d.data.name === '红楼梦任务关系图' ? rectBH : rectH)
                            .attr('x', d => d.data.name === '红楼梦任务关系图' ? d.x - rectBW / 2 : d.x - rectW / 2)
                            .attr('y', d => d.data.name === '红楼梦任务关系图' ? d.y - rectBH : d.y - rectH / 2)
  return textForeignObject.append('xhtml:span')
                          .attr('class', 'node-text')
                          .attr('title', d => d.data.relation ? `${d.data.name} & ${d.data.relation}` : d.data.name)
                          .text(d => d.data.relation ? `${d.data.name} & ${d.data.relation}` : d.data.name)

}


function restartHierarchyData(data) {
  //创建一个层级布局--带有depth、data、height、parent、children等属性
  // https://www.jianshu.com/p/772db5d0597c
  hierarchyData = d3.hierarchy(data)
                    .sum(function (d, i) {
                      return d.level;
                    });

  // 生成树状图数据--带有depth、data、height、parent、children等属性
  treeData = tree(hierarchyData);
}

// 绘制缩略图
function drawThumb() {
  // 删除/新增 主视图数据后，更新缩略图
  d3.select("#thumbSvg").remove(); // 性能不好  这个列子比较吊:https://gitee.com/hnmas/d3-graph-with-thumbnail

  thumbSvg = d3.select("body")
               .append("svg")
               .attr("width", thumbW)
               .attr("height", thumbH)
               .attr('style', 'position: absolute; right: 0px; bottom: 0px;background:#fff')
               .attr("id", "thumbSvg");

  thumbG = thumbSvg.append("g")
                   .attr("id", "thumbGroup");

  thumbBindZoom();

  thumbLinksG = thumbG.append('g').attr('class', 'thumb-links-group'); // linksG、nodesG、textsG三个有顺序要求，线>节点>文字（文字被覆盖是绘制的顺序问题）
  thumbNodesG = thumbG.append('g').attr('class', 'thumb-nodes-group');
  thumbTextsG = thumbG.append('g').attr('class', 'thumb-texts-group');

  thumbLinks = drawLinks(thumbLinksG); // 绘制线
  thumbNodes = drawNodes(thumbNodesG); // 绘制矩形节点
  thumbTexts = drawTexts(thumbTextsG); // 绘制文本
}

// 缩略图绑定平移事件
function thumbBindZoom() {
  let zoom = d3.zoom()
               .scaleExtent([0.1, 10])   // 放大倍数scaleExtent([最小倍数, 最大倍数])
               .on('zoom', zoomed);

  zoom.scaleTo(thumbSvg, 0.1);  // 设置初始缩放比例--缩放正确应用于svg元素,但是当你调用zoom.scaleTo(svg,2)时,你正在缩放组元素,而不是svg元素.

  function zoomed() {
    let transform = d3.event.transform;
    thumbG.attr( "transform", transform);
    g.attr( "transform", `translate(${transform.x * scaleX}, ${transform.y * scaleY}) scale(${globalTransform ? globalTransform.k : initScale})`);
  }

  thumbSvg.call(zoom)   // 把zoom放到整个svg上，而不是特定的元素上，才能保证在整个图形元素区域都起作用
          .on("dblclick.zoom", null)   // 去除双击放大事件
          .on('wheel.zoom', null)      // 去除缩放滚轮事件
}