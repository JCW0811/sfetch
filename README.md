# Sfetch

- package [fetch](http://github.github.io/fetch/ "fetch")

- response add field **'json'** to save backend data otherwise add field **'text'**

- body make **object** to JSON.stringify(object)

- body suppport FormData or JSON (use FormData set daetaType:'formdata')

- method support **GET POST PATH DELETE**

- support timeout (default not set)

- support header (but fetch Request header field Authorization is not allowed)

## Usage

`    npm install sfetch --save`

`	import sfetch from 'sfetch'`

## Example

####  GET
       sfetch.get({
            url: url,
            body: body,//Object
	        timeout: 5000
        }).then((response) => {
        //response include 'json' field
        },(response)=>{
        //response include 'text' field
	    });
#### POST
         sfetch.post({
             url: url,
             body: body,//Object or FormData
             dataType : 'formdata',// body is FormData
			   timeout: 5000
         }).then((response) => {
             //response include 'json' field
          },(response)=>{
             //response include 'text' field
          });
#### PATH
###### the same as POST
#### DELETE
###### the same as POST


