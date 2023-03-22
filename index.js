const fs = require("fs")
const http = require("http")
const url = require("url")
const slugify = require('slugify')


//////////////////////////////////////
//Files
/*
const textIn = fs.readFileSync("./txt/input.txt","utf-8")
console.log(textIn);

const textOut = `This is what we know about avocado : ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt",textOut);
console.log("Written Successfully!");*/
//////////////////////////////////////

//Server
const replaceTemplate = (temp,product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image)
    output = output.replace(/{%PRICE%}/g,product.price)
    output = output.replace(/{%FROM%}/g,product.from)
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients)
    output = output.replace(/{%QUANTITY%}/g,product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g,product.description)
    output = output.replace(/{%ID%}/g,product.id )

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic' )

    return output

}
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,"utf-8");

const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,"utf-8");
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,"utf-8");
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,"utf-8");

const dataObj = JSON.parse(data)

console.log(slugify("Fresh Avacados",{
    lower:true
}));

const server = http.createServer((req,res)=>{
    //const pathname = req.url
    //console.log(req.url);
    const {query,pathname}= url.parse(req.url,true);
    console.log(pathname);
    //Overview Page

    if( pathname==="/" || pathname === "/overview"){
        res.writeHead(200,{'Content-type': 'text/html'})

        const cardsHTML = dataObj.map(el=> replaceTemplate(templateCard,el)).join('');
        //console.log(cardsHTML);

        const output  = templateOverview.replace('{%PRODUCT_CARDS%}',cardsHTML)
        res.end(output )

        //API
    }
    else if(pathname === "/api"){
       res.writeHead(200,{'Content-type': 'text/html'})
       res.end(templateCard)
    
        //Product Page
    }
    else if(pathname === "/product"){
        
        res.writeHead(200,{'Content-type': 'text/html'})
        //console.log(query);
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct,product)
        res.end(output)
    //Error Page
    }
    else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header' : 'hello',
        });
        res.end("<h1>Error 404</h1>")
    }
    
})
 
server.listen(8000,"127.0.0.1",()=>{
    console.log("Listneing to request on port 8000")
})


