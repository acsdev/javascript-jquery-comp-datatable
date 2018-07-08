var sampleListJSON  = null;

var getName = function() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
}
var getPerc = function() {
    return Math.round(Math.random() * 100) / 100;
}
var getDate = function () {
    var _d = new Date(new Date().getTime() + (Math.random() * 1000000000));
    return _d.getDate() +'/'+_d.getMonth()+'/'+_d.getFullYear();
}

var getList = function() {
    return [
        {id: 01, name: getName(), date: getDate(), perc: getPerc()},
        {id: 02, name: getName(), date: getDate(), perc: getPerc()},
        {id: 03, name: getName(), date: getDate(), perc: getPerc()},
        {id: 04, name: getName(), date: getDate(), perc: getPerc()},
        {id: 05, name: getName(), date: getDate(), perc: getPerc()},
        {id: 06, name: getName(), date: getDate(), perc: getPerc()},
        {id: 07, name: getName(), date: getDate(), perc: getPerc()},
        {id: 08, name: getName(), date: getDate(), perc: getPerc()},
        {id: 09, name: getName(), date: getDate(), perc: getPerc()},
        {id: 10, name: getName(), date: getDate(), perc: getPerc()},
        {id: 11, name: getName(), date: getDate(), perc: getPerc()},
        {id: 12, name: getName(), date: getDate(), perc: getPerc()},
        {id: 13, name: getName(), date: getDate(), perc: getPerc()},
        {id: 14, name: getName(), date: getDate(), perc: getPerc()},
        {id: 15, name: getName(), date: getDate(), perc: getPerc()},
        {id: 16, name: getName(), date: getDate(), perc: getPerc()},
        {id: 17, name: getName(), date: getDate(), perc: getPerc()},
        {id: 18, name: getName(), date: getDate(), perc: getPerc()},
        {id: 19, name: getName(), date: getDate(), perc: getPerc()},
        {id: 20, name: getName(), date: getDate(), perc: getPerc()},
        {id: 21, name: getName(), date: getDate(), perc: getPerc()},
        {id: 22, name: getName(), date: getDate(), perc: getPerc()},
        {id: 23, name: getName(), date: getDate(), perc: getPerc()},
        {id: 24, name: getName(), date: getDate(), perc: getPerc()},
        {id: 25, name: getName(), date: getDate(), perc: getPerc()},
        {id: 26, name: getName(), date: getDate(), perc: getPerc()},
        {id: 27, name: getName(), date: getDate(), perc: getPerc()},
        {id: 28, name: getName(), date: getDate(), perc: getPerc()},
        {id: 29, name: getName(), date: getDate(), perc: getPerc()},
        {id: 30, name: getName(), date: getDate(), perc: getPerc()},
        {id: 31, name: getName(), date: getDate(), perc: getPerc()},
    ]
};

var getAFew = function() {
    return [
        {id: 32, name: getName(), date: getDate(), perc: getPerc()},
        {id: 33, name: getName(), date: getDate(), perc: getPerc()},
        {id: 34, name: getName(), date: getDate(), perc: getPerc()}
    ]
};

var dt1 = null;
var dt2 = null;
var dt3 = null;
$(document).ready(function() {
    sampleListJSON  = getList();
    
    dt1 = $('#comp-datatable1').dataTableInMemory({
        sourceFields   : ['id','name','date','perc'],
        sourceData     : sampleListJSON,
        pageSize       : 3,
    });


    dt2 =  $('#comp-datatable2').dataTableInMemory({
        allowCheckRows : true,
        sourceFields   : ['id','name','date','perc'],
        sourceData     : sampleListJSON,
        pageSize       : 3
    });

    dt3 = $('#comp-datatable3').dataTableInMemory({
        allowCheckRows : true,
        sourceFields   : ['id','name','date','perc'],
        sourceData     : sampleListJSON,
        pageSize       : 3,
        actions        : [
            { type: 'DELETE', title: 'Remover', actClick:function(obj){ alert('Remover: ' + JSON.stringify(obj)); } },
            { type: 'EDIT' ,  title: 'Editar', actClick:function(obj){ alert('Editar: ' + JSON.stringify(obj)); } }
        ]
    });

    setTimeout(function() {
        dt1.refresh( sampleListJSON.concat( getAFew() )) ;
    }, 3500);
    

});