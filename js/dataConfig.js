// 贾-#67C23A; 史：#F56C6C; 王：#2acaca; 薛: #f69e6e
const NODES = [
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
                    {name: '贾珠', level: 4, relation: '李纨', color: '#67C23A', children: [
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

function getData(data) {
    let length = data.length;
    let nodesData = [], linksData = [];
    for (let i = 0; i < length; i++) {
        let item = data[i];
        if (isHasChildren(item)) {
            let resultData = getLinkData(item) || {nodesData: [], linksData: []};
            nodesData = nodesData.concat(resultData.nodesData);
            linksData = linksData.concat(resultData.linksData);
        }
    }
    return {
        nodesData,
        linksData
    };
}

/* 判断是否有子孙节点 */
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
    if (!flag) nodesData.push(item);
}

// 添加关系节点-夫妻
function relationData(it, linksData, nodesData) {
    if (!linksData.find(ite => ite.source === it.name && ite.target === it.relation)) {
        linksData.push(Object.assign({
            source: it.name,
            target: it.relation,
            relationType: '夫妻'
        }, it)); 
    }
    if (!it.relationFamily) hasNodesData({name: it.relation, color: it.relationColor || it.color}, nodesData);
    if (!!it.relationFamily) {
        if (!linksData.find(ite => ite.source === it.relationFamily && ite.target === it.relation)) {
            linksData.push(Object.assign({
                source: it.relationFamily,
                target: it.relation
            }, it));
        }
    }
}