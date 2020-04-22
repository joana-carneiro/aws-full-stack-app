import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET a filtered image passing a public URL --> /filteredimage?image_url={{URL}}
  // Try locally - happy flow: http://localhost:8082/filteredimage?image_url=https://exitoina.uol.com.br/media/_versions/babyyoda309850_widelg.jpg
  // Try locally - error: http://localhost:8082/filteredimage?image_url=https://timedotcom.files.wordpress.com/2019/03/kitten-report.jpg
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
  app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    let { image_url } = req.query;

    //validate the image_url query
    if ( !image_url ) {
      return res.status(400)
          .send(`Image URL is required!`);
    }

    //call filterImageFromURL(image_url) to filter the image
    let filteredImage = await filterImageFromURL(image_url).catch(() => {});

    // send the resulting file in the response
    // deletes any files on the server on finish of the response
    return res.sendFile(filteredImage, resolve =>
        deleteLocalFiles([filteredImage]));

  } );

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
