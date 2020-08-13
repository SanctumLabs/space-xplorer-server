export default `
    type Mutation {

        # if false, signup failed -- check errors
        bookTrips(launchIds: [ID]!): TripUpdateResponse!

        # if false, cancellation failed -- check errors
        cancelTrip(launchId: ID!): TripUpdateResponse!
        
        signUp(email: String): User!
        
        login(email: String): User!

        uploadProfileImage(file: Upload!): User
    }
    
    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }
`;
