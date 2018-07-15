var dataListGenarator = function( size ) {

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
    var id = 0;
    while (true) {
        var item = {
            id : ++id,
            name: getName(),
            perc: getPerc(),
            date: getDate()
        }
        itens.push( item );
        if (itens.length == size) break;
    }
    return itens;
};

$(document).ready(function() {
  
    $('#comp-datatable1').dataTable({
        pageSize       : 5,
        sourceColumns  : [
            {title: 'Column 01'},
            {title: 'Column 02'},
            {title: 'Column 03'},
            {title: 'Column 04'}
        ],
        sourceFields   : ['id','name','perc','date'],
        sourceData     : dataListGenarator(27)
    });

    $('#comp-datatable2').dataTable({
        allowCheckRows : true,
        pageSize       : 5,
        sourceColumns  : [
            {title: 'Column 01'},
            {title: 'Column 02'},
            {title: 'Column 03'},
            {title: 'Column 04'}
        ],
        sourceFields   : ['id','name','perc','date'],
        sourceData     : dataListGenarator(33)
    });

    $('#comp-datatable3').dataTable({
        allowCheckRows : true,
        pageSize       : 5,
        sourceColumns  : [
            {title: 'Column 01'},
            {title: 'Column 02'},
            {title: 'Column 03'},
            {title: 'Column 04'}
        ],
        sourceFields   : ['id','name','perc','date'],
        sourceData     : dataListGenarator(19),
        actions        : [
            { type: 'VIEW'    , title: 'Visualizar', actClick:function(obj){ alert('Visualizar: ' + JSON.stringify(obj)); } },
            { type: 'CANCEL' ,  title: 'Cancelar'  , actClick:function(obj){ alert('Cancelar  : ' + JSON.stringify(obj)); } }
        ]
    });


    $('#comp-datatable4').dataTable({
        pageSize       : 5,
        sourceColumns  : [
            {title: 'Column 01'},
            {title: 'Column 02'},
            {title: 'Column 03'},
            {title: 'Column 04'}
        ],
        sourceFields   : ['id','name','perc','date'],
        sourceData: {            
            url: 'http://localhost:3000/pageabledata/mocklist',
            pageParam:'page',
            pageSizeParam:'size',
            headers:[],
            queryStringParams:'',
            attributeData:'content',
            attributeTotalRows:'rowCount'
        }
    })

    $('#comp-datatable5').dataTable({
        allowCheckRows : true,
        pageSize       : 5,
        sourceColumns  : [
            {title: 'Column 01'},
            {title: 'Column 02'},
            {title: 'Column 03'},
            {title: 'Column 04'}
        ],
        sourceFields   : ['id','name','perc','date'],
        sourceData: {            
            url: 'http://localhost:3000/pageabledata/mocklist',
            pageParam:'page',
            pageSizeParam:'size',
            headers:[],
            queryStringParams:'',
            attributeData:'content',
            attributeTotalRows:'rowCount'
        }
    })

    $('#comp-datatable6').dataTable({
        allowCheckRows : true,
        pageSize       : 5,
        sourceColumns  : [
            {title: 'Column 01'},
            {title: 'Column 02'},
            {title: 'Column 03'},
            {title: 'Column 04'}
        ],
        sourceFields   : ['id','name','perc','date'],
        sourceData: {            
            url: 'http://localhost:3000/pageabledata/mocklist',
            pageParam:'page',
            pageSizeParam:'size',
            headers:[],
            queryStringParams:'',
            attributeData:'content',
            attributeTotalRows:'rowCount'
        },
        actions        : [
            { type: 'VIEW'    , title: 'Visualizar', actClick:function(obj){ alert('Visualizar: ' + JSON.stringify(obj)); } },
            { type: 'CANCEL' ,  title: 'Cancelar'  , actClick:function(obj){ alert('Cancelar  : ' + JSON.stringify(obj)); } }
        ]
    })
    
});