/**
 * Componente para paginação de dados em memória.
 * Base do componente HTML / CSS / Javascript(JQuery)
 * 
 * Exemplo de utilização pode ser encontrado no arquivo data-table-sample.js
 *       
 * @author allansantos
 */
(function( $ ) {

    $.fn.dataTable = function(options) {
        
        var _component      = this;
        var _ID             = $(_component).attr('id');
        
        var _TYPE           = null; //MEMORY OR SERVER
        var _table          = null;
        var _thead          = null;
        var _tbody          = null;
        var _inptPage       = null;
        var _inptTotal      = null;
        var _arrayOfChecked = [];
        
        var _firstPageIsZero = null;
        //
        var _sourceFields   = null;
        var _sourceData     = null;
        var _currentRow     = null;
        var _pageSize       = null;
    
        var _currentPage    = 1;
        var _arrayOnScreen  = null;
        var _totalPages     = null;
        
        var _actions        = null;
        var _keyObject      = null;
        var _checkObject    = null;
        var _allowCheckRows = null;

        var _constants = {
            ANIMATION_TRUE     : 'ANIMATION_TRUE',
            ANIMATION_FALSE    : 'ANIMATION_FALSE'
        }
        
        var _attributes = {
            idCheckBoxSimple    :'cbind',
            idCheckBoxAll       :'datatable-check-marker-all',
            idLinkFirst         :'first',
            idLinkPrevious      :'previous',
            idLinkNext          :'next',
            idLinkLast          :'last',
            idInputPage         :'cpage',
            idInputTotal        :'tpage',
            classDivDataTable   :'container-datatable',
            classDivDataPaginate:'container-datatable-pg',
            classLinkPagination :'pgbtn',
            textActionColumn    :'Actions',
            classIsDisabled     :'disabled',
            classDivIcons       :'actions',
            classMarkerColumn   :'centerColumn',
            classActionColumn   :'centerColumn',
            classAction_SPACER  :'spacer',
            classAction_VIEW    :'actionIcon actionView',
            classAction_CANCEL  :'actionIcon actionAbort'
        }

        var _cssActionTypes = {
            VIEW: _attributes.classAction_VIEW,
            CANCEL: _attributes.classAction_CANCEL,
        };
        
        var _selectors = {
            divPagination       :'#' +_ID + ' .container-datatable-pg',
            divPaginationLinks  :'#' +_ID + ' .container-datatable-pg a',
            linkFirst           :'#' +_ID + ' .container-datatable-pg a#first',
            linkPrevious        :'#' +_ID + ' .container-datatable-pg a#previous',
            linkNext            :'#' +_ID + ' .container-datatable-pg a#next',
            linkLast            :'#' +_ID + ' .container-datatable-pg a#last',
            inputCurrentPage    :'#' +_ID + ' .container-datatable-pg input#cpage',
            inputTotalPages     :'#' +_ID + ' .container-datatable-pg input#tpage',
            inputTypeCheck      :'#' +_ID + ' input[id^='.concat(_attributes.idCheckBoxSimple).concat(']'),
            checkBoxAll         :'#' +_ID + ' #'.concat(_attributes.idCheckBoxAll),
        }
         
        var _defaultSettings = $.extend({
            actions              : [],
            allowCheckRows       : false,
            keyObject            : 'id',
            checkObject          : 'checked',
            firstPageIsZero      : true,
            sourceColumns        : [],
            sourceFields         : [],
            sourceData           : [],
            currentPage          : 1,
            pageSize             : 10,
            LBLFirst             : 'First «',
            LBLPrevious          : 'Previous ‹',
            LBLNext              : 'Next ›',
            LBLLast              : 'Last »',
            LBLPage              : 'Page',
            LBLOf                : 'of',
            msgDataNotFoundPag   : 'Data not found.',
            msgErrorOnServerPag  : 'Error on get the date, check the log or your connection.'
        });

        var _fisrtPage = function(event) { 
            if ($(this).hasClass( _attributes.classIsDisabled) ) return;
            _goToPage( 1 ); 
        }
    
        var _previPage = function(event) { 
            if ($(this).hasClass( _attributes.classIsDisabled) ) return;
            _goToPage( --_currentPage ); 
        }
        
        var _nextPage  = function(event) { 
            if ($(this).hasClass( _attributes.classIsDisabled) ) return;
            _goToPage( ++_currentPage );
        }
    
        var _lastPage  = function(event) {            
            if ($(this).hasClass( _attributes.classIsDisabled) ) return;
            _goToPage( _totalPages );
        }

        var _goToPage = function(page) {
            
            if ( (page == 0) || (page == 1) ) {
                page = 1;
            }            
            if (page > _totalPages && _totalPages > 0) {
                page = _totalPages;
            } 
            _currentPage = page;

            $(_selectors.divPagination).hide();
            //
            if (_TYPE === 'MEMORY') { 
                 
                _currentRow = (_currentPage * _pageSize) - _pageSize;

                _arrayOnScreen = _prepareRowsMemory( _currentRow );

                _render( _arrayOnScreen );

                _afterPaginate(); 
            }

            if (_TYPE === 'SERVER') { 
                _prepareRowsServer( _sourceData, _currentPage );
            }
        }

        var _keepCheckedAndUncheckItens = function() {

            // UNMARK ALL SELECTS
            $(_selectors.inputTypeCheck).prop('checked', false); 

            // REMARK DEPENDING ON _arrayOfChecked CONTENT
            for ( index in _arrayOnScreen ) {
                var element   = _arrayOnScreen[index];
                var elementID = parseInt( element[_keyObject] );

                if ( _arrayOfChecked.indexOf( element[_keyObject] ) > -1 ) {
                    var checkBox = $('#'.concat(_attributes.idCheckBoxSimple.concat( elementID )));
                    $(checkBox).prop('checked', true);
                }
            }
        }

        var _afterPaginate = function() {

            _keepCheckedAndUncheckItens();

            $(_inptPage).val( _currentPage );
            $(_inptTotal).val( _totalPages );

            $( _selectors.checkBoxAll ).prop('checked',false);

            if ( _totalPages > 1) {
                $( _selectors.divPaginationLinks).attr('href','#');
                $( _selectors.divPaginationLinks).removeClass(_attributes.classIsDisabled);                
                if (_currentPage == 1) {
                    $( _selectors.linkFirst ).addClass(_attributes.classIsDisabled);
                    $( _selectors.linkFirst ).removeAttr('href');
                    $( _selectors.linkPrevious ).addClass(_attributes.classIsDisabled);
                    $( _selectors.linkPrevious ).removeAttr('href');
                }
                if (_currentPage == _totalPages) {
                    $( _selectors.linkNext ).addClass(_attributes.classIsDisabled);
                    $( _selectors.linkNext ).removeAttr('href');
                    $( _selectors.linkLast ).addClass(_attributes.classIsDisabled);
                    $( _selectors.linkLast ).removeAttr('href');
                }
            }

            $(_selectors.divPagination).show();
            if ( _arrayOnScreen.length == 0 ) {
                $(_selectors.divPagination).hide();
                var numberOfColumns = $(_thead).find('th').length;
                var adiviceTD = $('<td>', { text: _defaultSettings.msgDataNotFoundPag, align: 'center', colspan: numberOfColumns }) 
                $(_tbody).empty();
                $(_tbody).append( $('<tr>').append( $(adiviceTD) ));
            }
        }

        var _getWithProps = function(obj, prop, defval)  {
            if (typeof defval == 'undefined') defval = null;
            
            var props = prop.split('.');
            for (var i = 0; i < props.length; i++) {
                if (typeof obj[props[i]] == 'undefined') {
                    return defval;
                }
                obj = obj[props[i]];
            }
            return obj;
        }

        var _prepareValue = function(value) {
            var isDate = new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/);
            if (isDate.test(value)) {
                var v = (new Date(value)).toLocaleString('pt-BR');
                // if (v.indexOf('00:00:00') != -1) {
                //     v = v.substring(0, v.indexOf('00:00:00'));
                // }

                return v.substring(0, v.lastIndexOf(':'));
            }
            return value;
        };

        var _render   = function( arrayOfDataToRender, animation ) {
            if ( (! animation) || (animation == 'undefined')) animation = _constants.ANIMATION_TRUE;
            
            $(_tbody).empty();
            $(_tbody).hide();
            $.each(arrayOfDataToRender, function() {
                var dataTableItem = this;
                
                var tr = $('<tr/>');
                
                // CELLS
                if (_allowCheckRows) {  
                    var checked = dataTableItem[_checkObject];
                    //
                    var td = $('<td/>', {class: _attributes.classMarkerColumn});
                    $(td).append($('<input/>',{type:'checkbox', checked:checked, id: _attributes.idCheckBoxSimple.concat(dataTableItem[_keyObject]) }));
                    $(tr).append(td);  
                }
                
                $.each( _sourceFields, function() {
                    var dataTableField = this;

                    var td   = $('<td/>');
                    var span = $('<span/>');

                    var value = _getWithProps(dataTableItem,dataTableField,'');
                
                    $(span).append( _prepareValue( value ) );
                    $(td).append( $(span) );
                    $(tr).append( $(td) );

                    var th = $(_thead).find('tr').children().get( $(td).index() ); // GET th
                    $(td).addClass( $(th).attr('class') ); // ADD CLASS th ON td
                });
    
                if (_actions.length > 0) {
                    var td   = $('<td/>', {class: _attributes.classActionColumn});
                    var div   = $('<div/>',{class: _attributes.classDivIcons});
                    $.each( _actions, function( actionIndex ) {
                        var action = this;
                        var a    = $('<a/>', {                   
                            href: '#',
                            title: action.title,
                            class: _cssActionTypes[action.type] +' '+ _attributes.classAction_SPACER, 'click': function(){ action.actClick( dataTableItem ) }
                        });    
                        if (_actions.length == (actionIndex + 1) ) { 
                            //ÚLTIMA AÇÂO NÃO DEVE POSSUIR A CLASS espacamento
                            $(a).removeClass(_attributes.classAction_SPACER);
                        }
                        $(div).append( $(a) );
                    });
                    $(td).append( $(div) );
                    $(tr).append( $(td) );
                }
    
                $(_tbody).append( $(tr) );
    
            });
            
            animation === _constants.ANIMATION_TRUE ? $(_tbody).fadeIn('slow') : $(_tbody).show();
            
        }

        var _controlCheckItens = function(element, value) {
            element[_checkObject] = value;
            //
            var elementID = element[_keyObject];
            if (value) {
                _arrayOfChecked.push( elementID );
            } else {
                var index = _arrayOfChecked.indexOf( elementID );
                if (index > -1) {
                    _arrayOfChecked.splice(index, 1);
                }
            } 
        }

        var _prepareEvents = function() {
            
            $(document).on('click', _selectors.linkFirst, function(e) {_fisrtPage(e)} );
            $(document).on('click', _selectors.linkPrevious, function(e) {_previPage(e)} );
            $(document).on('click', _selectors.linkNext, function(e) {_nextPage(e)} );
            $(document).on('click', _selectors.linkLast, function(e) {_lastPage(e)} );
            
            $(document).on('change', _selectors.inputCurrentPage, function() {
                _goToPage( $(_inptPage).val() ) 
            });
            
            $(document).on('change', _selectors.inputTypeCheck, function() { 
                var value = $(this).prop('checked');
                var id = $(this).attr('id').replace(/[^0-9]/g,'');
                //
                var element = null;
                $(_arrayOnScreen).each(function() { if (this[_keyObject] == id) { element = this; } }); // IDENTIFY ELEMENT
                //    
                _controlCheckItens(element, value);
            });
    
            $(document).on('change',  _selectors.checkBoxAll, function() { 
                var value = $(this).prop('checked');

                $( _arrayOnScreen ).each(function() {
                    _controlCheckItens(this, value);
                });
                
                _render( _arrayOnScreen, _constants.ANIMATION_FALSE );
            });
        }
    
        var _prepareCheckRows = function() {
            var th = $('<th/>', {class: _attributes.classMarkerColumn});
            $(th).append($('<input/>', {id: _attributes.idCheckBoxAll, type:'checkbox'}));
            $(_thead).find('tr').prepend(th);
        }
    
        var _prepareRowsMemory = function( row ) {
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
            return [].concat(_sourceData);
        }

        var _prepareRowsServer = function( config, page ) {
            
            var templaceURL = '_URL?_PAGE=_PAGEVALUE&_SIZE=_SIZEVALUE_QS';
            var url = templaceURL
                .replace(/_URL/, config.url)
                .replace(/_PAGE/, config.pageParam)
                .replace(/_PAGEVALUE/,  _firstPageIsZero ? (page - 1) : page ) 
                .replace(/_SIZE/, config.pageSizeParam)
                .replace(/_SIZEVALUE/, _pageSize)
                .replace(/_QS/, (config.queryStringParams ? '&'.concat(config.queryStringParams) : '' ) );
            
            var ajaxconfig = {
                type : 'GET',
                url  :  url,
                headers: config.headers,
                contentType: 'application/json'
            }

            var numberOfColumns = $(_thead).find('th').length
            var adiviceTD = $('<td>', { text: _defaultSettings.msgLoadOnServerPag, align: 'center', colspan: numberOfColumns }) 
            $(_tbody).empty();
            $(_tbody).append( $('<tr>').append( $(adiviceTD) ));

            $
            .ajax( ajaxconfig )
            .done(function( result, textStatus, jqXHR ) {

                var count      = _getWithProps( result.data[0], config.attributeTotalRows );
                _arrayOnScreen = _getWithProps( result.data[0], config.attributeData );                

                _totalPages  = Math.floor(count / _pageSize) + (count % _pageSize == 0 ? 0 : 1);

                _render( _arrayOnScreen );

                _afterPaginate(); 

            })
            .fail(function( jqXHR, textStatus, errorThrown ) {
                console.log(jqXHR);
                // 
                $(adiviceTD).text( _defaultSettings.msgErrorOnServerPag );
                $(_tbody).empty();
                $(_tbody).append( $('<tr>').append( $(adiviceTD) ));
            })
        }

        var _errorHandler = function(errs) {
            var msg = 'Error on datatable component, check list bellow:';
            $.each(errs, function() { msg = msg.concat('\n>>> ').concat(this); })
            //
            console.log( msg );
            alert( msg );
        }

        var _initialize  = function() {
            
            var setts  = $.extend(_defaultSettings, options);

            _ID              = $(_component).attr('id');
            _TYPE            = Array.isArray(setts.sourceData) ? 'MEMORY' : 'SERVER';

            _firstPageIsZero = setts.firstPageIsZero;
            _actions         = setts.actions;
            
            _allowCheckRows  = setts.allowCheckRows;
            _keyObject       = setts.keyObject;
            _checkObject     = setts.checkObject;
            _actions         = setts.actions;

            _sourceFields    = setts.sourceFields;
            _currentPage     = setts.currentPage;
            _pageSize        = setts.pageSize;
            
            // [INI] MONTAGEM BASE DA TABELA
            // VALIDATION
            var cols         = setts.sourceColumns;
            if (! Array.isArray(cols) || cols.length == 0) { _errorHandler(['sourceColumns must be array of column definitions']); }
            var errs = [];
            $.each(cols, function( index ) {
                if (!this.title || this.title == undefined) errs.push('Column index ' + index + ' must have title');
            });
            if (errs.length > 0) _errorHandler(errs);
            // CONSTRUCTION TABLE
            var tr = $('<tr>');
            $.each(cols, function( index ) {
                var th = $('<th>', {id: _ID.concat('-table-thead-th').concat(index+1) ,text: this.title});
                if (this.classType) {
                    $(th).addClass(this.classType);
                }
                $(tr).append( th );
            });
            _thead = $('<thead>');
            _tbody = $('<tbody>');
            _table = $('<table>');
            $(_thead).append( tr );
            $(_table).append( _thead );
            $(_table).append( _tbody );
            //CONSTRUCTION PAGINATION AREA
            var div = $('<div>', {class: _attributes.classDivDataPaginate});
            $(div).hide();

            var aFirst = $('<a>', {id:_attributes.idLinkFirst, class: _attributes.classLinkPagination }).append($('<span>',{ text: setts.LBLFirst }));
            var aPrevious = $('<a>', {id:_attributes.idLinkPrevious, class: _attributes.classLinkPagination }).append($('<span>',{ text: setts.LBLPrevious }));
            var aNext = $('<a>', {id:_attributes.idLinkNext, class: _attributes.classLinkPagination }).append($('<span>',{ text: setts.LBLNext }));
            var aLast = $('<a>', {id:_attributes.idLinkLast, class: _attributes.classLinkPagination }).append($('<span>',{ text: setts.LBLLast }));

            var inputPage = $('<input>', {id:_attributes.idInputPage, type:'number', min:1 });
            var inputTotalPages = $('<input>', {id:_attributes.idInputTotal, type:'number', disabled:true });

            $(div).append( aFirst );
            $(div).append( aPrevious );
            $(div).append( $('<span>', {text: setts.LBLPage , style:'margin: auto 5px'}));
            $(div).append( inputPage );
            $(div).append( $('<span>', {text: setts.LBLOf, style:'margin: auto 7px'}));
            $(div).append( inputTotalPages );
            $(div).append( $('<span>', {text:'',style:'margin: auto 5px'}));
            $(div).append( aNext );
            $(div).append( aLast );      

            $('#'.concat(_ID)).addClass( _attributes.classDivDataTable );
            $('#'.concat(_ID)).append(_table);
            $('#'.concat(_ID)).append(div);
            // [FIM] MONTAGEM BASE DA TABELA
            
            _inptPage  = $( _selectors.inputCurrentPage  );
            _inptTotal = $( _selectors.inputTotalPages );

            // INCLUDE OF CHECK COLUMN
            if (_allowCheckRows) { 
                _prepareCheckRows();
            }

            // INCLUDE OF ACTION COLUMN
            if (_actions.length > 0) {
                var th = $('<th/>',{class: _attributes.classActionColumn });
                $(th).append($('<span/>',{text: _attributes.textActionColumn }));
                $(_thead).find('tr').append( $(th) );
            }

            _sourceData     = null;
            if (_TYPE === 'MEMORY') { 
                _sourceData     = [].concat(setts.sourceData);
                _arrayOnScreen    = [].concat(_sourceData);
                //
                _currentRow     = (_currentPage * _pageSize) - _pageSize;
                _totalPages     = Math.floor(_arrayOnScreen.length / _pageSize) + (_arrayOnScreen.length % _pageSize == 0 ? 0 : 1);

                if ( $(_inptPage).attr('type') === 'number' ) {
                     $(_inptPage).attr('max', _totalPages);
                }

                if (_arrayOnScreen.length > 0) {
                    $(_inptPage).val( 1 );
                    $(_inptTotal).val( _totalPages );
                }

                _fisrtPage();
            }

            if (_TYPE === 'SERVER') {
                _sourceData = Object.assign( setts.sourceData );
                //
                var config  = _sourceData;
                var errs = [];
                if ( !config.url || config.url == undefined ) errs.push('url attribute is required');
                if ( !config.pageParam || config.pageParam == undefined ) errs.push('pageParam attribute is required');
                if ( !config.pageSizeParam || config.pageSizeParam == undefined ) errs.push('pageSizeParam attribute is required');
                if ( !config.attributeData || config.attributeData == undefined ) errs.push('attributeData attribute is required');
                if ( !config.attributeTotalRows || config.attributeTotalRows == undefined ) errs.push('attributeTotalRows attribute is required');
                if (errs.length > 0) {
                    _errorHandler( errs );
                    return _component;
                }

                _prepareRowsServer( config, _currentPage );
            }

            _prepareEvents();
                        
            return _component;
        }

        this.refresh = function( options ) {
            
            if (_TYPE === 'SERVER') {

                var newDataSourceInfo = Object.assign( options );

                _arrayOnScreen = [];
                _sourceData.queryStringParams = newDataSourceInfo.queryStringParams;
                
                $(_inptPage).val( 1 );
                $(_inptPage).prop('value', 1);

                _fisrtPage();

                return _component;
            }

            if (_TYPE === 'MEMORY') {
                if (options == null || options == undefined) {
                    throw new Error('options is required!');
                }
                
                if ($.isArray(options)) {
                                    
                    _sourceData = [].concat( options ) //DEFENSE PROG.
                    _totalPages = Math.floor(_sourceData.length / _pageSize) + (_sourceData.length % _pageSize == 0 ? 0 : 1);
        
                    if (_allowCheckRows) { 
                        $(_sourceData).each(function() { this['checked'] = false; });
                    }

                    _fisrtPage();

                    return _component;
                }
            }

            throw new Error('type must be defined');
        };

        this.getCheckedItens = function() {
            return [].concat(_arrayOfChecked);
        };

        return _initialize();
    };
}( jQuery ));