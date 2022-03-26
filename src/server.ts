import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import * as fs from 'fs';
import { resolve } from 'path';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req, res) => {
    let image_url = req.query.image_url
    let filePath: string

    if (!image_url.startsWith("public\\")) {
      return res.send("invalid image_url")
    }
    try {
      filePath = await filterImageFromURL(image_url)
    } catch (error) {
      return res.send(error)

    }



    res.sendFile(filePath, function (err) {
      if (err) {
        console.log(err)
      } else 
        deleteLocalFiles([filePath])
      }
    )

  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();

function getFiles(dir: string) {
  let stack = [resolve(dir)];
  let files: string[];
  while (stack.length) {
    dir = stack.pop();
    fs.readdirSync(dir).forEach(item => {
      const path = resolve(dir, item);
      (fs.statSync(path).isDirectory() ? stack : files).push(path);
    });
  }
  return files;
};