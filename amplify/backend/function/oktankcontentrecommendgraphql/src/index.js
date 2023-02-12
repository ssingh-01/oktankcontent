const AWS = require("aws-sdk");
const awsConfig = new AWS.Config({ region: process.env.REGION });
const appModule = require("./app.js");

exports.handler = async (event) => {
  const personalizeParams = appModule.connectToPersonalize(event);

  const personalizeruntime = new AWS.PersonalizeRuntime(awsConfig);

  const data = await personalizeruntime
    .getRecommendations(personalizeParams)
    .promise();

  const itemList = data.itemList;

  const recommendedItems = appModule.getBusinessData(itemList);
  const resolvedRecommendedItems = await Promise.all(recommendedItems);

  const result = appModule.resolveOutput(resolvedRecommendedItems);

  return result;
};
