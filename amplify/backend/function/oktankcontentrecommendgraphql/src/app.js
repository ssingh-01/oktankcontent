const AWS = require("aws-sdk");
const awsConfig = new AWS.Config({ region: process.env.REGION });

const connectToPersonalize = (event) => {
  const filterName = '"' + event.arguments.name + '"';
  const personalizeParams = {
    campaignArn: process.env.PERSONALIZE_CAMPAIGN_ARN,
    numResults: "3",
    userId: event.arguments.userId,
    filterArn: "arn:aws:personalize:us-east-1:101390875088:filter/exclude-item",
    filterValues: { name: filterName },
  };
  return personalizeParams;
};

const getBusinessData = (itemList) => {
  return itemList.map(function (item) {
    const dynamodb = new AWS.DynamoDB(awsConfig);
    const dynamodbParams = {
      TableName: process.env.API_OKTANKCONTENT_CONTENTTABLE_NAME,
      Key: { id: { S: item.itemId } },
      AttributesToGet: ["id", "name", "category", "createdAt", "updatedAt"],
    };
    return dynamodb.getItem(dynamodbParams).promise();
  });
};

const resolveOutput = (resolvedRecommendedItems) => {
  return resolvedRecommendedItems.map((item) => {
    return {
      id: item.Item.id.S,
      name: item.Item.name.S,
      category: item.Item.category.S,
      createdAt: item.Item.createdAt.S,
      updatedAt: item.Item.updatedAt.S,
    };
  });
};

module.exports = {
  connectToPersonalize: connectToPersonalize,
  resolveOutput: resolveOutput,
  getBusinessData: getBusinessData,
};
