//importing modules
const http = require("http");
const url = require("url");
const fs = require("fs");

//functions
const replaceTemplate = (temp, product) =>{
    //getting the data.json information and passing to the html templates
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
};


//loading template overview
const TempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,"utf-8");
const TempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,"utf-8");
const TempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,"utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");
const DataObj = JSON.parse(data);



//create a server and start 
const server = http.createServer((req,res) =>{
 
    const {query, pathname} = url.parse(req.url,true);

    //implementing routing
    if(pathname === "/" || pathname === "/overview")
    {
        //passing the html type
        res.writeHead(200,{'content-type':'text/html'});

        //mapping parsed json - lopping each card. and putting into a string
        const cardsHtml = DataObj.map(el => replaceTemplate(TempCard, el)).join('');

        const output = TempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);

        res.end(output);
      
    } 
    //api page
    else if(pathname === "/api")
    {

        //passing the json type
        res.writeHead(200,{'content-type':'application/json'});
        //sending data
        res.end(data);
    }
    //product page
    else if(pathname === "/product")
    {
        res.writeHead(200,{'content-type':'text/html'});

        //array based on query id - obj
        const product = DataObj[query.id];

        //loading template-product - based on the product id
        const output = replaceTemplate(TempProduct,product);

        res.end(output);
    }
    //not found page
    else{
        //sending status code to it
        res.writeHead(404,{
            //sending a header - information about response
            'Content-type' : 'text/html',
            'my-own-header':  'hello-world'
        });
        res.end("<h1>Page not Found!</h1>");
    }

});

//starting up the server (for incoming requests)
server.listen(8000,'127.0.0.1', () => {
    console.log("listeining to requests on port 8000");
    console.log("\nAccess address = http://127.0.0.1:8000/\n");
});

//we use express.js to get a better routing system.

//simple routing. - importing url 
