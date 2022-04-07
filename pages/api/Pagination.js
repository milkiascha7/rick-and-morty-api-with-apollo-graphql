import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
    uri:'https://rickandmortyapi.com/graphql',
    cache:new InMemoryCache()
});
export default async( req, res) => {
    const page = req.body

    try{
        const { data } = await client.query({
            query: gql`
                query ($page: Int ) {
                    characters(page: "${page}" ) {
                        info {
                            next
                            prev
                            count
                            pages
                        }
                        
                        results {
                            name
                            id
                        location {
                            name
                        }
                        origin {
                            id
                            name
                        }
                        episode {
                            id
                            episode
                            air_date
                        }
                        image
                        }
                    }
                }

            `
        });
        res.status(200).json({characters: data?.characters?.info, error:null })

    }
    catch(error){
        if(error.message(400).json({})){
            if(error.message === '404:Not found'){
                res.status(400).json({characters:null, error:"No characters found..." })
            }
            else{
                res.status(500).json({characters: null, error: "Internal error, please try again"})
            }
        }
    }
}