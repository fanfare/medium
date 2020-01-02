const http = require('http')
const port = '3528'
const read = require('node-readability')
const app = new http.Server()

function scrape(url) { 
  return new Promise((resolve, reject) => {
    read(url, function(err, article, meta) {
      if (err) {
        resolve({content:"error", title:"500"})
        return
      }
      resolve({content:article.content, title:article.title})
    })
  })
}

app.on('request', async function(req, res){
  let url = req.url.slice(1)
  console.log(url)
  if ( url.substring(0,19) === "https://medium.com/"
    || url.substring(0,18) === "http://medium.com/" 
    || url.substring(0,23) === "https://www.medium.com/"
    || url.substring(0,22) === "http://www.medium.com/" ) {
    let html = `
      <!DOCTYPE HTML>
      <html>
      <head>
      <meta charset="UTF-8">
      </head>
      <body>
    `
    let results = await scrape(url)
    console.log(results)
    html += `<h2>${results.title}</h2><hr>`
    html += results.content
    html += `
      </body>
      </html>
    `
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html)
    return
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('not found')  
    return
  }
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})