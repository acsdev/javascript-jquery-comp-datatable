# Pagination component built on jquery
It is a simple jquery component to paginate data

* Features
	* Json as source of data (pretty good to work with **RESTServices**)
	* Memory pagination
	* Server pagination (to mock server pagination is necessary start nodejs in **server folder**)
	* Provide multi-select rows
	* Capable to read nested json attributes
    
Samples of how to use can be found in **data-table.sample.js**

#### History of changes
* version 2.0.3
	* bugfixes
	* new option (_fetchOnMount default:true)
		if value set to **false** datatable will wait for you use **refresh method** to fetch data
