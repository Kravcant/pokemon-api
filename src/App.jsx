import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState({
    name: "ditto",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png"
  })

  const [allPokemon, setAllPokemon] = useState([])

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
      .then(res => res.json())
      .then(data => setAllPokemon(data.results))
  },[])

  useEffect(() => {
    if (allPokemon.length === 0) return  // Guard: wait until list is ready

    fetchRandomPokemon(allPokemon)
  }, [allPokemon])  // Runs when allPokemon populates

  function fetchRandomPokemon(list) {
    const randomIndex = Math.floor(Math.random() * list.length)
    const randomName = list[randomIndex].name

    // Step 3: Use the name (or URL from the list) to fetch full Pokémon data
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomName}`)
      .then(res => res.json())
      .then(data => {
        setPokemon({
          name: data.name,
          imageUrl: data.sprites.front_default  // grab the image from the response
        })
      })
  }

  function getPkName() {
    fetchRandomPokemon(allPokemon)  // Reuse the same logic on button click
  }


  return (
    <>
      <p>{pokemon.name}</p>
      <button onClick={getPkName}>Get a new pokemon</button>
      <img src={pokemon.imageUrl} />
    </>
  )
}

export default App
