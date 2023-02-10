import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personsService from './services/Persons'

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState([null, null])


  const hook = () => {
    console.log('effect')
    personsService.getAll().then(persons => {
      console.log('promise fulfilled')
      setPersons(persons)
    })
  }
  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(newName)) {
      newPerson.id = persons.filter(p => p.name === newName)[0].id
      console.log(newPerson.id);
      if (window.confirm(`${newName} is alredy added to phonebook, replace the old number with a new one?`)) {
        personsService.update(newPerson).then(person => {
          setPersons(persons.map(p => p.id !== person.id ? p : person))
          setNewName('')
          setnewNumber('')
          setMessage([`Updated ${newName}`, 'success'])
        }).catch(error => {
          setMessage([`Information of ${newName}`, 'has alredy been removed from the server','error'])
          setTimeout(() => {
            setMessage([null, null])
          }, 5000)
        })
      }
    } else {
      personsService.create(newPerson).then(person => {
        setPersons(persons.concat(person))
        setNewName('')
        setnewNumber('')
        setMessage([`Added ${newName}`, 'success'])
      }).catch(error => {
        setMessage([error.response.data.error,'error'])
        setTimeout(() => {
          setMessage([null, null])
        }, 5000)
      })
    }

    
  }

  const handlePersonDelete = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.remove(person.id).then(response =>
        setPersons(persons.filter(p => p.id !== person.id))
      )
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setnewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message[0]} className={message[1]} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a New</h2>
      <PersonForm addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} handlePersonDelete={handlePersonDelete} />
    </div>
  )
}

export default App