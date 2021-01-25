import * as d3 from "d3";

var svg, forceSimulation, linksData, links, nodesData, nodes, texts;

/* 获取容器宽高 */
function getContainerSize(clsName) {
    let dom = document.querySelector(clsName);
    return {
        width: dom.getBoundingClientRect().width,
        height: dom.getBoundingClientRect().height
    }
}

/* 初始化力导向图 */
function initForceSimulation(data) {
    let containerSize = getContainerSize('.d3-page-container');
    svg = d3.select("svg")
            .attr("width", containerSize.width)
            .attr("height", containerSize.height)
            .call(d3.zoom()
                    .scaleExtent([1, 10])   // 设置缩放范围
                    .on("zoom", () => {
                        /* 缩放和平移操作 */
                        svg.attr("transform", d3.event.transform)
                    })
            );

    let obj = getData(data, [], []) || {linkData: [], nodeData: []};
    nodesData = obj.nodeData;
    linksData = getLinksData(obj.linkData);
                   
    /* 创建力导向图 */
    forceSimulation = d3.forceSimulation()
                      .force("link", d3.forceLink())
                      .force("charge", d3.forceManyBody())
                      .force('collision', d3.forceCollide(18))
                      .force("center", d3.forceCenter());
    /* 创建节点数据 */
    forceSimulation.nodes(nodesData)
                   .on("tick", ticked);
    /* 创建边数据 */
    forceSimulation.force("link")
                   .links(linksData)
                   .distance((d) => {
                       return 60;
                   })
    /* 设置图形中心位置 */
    forceSimulation.force("center")
                   .x(containerSize.width / 2)
                   .y(containerSize.height / 2);

    /* 边 */
    links = svg.append("g")
             .attr("class", "links")
             .selectAll("line")
             .data(linksData)
             .enter()
             .append("line")
             .attr("stroke", (d, i) => {
                 return d.color;
             })
             .attr("stroke-width", 1);
    /* 文本 */
    texts = svg.append("g")
             .attr("class", "texts")
             .selectAll("text")
             .data(linksData)
             .enter()
             .append("text")
             .attr("font-size", 14)
             /* .text((d) => {
                 return d.name
             }) */
    /* 对节点和节点上的文字分组 */
    nodes = svg.selectAll('.circleText')
             .data(nodesData)
             .enter()
             .append("g")
             /* .attr("transform", (d, i) => {
                 return `translate(${d.x}, ${d.y})`
             }) */
             .call(d3.drag()
                    .on("start", started)
                    .on("drag", draged)
                    .on("end", ended)
            )
    /* 绘制节点 */
    nodes.append("circle")
         .attr("r", 10)
         .attr("fill", (d, i) => {
             return d.color;
         })
    /* 文字 */
    nodes.append("text")
         .attr("x", -10)
         .attr("y", -20)
         .attr("dy", 10)
         .attr("font-size", 14)
         .text((d) => {
             return d.name
         })    
}

/* 获取节点+线数据 */
function getData(nodes, linkData, nodeData) {
    let length = nodes.length;
    for (let i = 0; i < length; i++) {
        let item = nodes[i];
        nodeData.push(item);
        if (isHasChildren(item)) {
            let obj = getRelationLink(item, [], []) || {linkData: [], nodeData: []};
            linkData = linkData.concat(obj.linkData);
            nodeData = nodeData.concat(obj.nodeData);
        }
    }
    return {
        linkData,
        nodeData
    }
}

/* 判断是否有子孙节点 */
function isHasChildren(node) {
    return !!node && node.children && !!node.children.length
}

/* 递归获取关系线+节点（一维数组） */
function getRelationLink(node, linkData, nodeData) {
    let length = node.children.length;
    for (let i = 0; i < length; i++) {
        let item = node.children[i];
        nodeData.push(item);
        linkData.push(Object.assign({
            sourceName: node.name,
            targetName: item.name,
        }, item));
        if (isHasChildren(item)) {
            getRelationLink(item, linkData, nodeData)
        }
    }
    return {
        linkData,
        nodeData
    }
}

/* 设置连接线的source、target（source、target默认为节点数据的下表，也可以是整个节点数据） */
function getLinksData(data) {
    let list = [];
    for (let item of data) {
        let _sIndex = nodesData.findIndex(it => it.name === item.sourceName),
            _tIndex = nodesData.findIndex(it => it.name === item.targetName);
        list.push(Object.assign({
            source: _sIndex,
            target: _tIndex
        }, item))
    }
    return list;
}

function ticked() {
    links.attr("x1", (d) => {
        return d.source.x;
    }).attr("y1", (d) => {
        return d.source.y;
    }).attr("x2", (d) => {
        return d.target.x;
    }).attr("y2", (d) => {
        return d.target.x;
    })

    texts.attr("x", (d) => {
        return (d.source.x + d.target.x) / 2;
    }).attr("y", (d) => {
        return (d.source.y + d.target.y) / 2;
    })

    nodes.attr("transform", (d) => {
        console.log(d)
        return `translate(${d.x}, ${d.y})`
    })
    /* nodes.attr('cx', d => {
        console.log(d)
        return d.x;
    })
    .attr('cy', d => d.y); */
}

function started(d) {
    if (!d3.event.active) {
        forceSimulation.alphaTarget(0.8).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
}

function draged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function ended(d) {
    if (!d3.event.active) {
        forceSimulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
}
export {
    initForceSimulation 
}