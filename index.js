// Imports:
const fs = require('fs');
const http = require('http');
const url = require('url');

// 
const tempOverview = fs.readFileSync(`${__dirname}/templates/index.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/blogCard.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/blogPage.html`, 'utf-8');

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%HEADING%}/g, product.heading);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%AUTHOR%}/g, product.author);
    output = output.replace(/{%DATE%}/g, product.date);
    output = output.replace(/{%TAG%}/g, product.tag);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
};

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// SERVER
const server = http.createServer((req, res) => {
    const pathName = req.url;

    // Overview page
    if(pathName === '/' || pathName === '/index'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%BLOG_CARD%}', cardsHtml);
        res.end(output);

    // Products page
    } else if(pathName === '/products'){
        res.end("Products page");

    // API
    } else if(pathName === '/api'){
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);

    // Not Found
    } else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>')
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000');
});
