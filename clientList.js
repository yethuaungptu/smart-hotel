let list = [];
exports.setList = (idx, ip) => {
  let obj = {};
  Object.assign(obj, { id: idx }, { ip: ip });
  list.push(obj);
};

exports.refreshList = (id) => {
  let list2 = list.filter(function (list) {
    return list.id != id;
  });
  list = list2;
};

exports.getList = () => {
  return list;
};
