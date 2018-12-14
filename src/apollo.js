// https://www.apollographql.com/
import { ApolloClient } from "apollo-client"; 
import { InMemoryCache } from "apollo-cache-inmemory";
// https://www.apollographql.com/docs/react/advanced/caching.html
import { withClientState } from "apollo-link-state";
import { ApolloLink } from "apollo-link";
import { typeDefs, defaults, resolvers} from "./clientState";

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  typeDefs,
  defaults,
  resolvers
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink])
});

export default client;