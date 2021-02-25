/**
 * 这块偷懒了，没有先处理成一维数组，直接使用的多维数组导致后面有各种坑
 * name: 家族/姓名
 * level：树层级（0-*）
 * color：节点颜色  贾-#67C23A; 史：#F56C6C; 王：#2acaca; 薛: #f69e6e
 * family：家族名称
 * isShow：是否显示
 * children：子孙节点
 * relation：妻子/丈夫姓名
 * relationColor：妻子/丈夫的节点颜色
 * relationFamily：妻子/丈夫所在的家族名称
 * isFocus: 是否高亮显示
 * belongToFamily: 所属家族名称
 */
const NODES = [
    {name: '贾府', level: 0, family: '贾', color: '#67C23A', isShow: true, children: [
        {name: '贾演', level: 1, color: '#67C23A', family: '贾', children: [
            {name: '贾代化（宁国府）', level: 2, color: '#67C23A', family: '贾', children: [
                {name: '贾敬', level: 3, color: '#67C23A', family: '贾', children: [
                    {name: '贾珍', level: 4, color: '#67C23A', family: '贾', children: [
                        {name: '贾惜春', level: 5, color: '#67C23A', family: '贾'},
                        {name: '贾荣', level: 5, relation: '秦可卿', color: '#67C23A', family: '贾'}
                    ]}
                ]}
            ]}
        ]},
        {name: '贾源', level: 1, color: '#67C23A', children: [
            {name: '贾代善（荣国府）', level: 2, color: '#67C23A', family: '贾', relationColor: '#F56C6C', relation: '贾母', relationFamily: '史侯', children: [
                {name: '贾赦', level: 3, relation: '邢夫人', color: '#67C23A', family: '贾', children: [
                    {name: '贾琏', level: 4, family: '贾', relation: '王熙凤', relationFamily: '王熙凤父母', color: '#67C23A', relationColor: '#2acaca', children: [
                        {name: '贾巧姐', level: 5, family: '贾', color: '#67C23A'}
                    ]},
                    {name: '贾迎春', level: 4, relation: '孙绍祖', color: '#67C23A', family: '贾'}
                ]},
                {name: '贾政', level: 3, relation: '王夫人', family: '贾', color: '#67C23A', relationFamily: '王夫人之父', relationColor: '#2acaca', children: [
                    {name: '贾珠', level: 4, family: '贾', relation: '李纨', color: '#67C23A', children: [
                        {name: '贾兰', level: 5, family: '贾', color: '#67C23A'}
                    ]},
                    {name: '贾元春', level: 4, color: '#67C23A', family: '贾'},
                    {name: '贾宝玉', level: 4, color: '#67C23A', family: '贾', relation: '薛宝钗', relationFamily: '薛蟠之父', relationColor: '#f69e6e'},
                    {name: '贾探春', level: 4, color: '#67C23A', family: '贾'},
                    {name: '贾环', level: 4, color: '#67C23A', family: '贾'}
                ]},
                {name: '贾敏', level: 3, family: '贾', relation: '林如海', color: '#67C23A', children: [
                    {name: '林黛玉', level: 4, color: '#67C23A', family: '贾'}
                ]}
            ]}
        ]}
    ]},
    {name: '史府', level: 0, family: '史', color: '#F56C6C', isShow: true, children: [
        {name: '史侯', level: 1, color: '#F56C6C', family: '史', children: [
            {name: '史湘云祖父', level: 2, color: '#F56C6C', family: '史', children: [
                {name: '史湘云父母', level: 3, color: '#F56C6C', family: '史', children: [
                    {name: '史湘云', level: 4, color: '#F56C6C', family: '史'},
                    {name: '卫若兰', level: 4, color: '#F56C6C', family: '史'}
                ]},
                {name: '贾鼐', level: 3, color: '#F56C6C', family: '史'},
                {name: '贾鼎', level: 3, color: '#F56C6C', family: '史'}
            ]},
            {name: '贾母', level: 2, color: '#F56C6C', family: '史'}
        ]}
    ]},
    {name: '王府', level: 0, color: '#2acaca', family: '王', isShow: true, children: [
        {name: '王夫人之父身份不详', level: 1, color: '#2acaca', family: '王', children: [
            {name: '王夫人之父', level: 2, color: '#2acaca', family: '王', children: [
                {name: '王熙凤父母', level: 3, color: '#2acaca', family: '王', children: [
                    {name: '王仁', level: 4, color: '#2acaca', family: '王'},
                    {name: '巧姐之二舅', level: 4, color: '#2acaca', family: '王'},
                    {name: '王熙凤', level: 4, color: '#2acaca', family: '王'}
                ]},
                {name: '王子腾', level: 3, color: '#2acaca', family: '王', children: [
                    {name: '王子腾之女', level: 4, family: '王', relation: '保宁侯之子', color: '#2acaca'}
                ]},
                {name: '王夫人', level: 3, color: '#2acaca', family: '王'},
                {name: '薛姨妈', level: 3, color: '#2acaca', family: '王'}
            ]}
        ]}
    ]},
    {name: '薛府', level: 0, color: '#f69e6e', family: '薛', isShow: true, children: [
        {name: '薛身份不祥', level: 1, color: '#f69e6e', family: '薛', children: [
            {name: '薛蟠之父身份不详', level: 2, family: '薛', color: '#f69e6e', children: [
                {name: '薛蟠之父', level: 3, family: '薛', relation: '薛姨妈', color: '#f69e6e', relationFamily: '王夫人之父', relationColor: '#2acaca', children: [
                    {name: '薛蟠', level: 4, family: '薛', relation: '夏金桂', color: '#f69e6e', children: [
                        {name: '（妾）甄英莲', family: '薛', level: 5, color: '#f69e6e'},
                        {name: '（妾）宝蟾', family: '薛', level: 5, color: '#f69e6e'}
                    ]},
                    {name: '薛宝钗', level: 4, family: '薛', color: '#f69e6e'}
                ]}, 
                {name: '薛宝琴父母', level: 3, family: '薛', color: '#f69e6e', children: [
                    {name: '薛蝌', level: 4, family: '薛', relation: '邢轴烟', color: '#f69e6e'},
                    {name: '薛宝琴', level: 4, family: '薛', relation: '梅翰林之子', color: '#f69e6e'}
                ]}
            ]}
        ]}
    ]}
]

// 获取需要展示的家族数据--通过控制isShow来决定是否绘制该类节点
function getShowData(leftBottomTipsClickName) {
  if (!!leftBottomTipsClickName) {
    let obj = NODES.find(it => it.name === leftBottomTipsClickName) || {isShow: true};
    obj.isShow = !obj.isShow;
  }
  let data = NODES.filter(it => it.isShow);
  return getData(data);
}

// 获取节点/连接线数据(多维变一维数组)
function getData(data) {
  let length = data.length;
  let nodesData = [], linksData = [];
  for (let i = 0; i < length; i++) {
    let item = data[i];
    if (isHasChildren(item)) {
      let resultData = getLinkData(item, nodesData, linksData) || {nodesData: [], linksData: []};
      nodesData = resultData.nodesData;
      linksData = resultData.linksData;
    }
  }

  return {
    nodesData,
    linksData
  };
}

// 判断是否有子孙节点
function isHasChildren(item) {
  return !!item && item.children && !!item.children.length;
}

// 获取nodesData、linksData
function getLinkData(item, nodesData = [], linksData = []) {
  let length = item.children.length;
  hasNodesData(item, nodesData);   // 添加第一层：贾、薛、史、王
  for (let i = 0; i < length; i++) {
    let it = item.children[i];
    hasNodesData(it, nodesData);
    linksData.push(Object.assign({
      source: item.name,
      target: it.name
    }, it));
    if (!!it.relation) {
      relationData(it, linksData, nodesData);   // 有夫妻关系节点
    }
    if (isHasChildren(it)) getLinkData(it, nodesData, linksData);
  }
  return {
    nodesData,
    linksData
  };
}

// 判断nodesData中是否已有该节点
function hasNodesData(item, nodesData) {
  let flag = nodesData.find(ite => ite.name === item.name);
  if (!flag) nodesData.push(Object.assign(item, {isFocus: true, belongToFamily: item.belongToFamily ? item.belongToFamily : item.family}));
}

// 添加关系节点-夫妻
function relationData(it, linksData, nodesData) {
  // 添加夫妻间的连接线
  if (!linksData.find(ite => ite.source.name === it.name && ite.target.name === it.relation)) {
    // 添加夫妻间的连接线
    linksData.push(Object.assign({
      source: it.name,
      target: it.relation,
      relationType: '夫妻'
    }, it)); 

    // 添加妻子节点
    addNodesData(it, 'relation', nodesData);
  }

  /** 添加无母族的妻子节点
   *  母族名(family)：未知， 
   *  relation：丈夫姓名，
   *  relationFamily：丈夫所属家族名称，
   *  belongToFamily：所属家族为丈夫所在家族
   */
  if (!it.relationFamily) {
    hasNodesData({
      name: it.relation, 
      color: it.relationColor || it.color, 
      family: '未知',
      relation: it.name,
      relationFamily: it.family, 
      belongToFamily: it.family
    }, nodesData)
  }
}

// 根据name判断是否需要新增节点
function addNodesData(item, nameKey, nodesData) {
  let name = item[nameKey];
  let flag = nodesData.find(ite => ite.name === name);
  if (!flag && findNodes(name)) {
    let obj = {};
    switch(nameKey) {
      case 'relation':
        /** 添加有母族的妻子节点 
         *  relation：丈夫姓名，
         *  relationFamily：丈夫所属家族名称，
         *  belongToFamily：所属家族为丈夫所在家族
         */
        obj = Object.assign(findNodes(name), {
          relation: item.name,
          relationFamily: item.family,
          belongToFamily: item.family
        })
        break;
    }
    nodesData.push(obj)
  }
}

// 根据name查找节点
function findNodes(name, list = NODES) {
  let length = list.length;
  for (let i = 0; i < length; i++) {
    let item = list[i];
    if (item.name === name) return item;
    // 递归循环中，必须有return，否则即使item.name === name为true，也会返回undefined
    if (isHasChildren(item)) {
      let obj = findNodes(name, item.children);
      if (!!obj) return obj;
    }
  }
}