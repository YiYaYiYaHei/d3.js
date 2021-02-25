let widthP = 0.9,
    heightP = 0.85,
    leftBottomTipsCircleR = 16,
    leftBottomImageSize = {  // 左下角图注头像尺寸
      pWidth: leftBottomTipsCircleR, // pattern 宽
      pHeight: leftBottomTipsCircleR, // pattern 高
      iWidth: leftBottomTipsCircleR * 2,  // image 宽
      iHeight: leftBottomTipsCircleR * 2  // image 高
    };

// 自执行函数--引入其他js文件   https://www.jb51.net/article/195401.htm
(function(){
  document.write("<script language=javascript src='./js/d3.v5.min.js'></script>");
})()

// 获取svg宽高
function getSVGSize() {
  return {
    width: document.documentElement.clientWidth * widthP,
    height: document.documentElement.clientHeight * heightP
  }
}
// 重新设置svg宽高
function resetSvgSize(svg, width, height) {
  svg.attr('width', width)
     .attr('height', height);
}

// 对象转数组
function objTransArray(obj) {
  let list = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      list.push({
        name: key,
        value: obj[key]
      })
    }
  }
  return list;
}

// 设置图形中心点
function setSimulationCenter(simulation, width, height) {
  simulation.force('center')
            .x(width / 2)
            .y(height / 2);
}

// 绘制箭头
function drawArrow(svg, id, color) {
  svg.append('defs')    // <defs>元素通常为SVG图像保留一组可重复使用的定义，类似<components>
      .attr('class', `arrow_${id}`)
      .append('marker')
      .attr('id', id)  // 供marker-end="url(#end-arrow)"使用
      .attr('viewBox', '0 -5 10 10')   // 坐标系区域:x y width height
      .attr('refX', 26)  // 默认0，坐标设置标记内的点用作参考点
      .attr('refY', 0)   // 默认0，坐标设置标记内的点用作参考点
      .attr('markerWidth', 6)  //箭头宽
      .attr('markerHeight', 6) //箭头高
      .attr('orient', 'auto')  // 绘制方向，可设定为：auto（自动确认方向）和 角度值
      .append('path')   // 可为其他标签，若绘制圆可为circle
      .attr('d', 'M0,-5L10,0L0,5')   //绘制三角形
      .attr('fill', color)
}

// 重新绘制力导向图
function simulationRestart(simulation, value = 1) {
  simulation.alpha(value).restart();   // restart()：重新绘制；alpha(1)：值越大，图表稳定越快。[0, 1]默认0
}

// 插入defs
function appendDefs(svg, cls) {
  let defs = svg.selectAll(`defs.${cls}`);
  if (!!defs._groups && !defs._groups[0].length) {
    defs = svg.append('defs')
              .attr('class', cls);
  }
  return defs;
}

// 绘制图片节点
function drawImage(defs, id, size, href) {
  defs.append('pattern')   // pattern：以平铺方式填充，可以直接把图片变成圆（此处绘制的是circle）--https://www.nhooo.com/svg/svg-pattern.html
      .attr('id', id)  // 供fill="url(#image_${i})"使用
      .attr('width', size.pWidth)
      .attr('height', size.pHeight)
      .append('image')
      .attr('x', 0)
      .attr('y', 0)
      .attr("xlink:href", href)
      .attr("width", size.iWidth) 
      .attr("height", size.iHeight);
}

/* =========================================左下角图注开始============================================== */
// 绘制左下角图注（废弃--由于zoom事件，不能固定在左下角，因此使用了原生dom）
function drawLeftBottomTips(svg, leftBottomTipsList) {
  let LBTipsG = svg.append('g')
                   .attr('class', 'left-bottom-tips-group');
  let defs = appendDefs(svg, 'left-bottom-tips-image');
  
  // 生成左下角图注-图片
  let LBCircle = LBTipsG.selectAll('circle.left-bottom-tips-circle')
                        .data(leftBottomTipsList)
                        .enter()
                        .append('circle')
                        .attr('class', d => `left-bottom-tips-circle left-bottom-tips-circle-${d.name}`)
                        .attr('stroke', '#000')
                        .attr('r', leftBottomTipsCircleR)
                        .attr('cx', 20)
                        .attr('cy', (d, i) => getSVGSize().height - 40 * (leftBottomTipsList.length - i))
                        .attr('fill', (d, i) => {
                          drawImage(defs, `left-bottom-tips-image-${i}`, leftBottomImageSize, leftBottomTipsList[i].value);
                          return `url(#left-bottom-tips-image-${i})` 
                        });
  
  // 生成左下角图注-文本
  let LBTexts = LBTipsG.selectAll('text.left-bottom-tips-text')
                      .data(leftBottomTipsList)
                      .enter()
                      .append('text')
                      .attr('class', 'left-bottom-tips-text')
                      .attr('r', leftBottomTipsCircleR)
                      .attr('x', 50)
                      .attr('y', (d, i) => getSVGSize().height - 40 * (leftBottomTipsList.length - i) + 4)
                      .text(d => d.name);
                        
  LBTexts.on('mouseover', function(d, i) {
            d3.select(this)
              .transition()
              .style('font-size', '16px')
              .style('font-weight', '600')
              .attr('fill', 'rgb(42, 202, 202)');
            d3.select(`circle.left-bottom-tips-circle-${d.name}`)
              .transition()
              .attr('stroke', 'rgb(42, 202, 202)') 
         });

  LBTexts.on('mouseout', function(d, i) {
            let flag = d3.select(this).attr('data-tips-status') === 'grey'
            d3.select(this)
              .transition()
              .style('font-size', '14px')
              .style('font-weight', 'normal')
              .attr('fill', flag ? '#ccc' : '#000');
            d3.select(`circle.left-bottom-tips-circle-${d.name}`)
              .transition()
              .attr('stroke', flag ? '#ccc' : '#000');
       });
  return { 
    LBTexts,
    LBCircle
  }
}
/* =========================================左下角图注结束============================================== */

/* =========================================tooltips开始============================================== */
let tooltipsDOM = document.getElementById('tooltips');
// 设置tooltips属性
function setTooltipsPos(cls) {
  tooltipsDOM.setAttribute('class', cls);
  tooltipsDOM.style.left = `${d3.event.clientX + 20}px`;
  tooltipsDOM.style.top = `${d3.event.clientY + 20}px`;
}      
// tooltips--鼠标滑上
function nodesClickEVT(d, i) {
  if (tooltipsDOM) {
    if (d.level !== 0) {
      console.log(d)
      setTooltipsPos(tooltipsDOM.getAttribute('class') === 'show' ? 'hide' : 'show');  // 设置tooltips的位置
      let text = `<div class="family-name">${d.family}</div>
      <div>
        <span class="node-label">姓名：</span>
        <span class="node-value ellipsis">${d.name}</span>
      </div>
      <div>
        <span class="node-label">妻子/丈夫姓名：</span>
        <span class="node-value ellipsis">${d.relation ? d.relation : '暂无'}</span>
      </div>
      <div>
          <span class="node-label">妻子/丈夫母族：</span>
          <span class="node-value ellipsis">${d.relationFamily ? d.relationFamily : '暂无'}</span>
        </div>`;
      tooltips.innerHTML = text;
    }
  }
}
/* =========================================tooltips结束============================================== */


/* =========================================高亮显示开始============================================== */
// 重新设置isFocus值
function resetDataIsFocus(nodesData, linksData, flag) {
  nodesData.map(item => item.isFocus = flag);
  linksData.map(item => item.isFocus = flag);
}

// 递归处理数据--通过isFocus=true判断是否“聚焦”(true高亮，false置灰)，修改线、节点、文本的样式即可
function setDataIsFocus(nodesData, linksData, name) {
  linksData.map(item => {
    if (item.family === name) item.isFocus = true;
  }) 
  nodesData.map(item => {
    if (item.belongToFamily === name) item.isFocus = true;
  })
}
/* =========================================高亮显示结束============================================== */