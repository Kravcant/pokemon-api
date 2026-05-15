import { useState, useEffect } from 'react'
import Header from "./Components/Header"
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState(null)
  const [allPokemon, setAllPokemon] = useState([])
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [searchError, setSearchError] = useState(null)

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

  function fetchPokemonData(name, onError) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => {
        if (!res.ok) throw new Error(`"${capitalize(name)}" wasn't found. Check the spelling and try again.`)
        return res.json()
      })
      .then(data => {
        const imageUrl = data.sprites?.front_default
        if (!imageUrl) throw new Error(`No image available for "${capitalize(name)}"`)

        setPokemon({
          name: data.name,
          imageUrl,
          height: data.height,
          weight: data.weight,
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          specialAttack: data.stats[3].base_stat,
          specialDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat
        })
        setStatus("success")
      })
      .catch(err => onError(err.message))
  }

  function fetchRandomPokemon(list) {
    setStatus("loading")
    setError(null)

    const randomIndex = Math.floor(Math.random() * list.length)
    const randomName = list[randomIndex].name

    fetchPokemonData(randomName, () => fetchRandomPokemon(list))
  }

  function fetchPokemonByName(name) {
    const trimmed = name.trim().toLowerCase()
    if (!trimmed) return

    setSearchError(null)
    setStatus("loading")

    fetchPokemonData(trimmed, (msg) => {
      setSearchError(msg)
      setStatus("success")
    })
  }

  function handleSearchKey(e) {
    if (e.key === "Enter") fetchPokemonByName(search)
  }

  function getPkName() {
    setSearchError(null)
    fetchRandomPokemon(allPokemon)
  }

  return (
    <main>
      <Header />

      {status === "error" ? (
        <>
          <p>Something went wrong: {error}</p>
          <button onClick={getPkName}>Try again</button>
        </>
      ) : status === "idle" || status === "loading" && !pokemon ? (
        <p>Loading...</p>
      ) : (
        <>
          {status === "loading" ? (
            <p>Loading...</p>
          ) : (
            <>
              <h3>{capitalize(pokemon.name)}</h3>
              <p>Height: {pokemon.height}</p>
              <p>Weight: {pokemon.weight}</p>
              <p>HP: {pokemon.hp}</p>
              <p>Attack: {pokemon.attack}</p>
              <p>Defense: {pokemon.defense}</p>
              <p>Special Attack: {pokemon.specialAttack}</p>
              <p>Special Defense: {pokemon.specialDefense}</p>
              <p>Speed: {pokemon.speed}</p>
              <img src={pokemon.imageUrl} alt={pokemon.name} />
            </>
          )}

          <div>
            <input
              type="text"
              placeholder="Search for a Pokémon..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
            />
            <button onClick={() => fetchPokemonByName(search)}>Search</button>
            {searchError && <p>{searchError}</p>}
          </div>

          <button onClick={getPkName}>Get a random pokemon</button>
        </>
      )}
    </main>
  )
}

export default App