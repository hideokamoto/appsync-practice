require('isomorphic-fetch');
// Require AppSync module
const gql = require('graphql-tag');
const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;

// Secrets
const APIKey = process.env.API_KEY
const REGION = process.env.AWS_REGION
const URL = process.env.API_URL

// Import gql helper and craft a GraphQL query
const mutationName1 = 'createNameTheShow'
const mutationItem1 = gql(`
mutation createNameTheShow($createnametheshowinput: CreateNameTheShowInput!) {
  createNameTheShow(input: $createnametheshowinput) {
    id
    attributes {
      hintsUsed
      hintsPurchased
    }
  }
}
`);
const variables1 = {
  "createnametheshowinput": {
    "id": "amzn1.ask.account.EXAMPLE1",
    "attributes": {
      "hintsPurchased": 10
    }
  }
}
const mutationName2 = 'updateNameTheShow'
const mutationItem2 = gql(`
mutation updateNameTheShow($createnametheshowinput: UpdateNameTheShowInput!) {
  updateNameTheShow(input: $createnametheshowinput) {
    id
    attributes {
      hintsUsed
      hintsPurchased
    }
  }
}`);
const variables2 = {
  "createnametheshowinput": {
    "id": "amzn1.ask.account.EXAMPLE",
    "attributes": {
      "hintsUsed": 10,
      "hintsPurchased": 11
    }
  }
}


// Set up Apollo client
const appSyncClient = new AWSAppSyncClient({
    url: URL,
    region: REGION,
    auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: APIKey
    },
    disableOffline: true
});

const mutateItem = async (name, item, variables) => {
  const params = {
    mutation: item,
    variables
  }
  const { data } = await appSyncClient.mutate(params)
  console.log(`====${name}====`)
  console.log(data[name])
};


mutateItem(mutationName1, mutationItem1, variables1)
  .then(() => mutateItem(mutationName2, mutationItem2, variables2))
  .catch(e => console.log(e))