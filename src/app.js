const { fstat } = require('fs')
const http = require('http')
const fs = require('fs')
const port = 3000
const Koa = require('koa')
const views = require('koa-views')
const accountsRouter = require('router') 

 function webApp(config, db) {
  const templateDir = process.cwd() + "/src";
  const render = views(templateDir, {
    extension: "html",
    map: { html: "nunjucks" },
    options: {
      nunjucks: { loader: templateDir },
    },
  });
  const app = new Koa();
  app.keys = ["foo"];
 app.use(accountsRouter.routes());
  app.context.render = render();
  app.use(serve(process.cwd() + "/src"));
}




const server = http.createServer(function(req,res){
res.writeHead(200,{'Content-Type' : 'text/html'})
fs.readFile('index.html',function(error,data){
if(error){
    res.writeHead(404)
    res.write('Error : File is not Found')
} else{
    res.write(data)
}
res.end()
})
//res.write('Unser Projekt')
}) 

server.listen(port,function(error){
if(error){
    console.log('Something went wrong',error)}
    else{
console.log('Server is listening on port ' + port)
    
}
})