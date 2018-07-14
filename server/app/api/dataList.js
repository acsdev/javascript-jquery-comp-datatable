var dataList = function() {

    var getName = function () {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    }

    var getPerc = function () {
        return Math.round(Math.random() * 100) / 100;
    }

    var getDate = function () {
        var _d = new Date(new Date().getTime() + (Math.random() * 1000000000));
        return _d.getDate() + '/' + _d.getMonth() + '/' + _d.getFullYear();
    }

    var itens = [];
    for (var i = 0; i < 53; i++) {
        var item = {
            id : i + 1,
            name: getName(),
            perc: getPerc(),
            date: getDate()
        }
        itens.push( item );
    }

    return itens;
}

module.exports = dataList();