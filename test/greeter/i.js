//如下扁平对象，转为树形对象。parent字段为空字符串的节点为根节点
let company = {
    h3: {
        parent: 'h2',
        name: '副总经理(市场)'
    },
    h1: {
        parent: 'h0',
        name: '公司机构'
    },
    h7: {
        parent: 'h6',
        name: '副总经理(总务)'
    },
    h4: {
        parent: 'h3',
        name: '销售经理'
    },
    h2: {
        parent: 'h1',
        name: '总经理'
    },
    h8: {
        parent: 'h0',
        name: '财务总监'
    },
    h6: {
        parent: 'h4',
        name: '仓管总监'
    },
    h5: {
        parent: 'h4',
        name: '销售代表'
    },
    h0: {
        parent: '',
        name: 'root'
    }
}


function tree(tagobj, from, result) {
    for (var o in tagobj) {
        if (tagobj[o].parent == from) {
            if (result[from] == null) { result[from] = {} }
            result[from][o] = tagobj[o];
            tree(tagobj, o, result[from]);
        }
    }
}

let result = {};
tree(company, "", result)
console.log(result)