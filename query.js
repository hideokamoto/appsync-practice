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
const queryName1 = 'listNameTheShows'
const query1 = gql(`
query ${queryName1} {
  ${queryName1} {
    items {
      id
      attributes {
        hintsPurchased
        hintsUsed
      }
    }
  }
}`);
const queryName2 = 'getNameTheShow'
const query2 = gql(`
query ${queryName2}($id: String!) {
  ${queryName2}(id: $id) {
    id
    attributes {
      hintsPurchased
      hintsUsed
    }
  }
}`);
const variables2 = {
  id: "amzn1.ask.account.EXAMPLE"
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


const queryListItems = async (queryName, query) => {
  const client = await appSyncClient.hydrated()
  const params = {query}
  const { data } = await client.query(params)
  const { items } = data[queryName]
  console.log(`====${queryName}====`)
  items.forEach(item => console.log(item))
};


const queryGetItem = async (queryName, query, variables = {}) => {
  const client = await appSyncClient.hydrated()
  const params = {query}
  if (Object.keys(variables).length > 0) params.variables = variables
  const { data } = await client.query(params)
  const item = data[queryName]
  console.log(`====${queryName}====`)
  console.log(item)
};


queryListItems(queryName1, query1)
  .then(() => queryGetItem(queryName2, query2, variables2))
  .catch(e => console.log(e))