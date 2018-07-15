var _sourceData = require('../api/dataList.js');

module.exports  = function(app) {
    
    app.get('/pageabledata/mocklist',function(req, res) {

        let _page         = parseInt( !req.query.page ? 1 : req.query.page );
        let _pageSize     = parseInt( !req.query.size ? 10 : req.query.size );

        // USE THIS IF PAGE STARTS FROM 0
        // _page = ( _page == 0 ? 1 : page - 1); // BECAUSE PAGE STARTS FROM 0

        let row = (_page * _pageSize) - _pageSize;
        
        let tmp   = [];
        let limit = row + _pageSize;    

        for ( let itemIndex = row; itemIndex < limit; itemIndex++ ) {
            let item = _sourceData[itemIndex];
            if (item) {
                tmp.push( _sourceData[itemIndex] );
            }
        }

        console.log('Page: ' +  _page + ' Pagesize: ' + _pageSize + ' Row: ' + row);
        let pageble = {
            content: tmp,
            rowCount: _sourceData.length
        }
        res.status( 200 ).json( pageble );
    });
};