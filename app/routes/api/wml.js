// 1. Import dependencies
const express = require("express");
const router = express.Router();
const request = require("request-promise");
const utils = require("../../utils/utils");
const fields = utils.fields;
const accountMap = utils.accountMap;

// 2. Setup router
router.post("/score", async (req, res) => {
  // Get access token for WML
  const options = {
    method: "POST",
    url: process.env.AUTH_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      apikey: process.env.WML_API_KEY,
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
    },
  };

  let response = "";
  let access_token = "";

  try {
    response = await request(options);
    access_token = JSON.parse(response)["access_token"];
    // res.send(access_token);
  } catch (err) {
    console.log(err);
    res.send(err);
  }

  // Make a scoring request
  const { year, month, costCentre, account } = req.body;
  console.log(year, month, costCentre, account);

  // population template
  const template = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  template[fields.findIndex((val) => val === `Year_${year}`)] = 1;

  template[fields.findIndex((val) => val === `Month_${month}`)] = 1;

  template[fields.findIndex((val) => val === `Account_ACC${account}`)] = 1;

  template[fields.findIndex((val) => val === `Cost Centre_${costCentre}`)] = 1;

  template[
    fields.findIndex((val) => val === `Account type_${accountMap[account]}`)
  ] = 1;

  //res.send({ fields: fields, template: template });

  // Score
  let scoring_options = {
    method: "POST",
    url: `${process.env.WML_SCORING_URL}?version=2023-05-29`,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
      "ML-Instance-ID": process.env.WML_INSTANCE_ID,
    },
    body: JSON.stringify({
      input_data: [
        {
          fields: fields,
          values: [template],
        },
      ],
    }),
  };

  let scoring_respose = "";
  try {
    scoring_options = await request(scoring_options);
    res.send(scoring_options);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
