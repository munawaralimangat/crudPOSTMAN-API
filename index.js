const http = require('http');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dataFilePath = 'data.json';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/api/data' && req.method === 'GET') {
    fs.readFile(dataFilePath, 'utf8', (error, data) => {
      if (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });

    //POST

  } else if (req.url === '/api/data' && req.method === 'POST') {
    let requestBody = '';

    req.on('data', (chunk) => {
      requestBody += chunk.toString(); // collecting data from the request
    });

    req.on('end', () => {
      try {
        const jsonData = JSON.parse(requestBody); // store data
        const id = uuidv4(); // create id
        const newData = { id, ...jsonData }; // create new object with id and received data

        fs.readFile(dataFilePath, 'utf8', (error, data) => {
          let existingData = [];

          if (!error && data) {
            try {
              existingData = JSON.parse(data); // parse existing data if it exists and is valid json
              if (!Array.isArray(existingData)) {
                existingData = []; // initialize as an empty array if existingData is not an array
              }
            } catch (error) {
              existingData = []; // initialize as an empty array if existing data cannot be parsed as JSON
            }
          }

          existingData.push(newData); // add the new data to existingData array

          fs.writeFile(dataFilePath, JSON.stringify(existingData), 'utf8', (error) => {
            if (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal Server Error' }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(newData));
            }
          });
        });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });

    //PUT
    
  }else if(req.url.startsWith('/api/data') && req.method === 'PUT'){
    const id = req.url.split('/')[3];

    let requestBody = '';

    req.on('data',(chunk)=>{
        requestBody += chunk.toString(); //collect data from request
    });

    req.on('end',()=>{
        try{
            const jsonData = JSON.parse(requestBody);  //storing upadated data
            fs.readFile(dataFilePath,'utf8',(error,data)=>{
                if(error){
                    res.writeHead(500,{'content-type': 'application/json'});
                    res.end(JSON.stringify({error:'internal server error'}))
                }else{
                    let existingData = [];

                    if(data){
                        try{
                            existingData = JSON.parse(data);
                            if(!Array.isArray(existingData)){
                                existingData = []
                            }
                        }catch(error){
                            existingData = [];
                        }
                    }
                    const updatedDataIndex = existingData.findIndex(item => item.id === id);
                    if(updatedDataIndex !== -1){
                        const updatedData = {id,...jsonData};
                        existingData[updatedDataIndex]=updatedData;

                        fs.writeFile(dataFilePath,JSON.stringify(existingData),'utf8',(error)=>{
                            if(error){
                                res.writeHead(500,{'content type':'application/json'});
                                res.end(JSON.stringify({error:'internal server error'}))
                            }else{
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(updatedData));
                            }
                        });
                    }else{
                        res.writeHead(404,{'Content-Type':'application/json'});
                        res.end(JSON.stringify({error:'data not found'}))
                    }
                }
            });
        }catch(error){
            res.writeHead(400,{'Content-Type': 'application/json'});
            res.end(JSON.stringify({error:'invalid json data'}))
        }
    });

    //DELETE

  }else if(req.url.startsWith('/api/data/') && req.method === 'DELETE'){
    const id = req.url.split('/')[3];

    fs.readFile(dataFilePath,'utf8',(error,data)=>{
        if(error){
            res.writeHead(500,{'Content-Type':'application/json'});
            res.end(JSON.stringify({error:'internal server error'}))
        }else{
            let existingData = [];

            if(data){
                try{
                    existingData = JSON.parse(data);
                    if(!Array.isArray(existingData)){
                        existingData = []
                    }
                }catch (error){
                    existingData = []
                }
            }
            const deletedDataIndex = existingData.findIndex(item => item.id === id);
            if(deletedDataIndex !== -1){
                const deletedData = existingData.splice(deletedDataIndex,1);

                fs.writeFile(dataFilePath,JSON.stringify(existingData),'utf8',(error)=>{
                    if(error){
                        res.writeHead(500,{'Content-Type':'application/json'});
                        res.end(JSON.stringify({error:"internal server error"}))
                    }else{
                        res.writeHead(200,{'Content-type':'application/json'})
                        res.write("data deleted")
                        res.end(JSON.stringify(deletedData))
                    }
                })
            }else{
                res.writeHead(404,{'Content-Type':'application/json'});
                res.end(JSON.stringify({error:'data not found'}));
            }
        }

    });

  }// get method for a single data retrive
  // else if (req.method === 'GET') {
  //   const id = req.url.split('/')[3]; // Extract ID from URL

  //   fs.readFile(dataFilePath, 'utf8', (error, data) => {
  //     if (error) {
  //       res.writeHead(500, { 'Content-Type': 'application/json' });
  //       res.end(JSON.stringify({ error: 'Internal Server Error' }));
  //     } else {
  //       const parsedData = JSON.parse(data);
  //       const property = parsedData.find(item => item.id === id);

  //       if (property) {
  //         res.writeHead(200, { 'Content-Type': 'application/json' });
  //         res.end(JSON.stringify(property));
  //       } else {
  //         res.writeHead(404, { 'Content-Type': 'application/json' });
  //         res.end(JSON.stringify({ error: 'Property not found' }));
  //       }
  //     }
  //   });}
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(port, () => {
  console.log(`Server ${port} is running`);
});





