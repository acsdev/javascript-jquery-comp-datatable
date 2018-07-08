/**
 * Componente para paginação de dados em memória.
 * Base do componente HTML / CSS / Javascript(JQuery)
 * 
 * Exemplo de utilização pode ser encontrado no arquivo data-table-sample.js
 *       
 * @author allansantos
 */
(function( $ ) {

    $.fn.dataTableInMemory = function(options) {
        
        var _defaultSettings = $.extend({
            actions        : [],
            allowCheckRows : false,
            keyObject      : 'id',
            checkObject    : 'checked',
            sourceFields   : [],
            sourceData     : [],
            currentRow     : 0,
            currentPage    : 1,
            pageSize       : 10
        });

        var _ID           = null;
        var _tbody        = null;
        var _inptPage     = null;
        var _inptTotal    = null;
        //
        var _sourceFields = null;
        var _sourceData   = null;
        var _currentRow   = null;
        var _pageSize     = null;
    
        var _currentPage    = null;
        var _totalPages     = null;
        var _actions        = null;
        var _keyObject      = null;
        var _checkObject    = null;
        var _allowCheckRows = null;

        var _cssActionTypes = {
            DELETE:'icon-close',
            INFO:'icon-info',
        };

        var _fisrtPage = function() { 
            _goToPage( 1 );
            return this;
        }
    
        var _previPage = function() { _goToPage( --_currentPage ); }
        
        var _nextPage  = function() { _goToPage( ++_currentPage ); }
    
        var _lastPage  = function() {
            _currentPage = _totalPages; 
            _currentRow = (_currentPage * _pageSize) - _pageSize;
            //
            _render( _prepareRows( _currentRow ) );
            $(_inptPage).val( _totalPages );
        }

        var _goToPage = function(page) {
            if (page < 1) page = 1;
            if (page > _totalPages) page = _totalPages;
            _currentPage = page; 
            _currentRow = (_currentPage * _pageSize) - _pageSize;
            //
            _render( _prepareRows( _currentRow ) );
            $(_inptPage).val( page );
            
        }

        var _render   = function( dataTable ) {
                
            $(_tbody).empty();
            $(_tbody).hide();
            $.each(dataTable, function() {
                var dataTableItem = this;
                
                var tr = $('<tr/>');
                
                // CELLS
                if (_allowCheckRows) {
                    
                    var checked = dataTableItem[_checkObject];
    
                    var td = $('<td/>', {class:'cellfullmarkunmark'});
                    $(td).append($('<input/>',{type:'checkbox', checked:checked, id:'cbind'.concat(dataTableItem[_keyObject]) }));
                    $(tr).append(td);  
                }
    
                $.each( _sourceFields, function() {
    
                    var dataTableField = this;
    
                    var htmlTD   = $('<td/>');
                    var htmlSPAN = $('<span/>');
    
                    $(htmlSPAN).append( dataTableItem[dataTableField] );
                    $(htmlTD).append( $(htmlSPAN) );
                    $(tr).append( $(htmlTD) );
                });
    
                if (_actions.length > 0) {
                    var td   = $('<td/>', {class:'centerColumn', width: '15%'});
                    var div   = $('<div/>', {class:'actions'});
                    $.each( _actions, function() {
                        var action = this;
                        var a    = $('<a/>', {                   
                            href: '#',
                            text: action.type,
                            title: action.title,
                            class: 'container-datatable-table-icon '.concat( _cssActionTypes[action.type]),
                            'click': function(){ action.actClick( dataTableItem ) }
                        });    
                        $(div).append( $(a) );
                        $(div).append( $('<span>', {style:'margin-left:2px;margin-right:2px;'}) );
                    });
                    $(td).append( $(div) );
                    $(tr).append( $(td) );
                }
    
                $(_tbody).append( $(tr) );
    
            });
            $(_tbody).fadeIn('slow');
            
        }

        var _prepareEvents = function( compID ) {
                
        
            $(document).on('click', compID.concat(' #comp-datatable-pg a#first'), _fisrtPage);
            $(document).on('click', compID.concat(' #comp-datatable-pg a#prev'),  _previPage);
            $(document).on('click', compID.concat(' #comp-datatable-pg a#next'),  _nextPage);
            $(document).on('click', compID.concat(' #comp-datatable-pg a#final'), _lastPage);
        
            $(document).on('change', compID.concat(' #comp-datatable-pg input#cpage'), function() {
                _goToPage( $(_inptPage).val() ) 
            });
    
            $(document).on('change', compID.concat(' input[id^=cbind]'), function() { 
                var value = $(this).prop('checked');
                var id = $(this).attr('id').replace(/[^0-9]/g,'');
                $(_sourceData).each(function() {
                    if (this[_keyObject] == id) {
                        this[_checkObject] = value;
                    }
                });
            });
    
            $(document).on('change', compID.concat(' #container-datatable-full-marker'), function() { 
                var value = $(this).prop('checked');
                $(_sourceData).each(function() {this[_checkObject] = value}); // MARK ALL ITENS WITH CHECK OR UNCHECKED
                _goToPage( _currentPage ); // RERENDER PAGE
            });
        }
    
        var _prepareCheckRows = function() {
            var th = $('<th/>', {class:'cellfullmarkunmark'});
            $(th).append($('<input/>', {id:"container-datatable-full-marker", type:'checkbox'}));
            $(_thead).find('tr').prepend(th);
    
            // ADD checked ATTRIBUTE AT ALL ITENS
            $(_sourceData).each(function() { this['checked'] = false; });        
        }
    
        var _prepareRows = function( row ) {
            if (_sourceData.length > _pageSize) {           
                var tmp   = [];
                var limit = row + _pageSize;
                for ( var itemIndex = row; itemIndex < limit; itemIndex++ ) {
                    var item = _sourceData[itemIndex];
                    if (item) {
                        tmp.push( _sourceData[itemIndex] );
                    }
                }
                return tmp;
            }
            return _sourceData;
        }   

        this.initialize       = function() {
            
            var setts  = $.extend(_defaultSettings, options);
            //
            _ID        = '#'.concat($(this).attr('id'));
            _tbody     = $(this).find('tbody');
            _thead     = $(this).find('thead');
            _inptPage  = $(this).find('input#cpage');
            _inptTotal = $(this).find('input#tpage');
            
            _actions        = setts.actions;
            
            _allowCheckRows = setts.allowCheckRows;
            _keyObject      = setts.keyObject;
            _checkObject    = setts.checkObject;
            _checkObject    = setts.actions;

            _sourceFields   = setts.sourceFields;
            _sourceData     = [].concat(setts.sourceData); //DEFENSE PROG.
            _currentRow     = setts.currentRow;
            _pageSize       = setts.pageSize;

            _currentPage  = 1;
            _totalPages   = Math.round(_sourceData.length / _pageSize) + (_sourceData.length % _pageSize == 0 ? 0 : 1);
            
            if (_allowCheckRows) { _prepareCheckRows(); }

            if (_actions.length > 0) {
                var th = $('<th/>',{class:'centerColumn'});
                $(th).append($('<span/>',{text:'Ações'}));
                $(_thead).find('tr').append( $(th) );
            }

            $(_inptPage).attr('max', _totalPages);

            if (_sourceData && _sourceData.length > 0) {           
                $(_inptPage).val( 1 );
                $(_inptTotal).val( _totalPages );
                $(this).find('.container-datatable-pg').show();
            } 

            _prepareEvents(_ID);

            _fisrtPage();

            return this;
        }

        this.refresh = function( newDataList ) {
            if (newDataList == null || newDataList == undefined) {
                throw new Error('options is required!');
            }
            
            if ($.isArray(newDataList)) {
                                
                _sourceData = [].concat( newDataList ) //DEFENSE PROG.
                _totalPages = Math.round(_sourceData.length / _pageSize) + (_sourceData.length % _pageSize == 0 ? 0 : 1);
    
                $(_inptTotal).val( _totalPages );
                if (_allowCheckRows) { _prepareCheckRows(); }
    
                _fisrtPage();

                return this;
            }
    
            throw new Error('newDataList must be an array');
        };

        return this.initialize(); 
    };
}( jQuery ));