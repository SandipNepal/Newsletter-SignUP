const express = require("express");

const bodyParser = require("body-parser");

const https = require("https");

const app = express();

const mailchimp = require("@mailchimp/mailchimp_marketing");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: "removed_for_privacy_concerns",
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: "removed_for_privacy_concerns"
});

app.post("/", function(req, res) {
  //*****************************CHANGE THIS ACCORDING TO THE VALUES YOU HAVE ENTERED IN THE INPUT ATTRIBUTE IN HTML******************************
  const firstName = req.body.f;
  const secondName = req.body.l;
  const email = req.body.email;
  //*****************************ENTER YOU LIST ID HERE******************************
  const listId = "removed_for_privacy_concerns";
  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: secondName,
    email: email
  };
  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html")
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
 response.id
 }.`
    );
  }
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server started at port 3000");
});
