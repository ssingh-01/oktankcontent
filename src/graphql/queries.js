/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRecommendations = /* GraphQL */ `
  query GetRecommendations($userId: String, $name: String) {
    getRecommendations(userId: $userId, name: $name) {
      id
      name
      category
      contentType
      desc
      likes
      createdAt
      updatedAt
    }
  }
`;
export const getContent = /* GraphQL */ `
  query GetContent($id: ID!) {
    getContent(id: $id) {
      id
      name
      category
      contentType
      desc
      likes
      createdAt
      updatedAt
    }
  }
`;
export const listContents = /* GraphQL */ `
  query ListContents(
    $filter: ModelContentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        category
        contentType
        desc
        likes
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
