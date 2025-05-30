import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";


type todoitem = {
  todoitem: string;
  id: string
}


function App() {
  const db = getDatabase();
  const [data, setData] = useState("")
  const [todolist, setTodolist] = useState<todoitem[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    set(push(ref(db, "todolist/")), {
      todoitem: data,
    });
  };

  useEffect(() => {
    onValue(ref(db, "todolist/"), (snapshot) => {
      const arr : todoitem[] = []
      snapshot.forEach((item) => {
        arr.push({...item.val(), id : item.key})
      })
      setTodolist(arr)
    })
  },[])



  return (
    <>
      <h1>ToDo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="enter your todo"
          onChange={(e) => setData(e.target.value)}
        />
        <button>Submit</button>
      </form>
      <ul>
        {todolist.map((item) => {
          return <li key={item.id}>{item.todoitem}</li>;
        })}
      </ul>
    </>
  );
}

export default App
