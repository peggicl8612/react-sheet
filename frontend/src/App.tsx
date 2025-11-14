import FormGenerator from './components/FormGenerator/FormGenerator.tsx'
  import './App.css'

function App() {
  return (
     <div className='app'>
      <header className='app-header'>
        <h1>Google Form Generator</h1>
        <p>Create custom Google forms with ease</p>
      </header>
      <main className='app-main' > 
        <FormGenerator />
      </main>
      </div>
    )
}

export default App