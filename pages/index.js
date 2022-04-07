import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Head from 'next/head'
import Image from 'next/image'
import React, {useState} from 'react'
import { Box, Flex, Heading, Input, Stack, IconButton, useToast } from '@chakra-ui/react'
import Character from '../components/Character'
import { ArrowBackIcon, ArrowForwardIcon, SearchIcon, CloseIcon } from '@chakra-ui/icons'


export default function Home(results) {
  
  const initialState = results
  const [character, setCharacter] = useState(initialState.characters)
  const [prevPage, setPrevPage] = useState(null)
  const [nextPage, setNextPage] = useState(null)


  const [search, setSearch] = useState("")
  const toast = useToast()
  
  return (
    <Flex dir='column' justify="center" align="center" >
      <Head>
        <title>Rick and Morty Api Project</title>
  
      </Head>

      <Box mb={4} flexDir="column" align="center" py={8}>
        <Heading as="h1" size="2xl" mb={8}> Rick and Morty</Heading>
        <form onSubmit={ async (event) => {
            event.preventDefault()
            const results = await fetch("/api/SearchCharacter", {
              method:"post",
              body: search,
            })
            const {characters, error} = await results.json()
            if(error){
              toast({
                position:'bottom',
                title:"An error has occured",
                description:error,
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            } else{
              setCharacter(characters)
            }
          }
        }>
          <Stack maxW="350px" width="100%" isInline mb={8} >
            <Input value={search} placeholder="Search" border="none" onChange={(e) => setSearch(e.target.value)} />
            <IconButton colorScheme="blue" arial-label="Search Database" icon={<SearchIcon />} disabled={search === ""} type="submit" />
            <IconButton colorScheme="red" aria-label="Reset Button" icon={<CloseIcon />}  disabled={search === ""} 
              onClick={ async () => {
                setSearch("")
                setCharacter(initialState.characters)
            }} />
            </Stack>
        </form>
        <Character character={character} />
        <Stack maxW="350px" width="100%" isInline mb={8} >
        <IconButton colorScheme="blue" arial-label="Prev Page" icon={<ArrowBackIcon />} disabled={prevPage === null} type="submit"
          onClick={async (e) => {
            // e.preventDefault()
            const page = await get("/api/Pagination", {
              method:"get",
              body: next,
            })
            const {info, error} = await page.json()
            if(error){
              toast({
                position:'bottom',
                title:"An error has occured",
                description:error,
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            } else{
              setPrevPage(prev)
            }

          
          }} 
        />
        <IconButton colorScheme="green" arial-label="Next Page" icon={<ArrowForwardIcon />} disabled={nextPage === null} onClick={async (e) => {
            // e.preventDefault()
            const page = await get("/api/Pagination", {
              method:"get",
              body: next,
            })
            const {info, error} = await page.json()
            if(error){
              toast({
                position:'bottom',
                title:"An error has occured",
                description:error,
                status: "error",
                duration: 5000,
                isClosable: true,
              })
            } else{
              setNextPage(next)
            }
        }} 
        />

        </Stack>
      </Box>
    </Flex>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri:'https://rickandmortyapi.com/graphql',
    cache: new InMemoryCache()
  })

 const { data } = await client.query({
   query: gql`
   query{
     characters(page:1,){
       info{
        count
        pages
        prev
        next
       }
       results{
         name
         id
         location{
           name
         }
         origin{
           id
           name
         }
         episode{
           id
           episode
           air_date
         }
         image
       }
     }
   }`
 });

 return{
   props:{
     characters: data?.characters?.results,
   },
  }
}
