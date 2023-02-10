import React from 'react'


const Person = ({ person, handlePersonDelete }) => (
    <div>
        {person.name} {person.number}
        <button onClick={() => handlePersonDelete(person)}>delete</button>
    </div>
)

const Persons = ({ persons, handlePersonDelete }) => (
    <div>
        {
            persons.map(person => (
                <Person key={person.name} person={person} handlePersonDelete={handlePersonDelete}></Person>
            ))
        }
    </div>
)

export default Persons