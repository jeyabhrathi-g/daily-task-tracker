
import { useState } from 'react'

function App() {
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState([])

  return (
    <div className="app">
      <h1>My Todo App</h1>

      <p>My first React application</p>

      <input
        type="text"
        placeholder="Enter your task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button
        onClick={() => {
          if (task.trim() !== '') {
            setTodos([...todos, task])
            setTask('')
          }
        }}
      >
        Add Todo
      </button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button
              className="delete-btn"
              onClick={() => {
                setTodos(todos.filter((_, i) => i !== index))
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
