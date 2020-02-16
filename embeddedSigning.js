const express = require('express');
const docusign = require('docusign-esign');
const path = require('path');
const apiClient = new docusign.ApiClient();
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const fs = require('fs');

//On execution an envelope is sent to the provided email address, one signHere
//tab is added, the document supplied in workingdirectory\fileName is used.
//Open a new browser pointed at http://localhost:3000 to execute.
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

//Fill in your token / ID / recipient / Filename Here

//Obtain an OAuth token from https://developers.docusign.com/oauth-token-generator
//Obtain your accountId from account-d.docusign.com > Go To Admin > API and Keys

// const OAuthToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwAAsZV-35nWSAgAAPG4jCKa1kgCAGBu6J-HX45FpTYdVXSE3uUVAAEAAAAYAAEAAAAFAAAADQAkAAAAZjBmMjdmMGUtODU3ZC00YTcxLWE0ZGEtMzJjZWNhZTNhOTc4EgABAAAACwAAAGludGVyYWN0aXZlMACAGv1935nWSDcA-_hnj_5Lm0-SAhEQzwcUyg.Q8UQZUxai2WxFmoN8vJBi9cxmUUgE1Eg8EPM-P4EMzY6johjaq7fYmUVRFHnq731mQqh8URduzWBz4uJP2blL-WJJzkPYRNYKOEcs4U1sIPmqZ1Tk3vW19wPbow2RbdpBHaFA9zyL1u-c1fBDqTzRzkcG9herOzM9czE6pBxQqcA9M3NZDNbUrxxc6Q5qBWhUEmouIMEXtdMHT9SknAbmFRZH_rFlenHqRHCq2j4qTB8u4hQTzp6NpGfQWIZ1iXOpYE4CAA22CVNzk3cRdjJtm8Ia_pUJy1PLjmi7gC986xAj64Wel1lmpDsJ0dVbp7Am6SUXJCAFEgQjejEbhrS3g';
// const OAuthToken = 'eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwAAJ5Dh9OzWSAgAAGez7zft1kgCAGBu6J-HX45FpTYdVXSE3uUVAAEAAAAYAAkAAAAFAAAAKwAAAC0AAAAvAAAAMQAAADIAAAA4AAAAMwAAADUAAAANACQAAABmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgSAAEAAAALAAAAaW50ZXJhY3RpdmUwAAD6XuD07NZINwDnlbHeHXOAS7fUyFvGfQNF.zuVkC30oi8qd9E-_g5j0I8KbxETs756FTlHu3rPVvt2Z3j5nmWe4Z75DWnLHw7oEUAKBtHqPf8mEIyCDbf9tFIghNUnbP6JbEsD4XhUcFdP7FLQjVTDv2H083cPxOvnc1alCZ5sdPkBDzRdCP3j_BHXfWBxRNY47YKNDUrCl8kbj5Kt9Y1x74E8kSHKCo_7_tORKuKGJvreexlqw0E4U8YkYYTxRvyW9_a0hX40IGrj9lODCbStHfjP-7ZPGFZnK-VBSyksJjHqF9R4iGaBDk3UJWNzmb5CgTQsHjaCX3eJjtlUs4ctY88oHrcFVB-gSeSMTIRNg30QLlByJyNEOuQ';
// const accountId = 'f5afd249-305e-4cc8-a456-d16380991b61';
// const accountId = '9fe86e60-5f87-458e-a536-1d557484dee5';
const OAuthToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjY4MTg1ZmYxLTRlNTEtNGNlOS1hZjFjLTY4OTgxMjIwMzMxNyJ9.eyJUb2tlblR5cGUiOjUsIklzc3VlSW5zdGFudCI6MTU4MTgyMzc3OSwiZXhwIjoxNTgxODUyNTc5LCJVc2VySWQiOiI5ZmU4NmU2MC01Zjg3LTQ1OGUtYTUzNi0xZDU1NzQ4NGRlZTUiLCJzaXRlaWQiOjEsInNjcCI6WyJzaWduYXR1cmUiLCJjbGljay5tYW5hZ2UiLCJvcmdhbml6YXRpb25fcmVhZCIsInJvb21fZm9ybXMiLCJncm91cF9yZWFkIiwicGVybWlzc2lvbl9yZWFkIiwidXNlcl9yZWFkIiwidXNlcl93cml0ZSIsImFjY291bnRfcmVhZCIsImRvbWFpbl9yZWFkIiwiaWRlbnRpdHlfcHJvdmlkZXJfcmVhZCIsImR0ci5yb29tcy5yZWFkIiwiZHRyLnJvb21zLndyaXRlIiwiZHRyLmRvY3VtZW50cy5yZWFkIiwiZHRyLmRvY3VtZW50cy53cml0ZSIsImR0ci5wcm9maWxlLnJlYWQiLCJkdHIucHJvZmlsZS53cml0ZSIsImR0ci5jb21wYW55LnJlYWQiLCJkdHIuY29tcGFueS53cml0ZSJdLCJhdWQiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJhenAiOiJmMGYyN2YwZS04NTdkLTRhNzEtYTRkYS0zMmNlY2FlM2E5NzgiLCJpc3MiOiJodHRwczovL2FjY291bnQtZC5kb2N1c2lnbi5jb20vIiwic3ViIjoiOWZlODZlNjAtNWY4Ny00NThlLWE1MzYtMWQ1NTc0ODRkZWU1IiwiYW1yIjpbImludGVyYWN0aXZlIl0sImF1dGhfdGltZSI6MTU4MTgyMzc3OCwicHdpZCI6IjlkYjE1YWI1LWE2ZWMtNDhkNS1hZDM3LTczMGMzZDNjYTViZiJ9.31vrLSfZK3wp_S6Mmz1BCkhHupagI2i5Qpm-fZxMIUcTYve3zyi3Qk-jjtO1j87ZxJtrOdeueRIizeR3R6M5A726kU5VCu0U8c8S0v9AtUytEwSGZ16Ax0VlqhAv9ecTBEJIqxyoHQKmC4kAMhyHMoO2aJ1xisJXBaGc4xOg-GLGHTvekB0A2KJXrpqo-IcZvH16RlnTkG-_Q1jYzldY5cdoUXt9CPpH_j3wjtM8ObKYhhuJ4SK68G9si9kJ0PWoJSBeScDMn4sJyBXWW13S7RZIbOowSgvpHCakSQioc3I0kgQ5pIXvv1URzl9UQbz0KhKy_hdTYapVc3ImuQ6vXw';
const accountId = 'f5afd249-305e-4cc8-a456-d16380991b61';

//Recipient Information goes here
const recipientName = 'mario mui';
const recipientEmail = 'yi.kan.mui@gmail.com';

//Point this to the document you wish to send's location on the local machine. Default location is __workingDir\fileName
const fileName = 'docs/House.pdf';

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

app.get('/', function(req, res) {
  apiClient.setBasePath('https://demo.docusign.net/restapi');
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + OAuthToken);

  // *** Begin envelope creation ***

  //Read the file you wish to send from the local machine.
  fileStream = process.argv[2];
  pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName));
  pdfBase64 = pdfBytes.toString('base64');

  docusign.Configuration.default.setDefaultApiClient(apiClient);

  let envDef = new docusign.EnvelopeDefinition();

  //Set the Email Subject line and email message
  envDef.emailSubject = 'Please sign this document sent from Node SDK';
  envDef.emailBlurb =
    'Please sign this document sent from the DocuSign Node.JS SDK.';

  //Read the file from the document and convert it to a Base64String
  let doc = new docusign.Document();
  doc.documentBase64 = pdfBase64;
  doc.fileExtension = 'pdf';
  doc.name = 'Node Doc Send Sample';
  doc.documentId = '1';

  //Push the doc to the documents array.
  let docs = [];
  docs.push(doc);
  envDef.documents = docs;

  //Create the signer with the previously provided name / email address
  let signer = new docusign.Signer();
  signer.name = recipientName;
  signer.email = recipientEmail;
  signer.routingOrder = '1';
  signer.recipientId = '1';
  signer.clientUserId = '123'; //ClientUserId specifies that a recipient is captive. It ties to a generic DocuSign account and cannot be referenced without generating a recipient token.

  //Create a tabs object and a signHere tab to be placed on the envelope
  let tabs = new docusign.Tabs();

  let signHere = new docusign.SignHere();
  signHere.documentId = '1';
  signHere.pageNumber = '1';
  signHere.recipientId = '1';
  signHere.tabLabel = 'SignHereTab';
  signHere.xPosition = '50';
  signHere.yPosition = '50';

  //Create the array for SignHere tabs, then add it to the general tab array
  signHereTabArray = [];
  signHereTabArray.push(signHere);

  tabs.signHereTabs = signHereTabArray;

  //Then set the recipient, named signer, tabs to the previously created tab array
  signer.tabs = tabs;

  //Add the signer to the signers array
  let signers = [];
  signers.push(signer);

  //Envelope status for drafts is created, set to sent if wanting to send the envelope right away
  envDef.status = 'sent';

  //Create the general recipients object, then set the signers to the signer array just created
  let recipients = new docusign.Recipients();
  recipients.signers = signers;

  //Then add the recipients object to the enevelope definitions
  envDef.recipients = recipients;

  // *** End envelope creation ***

  //Send the envelope
  let envelopesApi = new docusign.EnvelopesApi();
  envelopesApi.createEnvelope(
    accountId,
    { envelopeDefinition: envDef },
    function(err, envelopeSummary, response) {
      if (err) {
        return res.send('Error while creating a DocuSign envelope:' + err);
      }
      //Set envelopeId the envelopeId that was just created
      let envelopeId = envelopeSummary.envelopeId;

      //Fill out the recipient View request. authenticationMethod should be email. ClientUserId, RecipientId, returnUrl, userName (Full name of the signer), and email are required.
      //If a clientUserId was not specified, leave it out.
      let recipientViewRequest = new docusign.RecipientViewRequest();
      recipientViewRequest.authenticationMethod = 'email';
      recipientViewRequest.clientUserId = '123';
      recipientViewRequest.recipientId = '1';
      recipientViewRequest.returnUrl = 'http://localhost:3000/dsreturn';
      recipientViewRequest.userName = recipientName;
      recipientViewRequest.email = recipientEmail;

      //Create the variable used to handle the response
      recipientViewResults = docusign.ViewLinkRequest();

      //Make the request for a recipient view
      envelopesApi.createRecipientView(
        accountId,
        envelopeId,
        { recipientViewRequest: recipientViewRequest },
        function(err, recipientViewResults, response) {
          if (err) {
            return res.send(
              'Error while creating a DocuSign recipient view:' + err
            );
          }

          //Set the signingUrl variable to the link returned from the CreateRecipientView request
          let signingUrl = recipientViewResults.url;

          //Then redirect to the signing URL
          res.redirect(signingUrl);
        }
      );
    }
  );
});

app.get('/dsreturn', function(req, res) {
  //Enter code here for post-processing after enevelope signing has been completed.
  res.send('Welcome back, enter followup code / processing information here.');
});

app.listen(port, host, function(err) {
  if (err) {
    return res.send('Error while starting the server:' + err);
  }

  console.log('Your server is running on http://' + host + ':' + port + '.');
});
