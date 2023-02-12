export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "oktankcontent9dbeef0e": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "oktankcontent": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "analytics": {
        "oktankcontentKinesis": {
            "kinesisStreamArn": "string",
            "kinesisStreamId": "string",
            "kinesisStreamShardCount": "string"
        }
    },
    "function": {
        "oktankcontentrecommendgraphql": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    }
}