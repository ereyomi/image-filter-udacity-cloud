import express from 'express';
import bodyParser from 'body-parser';
import {
  filterImageFromURL,
  deleteLocalFiles,
  isUrlValidForUse,
} from './util/util';

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

  /* http://localhost:8082/filteredimage?image_url=https://cdn.britannica.com/09/75509-050-86D8CBBF/Albert-Einstein.jpg?w=400&h=300&c=crop */
  app.get('/filteredimage', async (req, res) => {
    if (req.query && !req.query.image_url) {
      return res.status(400).send({
        message: 'try GET /filteredimage?image_url={{}}',
      });
    }
    const imgUrl: string = String(req.query.image_url);
    if (!isUrlValidForUse(imgUrl)) {
      return res.status(400).send({
        message: 'invalid url. Please provide valid image url',
      });
    }
    try {
      const filterImg: string = await filterImageFromURL(imgUrl);
      return res.sendFile(filterImg, async () => {
        await deleteLocalFiles([filterImg]);
      });
    } catch (_error) {
      return res.status(400).send({
        message: 'unable to process image',
      });
    }
  });

  //! END @TODO

  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', async (req, res) => {
    res.send('try GET /filteredimage?image_url={{}}');
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
