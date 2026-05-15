import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [allPokemon, setAllPokemon] = useState([])
  const [status, setStatus] = useState("idle") 
  const [error, setError] = useState(null)

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  useEffect(() => {
    setStatus("loading")
    fetch("https://pokeapi.co/api/v2/pokemon-species?limit=100000&offset=0")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch Pokémon list")
        return res.json()
      })
      .then(data => setAllPokemon(data.results))
      .catch(err => {
        setError(err.message)
        setStatus("error")
      })
  }, [])

  useEffect(() => {
    if (allPokemon.length === 0) return

    fetchRandomPokemon(allPokemon)
  }, [allPokemon])

  function fetchRandomPokemon(list) {
    setStatus("loading")
    setError(null)

    const randomIndex = Math.floor(Math.random() * list.length)
    const randomName = list[randomIndex].name

    fetch(`https://pokeapi.co/api/v2/pokemon/${randomName}`)
      .then(res => {
        if (!res.ok) throw new Error(`Could not load "${randomName}"`)
        return res.json()
      })
      .then(data => {
        const imageUrl = data.sprites?.front_default
        if (!imageUrl) throw new Error(`No image found for "${randomName}"`)

        setPokemon({
          name: data.name,
          imageUrl,
          height: data.height,
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat
        })
        setStatus("success")
      })
      .catch(() => {
        fetchRandomPokemon(list)
      })
  }

  function getPkName() {
    fetchRandomPokemon(allPokemon)
  }

  // --- Render states ---

  if (status === "idle" || status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "error") {
    return (
      <>
        <p>Something went wrong: {error}</p>
        <button onClick={getPkName}>Try again</button>
      </>
    )
  }

  return (
    <>
      <p>{capitalize(pokemon.name)}</p>
      <button onClick={getPkName}>Get a new pokemon</button>
      <p>Height: {pokemon.height}</p>
      <p>HP: {pokemon.hp}</p>
      <p>Attack: {pokemon.attack}</p>
      <p>Defense: {pokemon.defense}</p>
      <img src={pokemon.imageUrl} alt={pokemon.name} />
    </>
  )
}

export default App