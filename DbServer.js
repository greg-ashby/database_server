var http = require('http');

const GENERIC_ERROR = "Invalid URL. Please ensure you use either /get?key=somekey or /set?somekey=somevalue.";
const PORT = 4000;
db = {};

/**
* Takes a simple URL and returns an array with a key [0] and val [1].
*
* @param url - assumes this is a URL that's already confirmed to start with
*              /get?key= or /set? and has a valid queryString
*/
function get_params(url){
  queryString = url.substring(5);
  tokens = queryString.split("=", 2); //use only first key=val of query string
  if(tokens.length != 2){
    throw "invalid query string name-value pair";
  } else {
    return tokens;
  }
}

function requestHandler(request, response){
  url = request.url;
  try{
    if(url.substring(0, 9) === '/get?key='){
      nameValuePair = get_params(url);
      value = db[nameValuePair[1]];
      response.end("Current value for " + nameValuePair[1] + ": " + value);
    } else if (url.substring(0, 5) === '/set?') {
      nameValuePair = get_params(url);
      db[nameValuePair[0]] = nameValuePair[1];
      response.end("Stored [" + nameValuePair[1] + "] for key: " + nameValuePair[0]);
    } else {
      console.log(url);
      response.end(GENERIC_ERROR);
    }
  } catch (err) {
    console.log("ERROR: URL is " + url + " - Message is " + err);
    response.end(GENERIC_ERROR);
  }
}

var server = http.createServer(requestHandler);

server.listen(PORT, function(){
  console.log("Server listening on http://localhost: " + PORT);
});
