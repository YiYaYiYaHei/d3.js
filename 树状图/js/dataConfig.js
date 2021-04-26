/**
 * name: 家族/姓名
 * level：树层级（0-*）
 * color：节点颜色  贾-#67C23A; 史：#F56C6C; 王：#2acaca; 薛: #f69e6e
 * isExpand：是否展开  true-展开 false-收起
 * children：子孙节点
 * relation：妻子/丈夫姓名
 * relationColor：妻子/丈夫的节点颜色
 * relationFamily：妻子/丈夫所在的家族名称
 * isShadow: 是否展示阴影 true-有阴影 false-没有阴影
 */
const NODES_ORIGIN = {
  name: '红楼梦任务关系图',
  isExpand: true,
  children: [
    {name: '贾府', level: 0, color: '#67C23A', children: [
        {name: '贾演', level: 1, color: '#67C23A', children: [
            {name: '贾代化（宁国府）', level: 2, color: '#67C23A', children: [
                {name: '贾敬', level: 3, color: '#67C23A', children: [
                    {name: '贾珍', level: 4, color: '#67C23A', children: [
                        {name: '贾惜春', level: 5, color: '#67C23A'},
                        {name: '贾荣', level: 5, relation: '秦可卿', color: '#67C23A'}
                    ]}
                ]}
            ]}
        ]},
        {name: '贾源', level: 1, color: '#67C23A', children: [
            {name: '贾代善（荣国府）', level: 2, color: '#67C23A', relationColor: '#F56C6C', relation: '贾母', relationFamily: '史侯', children: [
                {name: '贾赦', level: 3, relation: '邢夫人', color: '#67C23A', children: [
                    {name: '贾琏', level: 4, relation: '王熙凤', relationFamily: '王熙凤父母', color: '#67C23A', relationColor: '#2acaca', children: [
                        {name: '贾巧姐', level: 5, color: '#67C23A'}
                    ]},
                    {name: '贾迎春', level: 4, relation: '孙绍祖', color: '#67C23A'}
                ]},
                {name: '贾政', level: 3, relation: '王夫人', color: '#67C23A', relationFamily: '王夫人之父', relationColor: '#2acaca', children: [
                    {name: '贾珠贾珠贾珠贾珠贾珠贾珠贾珠贾珠贾珠贾珠贾珠贾珠贾珠贾珠', level: 4, relation: '李纨', color: '#67C23A', children: [
                        {name: '贾兰', level: 5, color: '#67C23A'}
                    ]},
                    {name: '贾元春', level: 4, color: '#67C23A'},
                    {name: '贾宝玉', level: 4, color: '#67C23A', relation: '薛宝钗', relationFamily: '薛蟠之父', relationColor: '#f69e6e'},
                    {name: '贾探春', level: 4, color: '#67C23A'},
                    {name: '贾环', level: 4, color: '#67C23A'}
                ]},
                {name: '贾敏', level: 3, relation: '林如海', color: '#67C23A', children: [
                    {name: '林黛玉', level: 4, color: '#67C23A'}
                ]}
            ]}
        ]}
    ]},
    {name: '史府', level: 0, color: '#F56C6C', children: [
        {name: '史侯', level: 1, color: '#F56C6C', children: [
            {name: '史湘云祖父', level: 2, color: '#F56C6C', children: [
                {name: '史湘云父母', level: 3, color: '#F56C6C', children: [
                    {name: '史湘云', level: 4, color: '#F56C6C'},
                    {name: '卫若兰', level: 4, color: '#F56C6C'}
                ]},
                {name: '贾鼐', level: 3, color: '#F56C6C'},
                {name: '贾鼎', level: 3, color: '#F56C6C'}
            ]},
            {name: '贾母', level: 2, color: '#F56C6C'}
        ]}
    ]},
    {name: '王府', level: 0, color: '#2acaca', children: [
        {name: '王夫人之父身份不详', level: 1, color: '#2acaca', children: [
            {name: '王夫人之父', level: 2, color: '#2acaca', children: [
                {name: '王熙凤父母', level: 3, color: '#2acaca', children: [
                    {name: '王仁', level: 4, color: '#2acaca'},
                    {name: '巧姐之二舅', level: 4, color: '#2acaca'},
                    {name: '王熙凤', level: 4, color: '#2acaca'}
                ]},
                {name: '王子腾', level: 3, color: '#2acaca', children: [
                    {name: '王子腾之女', level: 4, relation: '保宁侯之子', color: '#2acaca'}
                ]},
                {name: '王夫人', level: 3, color: '#2acaca'},
                {name: '薛姨妈', level: 3, color: '#2acaca'}
            ]}
        ]}
    ]},
    {name: '薛府', level: 0, color: '#f69e6e', children: [
        {name: '薛身份不祥', level: 1, color: '#f69e6e', children: [
            {name: '薛蟠之父身份不详', level: 2, color: '#f69e6e', children: [
                {name: '薛蟠之父', level: 3, relation: '薛姨妈', color: '#f69e6e', relationFamily: '王夫人之父', relationColor: '#2acaca', children: [
                    {name: '薛蟠', level: 4, relation: '夏金桂', color: '#f69e6e', children: [
                        {name: '（妾）甄英莲', level: 5, color: '#f69e6e'},
                        {name: '（妾）宝蟾', level: 5, color: '#f69e6e'}
                    ]},
                    {name: '薛宝钗', level: 4, color: '#f69e6e'}
                ]}, 
                {name: '薛宝琴父母', level: 3, color: '#f69e6e', children: [
                    {name: '薛蝌', level: 4, relation: '邢轴烟', color: '#f69e6e'},
                    {name: '薛宝琴', level: 4, relation: '梅翰林之子', color: '#f69e6e'}
                ]}
            ]}
        ]}
    ]}
  ]
}

// 组装数据
function assemableData(data = NODES_ORIGIN.children) {
  let length = data.length;
  for (let i = 0; i < length; i++) {
    let item = data[i];
    item.isExpand = true;   // 是否展开  true-展开 false-收起
    item.isShadow = false;  // 是否展示阴影 true-有阴影 false-没有阴影
    if(hasChildrenData(item)) assemableData(item.children);
  }
}

// 判断是否有子节点
function hasChildrenData(item) {
  return !!item.children && !!item.children.length
}

// 根据name查找节点
function findName(name, data) {
  let length = data.length;
  for (let i = 0; i < length; i++) {
    let item = data[i];
    if (item.name === name) return item;
    if (hasChildrenData(item)) {
      let obj = findName(name, item.children);
      if (!!obj) return obj;
    }
  }
}

// 根据name查找并删除
function findNameDEL(name, data) {
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (item.name === name) {
      data.splice(i, 1);
    }
    if (hasChildrenData(item)) {
      findNameDEL(name, item.children);
    }
  }
}