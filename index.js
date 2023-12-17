require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT
const routes = require('./routes')
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


app.use(cors())
app.use(bodyParser.json())
app.use('/api/v1', routes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
 })

//swagger

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
      description: "Best platform  app",
      license: {
        name: "zulfah",
        url: "",
      },
      contact: {
        name: "us",
        url: "",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1`,
        description: "Development server",
        },
        {
            url: `api.carbon-test.com`,
            description: "Prod server",
          },
    ],
  };

  const options = {
    swaggerDefinition,
    apis: [`./routes/*.js`],
  };
  const swaggerSpec = swaggerJSDoc(options);

 //app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use((req, res) => { 
    res.status(404).json({
        status: false,
        message: "Seems you are not in our planet"
    })
})


  //swagger
