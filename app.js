const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// dialogflow will call the below route from the getStore intent
app.post("/dialogflow-fulfillment", (request, response) => {
  dialogflowFulfillment(request, response);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// method which will be called when the webhook is hit
const dialogflowFulfillment = (request, response) => {
  const agent = new WebhookClient({ request, response });
  // method to handle the getStore Intent
  function getStoreHandler(agent) {
    let store = request.body.queryResult.parameters.store;
    let product = agent.context.get("awaiting_store").parameters.product;
    let strResponse = "";
    let followupQuestion = " Was there anything else I can help you with?";

    if (store == "Surry Hills" && product == "bananas") {
      strResponse =
        "Thanks we have 30 " +
        product +
        " in stock at our " +
        store +
        " Store.";
      strResponse = strResponse + followupQuestion;
      agent.add(strResponse);
    } else if (store == "Parramatta" && product == "apples") {
      strResponse =
        "Thanks we have 50 " +
        product +
        " in stock at our " +
        store +
        " Store.";
      strResponse = strResponse + followupQuestion;
      agent.add(strResponse);
    }
  }

  let intentMap = new Map();
  // below code is to map the intent with the method
  // that will be called when the Intent gets called
  intentMap.set("getStore", getStoreHandler);
  agent.handleRequest(intentMap);
};
