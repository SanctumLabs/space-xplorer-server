export default `
  type User {
    id: ID!
    email: String!
    profileImage: String
    trips: [Launch]!
    token: String
  }
`;
