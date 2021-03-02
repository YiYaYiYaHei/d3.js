let widthP = 0.9,
    heightP = 0.85;

let rectW = 100,  // 矩形宽
    rectH = 50,   // 矩形高
    rectBW = 200,  // “红楼梦任务关系图”矩形宽
    rectBH = 100,  // “红楼梦任务关系图”矩形高
    initScale = 0.5,  // 设置初始缩放比例
    translateX = getSVGSize().width * 0.2;  // 设置g.container的x位置

let svg = d3.select('body').append('svg'),
    hierarchyData = null,  // 层级布局
    tree = null,   // 树形图
    treeData = null,
    nodesData = null,
    nodesDataOrigin = null,
    linksData = null,
    linkHorizontal = null,  // 创建贝塞尔曲线生成器
    texts = null,
    nodes = null,
    links = null,
    g = svg.append('g').attr('class', 'container'),
    linksG = g.append('g').attr('class', 'links-group'),  // linksG、nodesG、textsG三个有顺序要求，线>节点>文字（文字被覆盖是绘制的顺序问题）
    nodesG = g.append('g').attr('class', 'nodes-group'),
    textsG = g.append('g').attr('class', 'texts-group');

// 自执行函数--引入其他js文件   https://www.jb51.net/article/195401.htm
(function(){
  document.write("<script language=javascript src='./js/d3.v5.min.js'></script>");
})()

// 初始化
function initTree() {
  // 重新设置svg宽高
  setSvgSize(svg);

  // svg绑定zoom事件
  svgBindZoom(svg, initScale);
  
  // 设置初始缩放比列
  g.attr("transform", `translate(${translateX}, ${getSVGSize().height / 2}) scale(${initScale})`);

  //创建一个层级布局--带有depth、data、height、parent、children等属性
  hierarchyData = d3.hierarchy(NODES_ORIGIN)
                    .sum(function (d,i) {
                        return d.level;
                    });
  
  // 创建树状图--nodeSize和size不要一起使用
  tree = d3.tree()
           .nodeSize([70, 160])  // [width, height]：width值越大，兄弟节点之间离的越近；height值越大，父节点与子节点之间离的越远
           /* .size([getSVGSize().width-400, getSVGSize().height-200])
           .separation(function (a,b) {
              console.log((a.parent == b.parent ? 1 : 2) / a.depth)
              return (a.parent == b.parent ? 1 : 2) / a.depth;  // 设置相邻两个叶子节点的距离
            }) */
           
  
  // 生成树状图数据--带有depth、data、height、parent、children等属性
  treeData = tree(hierarchyData);
  console.log("treeData: ", treeData);
  
  // 生成nodes、links
  makeTreeData();
    
  //创建贝塞尔曲线生成器
  linkHorizontal = getLinkHorizontal();
  
  // 绘制树
  drawTree();
}

function makeTreeData(type) {
  //获取边和节点数据--带有depth、data、height、parent、children等属性

  /* 从当前节点开始返回其后代节点数组
  *  treeData.descendants()等同v3版本的tree.nodes() 
  *  reverse():删除没有children的节点
  */
  nodesData = treeData.descendants().reverse();   
  if (type !== 'remove') {
    nodesData.map(it => it._children = it.children);  // _children是children的副本,记录展开时的数据(只在初始化时调用)
    nodesDataOrigin = [].concat(nodesData);  // 供一键展开使用(点击"收起"后,此时nodesData的长度减少了)
  }

  linksData = treeData.links(nodesData);   // 返回当前节点所在子树的所有边
  console.log("边和节点: ", nodesData, linksData);
}

// 绘制
function drawTree(type) {
  if (type === 'remove') removeTree();
  
  links = drawLinks();  // 绘制线
  nodes = drawNodes();  // 绘制矩形节点
  texts = drawTexts();  // 绘制文本
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
               .scaleExtent([0.5, 10])   // 放大倍数scaleExtent([最小倍数, 最大倍数])
               .on('zoom', zoomed);

  zoom.scaleTo(svg, initScale);  // 设置初始缩放比例--缩放正确应用于svg元素,但是当你调用zoom.scaleTo(svg,2)时,你正在缩放组元素,而不是svg元素.
  
  function zoomed() {
      let transform = d3.event.transform;
      g.attr( "transform", transform);
  }

  svg.call(zoom)   // 把zoom放到整个svg上，而不是特定的元素上，才能保证在整个图形元素区域都起作用
     .on("dblclick.zoom", null);   // 去除双击放大事件

}

//创建贝塞尔曲线生成器
function getLinkHorizontal() {
  return d3.linkHorizontal()
           .x(function(d) { return d.y; }) // 生成的曲线在曲线的终点和起点处的切线是水平方向的
           .y(function(d) { return d.x; });
}

// 绘制线--贝塞尔曲线生成器
function drawLinks() {
  return  linksG.selectAll('path.path')
                .data(linksData)
                .exit()
                .remove()
                .data(linksData)
                .enter()
                .append('path')
                .attr('class', 'path')
                .attr('d', (d, i) => {
                  var start = {x: d.source.x, y: d.source.y};
                  var end = {x: d.target.x, y: d.target.y};
                  return linkHorizontal({source: start, target: end});
                })
                .attr('stroke','pink')
                .attr('stroke-width',1)
                .attr('fill','none');
}

// 绘制矩形节点
function drawNodes() {
  return  nodesG.selectAll('rect.rect')
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
                .attr('x', d => d.data.name === '红楼梦任务关系图' ? d.y - rectBW : d.y - rectW / 2)
                .attr('y', d => d.data.name === '红楼梦任务关系图' ? d.x - rectBH / 2 : d.x - rectH / 2)
}

// 绘制文本
function drawTexts() {
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
  return  textsG.selectAll('foreignObject.text')
                .data(nodesData)
                .exit()
                .remove()
                .data(nodesData)
                .enter()
                .append('foreignObject')
                .attr('class', d => d.data.name === '红楼梦任务关系图' ? 'text big-text' : 'text')
                .attr('width', d => d.data.name === '红楼梦任务关系图' ? rectBW : rectW)
                .attr('height', d => d.data.name === '红楼梦任务关系图' ? rectBH : rectH)
                .attr('x', d => d.data.name === '红楼梦任务关系图' ? d.y - rectBW : d.y - rectW / 2)
                .attr('y', d => d.data.name === '红楼梦任务关系图' ? d.x - rectBH / 2 : d.x - rectH / 2)
                .append('xhtml:span')
                .attr('class', 'node-text')
                .text(d => d.data.relation ? `${d.data.name} & ${d.data.relation}` : d.data.name)
                
}