import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";

type todoitem = {
  todoitem: string;
  id: string;
};

function App() {
  const db = getDatabase();
  const [data, setData] = useState("");
  const [dataErr, setDataErr] = useState("")
  const [todolist, setTodolist] = useState<todoitem[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [updateErr, setUpdateErr] = useState("")
  const [editedValue, setEditedValue] = useState({
    todoitem: "",
    id: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data) {
      set(push(ref(db, "todolistTS/")), {
        todoitem: data,
      });
      setDataErr("")
      setData("")
    } else {
      setDataErr("Enter Your Todo")
   }
  };

  useEffect(() => {
    onValue(ref(db, "todolistTS/"), (snapshot) => {
      const arr: todoitem[] = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), id: item.key });
      });
      setTodolist(arr);
    });
  }, []);

  const handleEnableEdit = (item: todoitem) => {
    setIsEdit(true);
    setEditedValue(item);
  };

  const handleUpdate = () => {
    if (!(editedValue.todoitem == "")) {
      update(ref(db, "todolistTS/" + editedValue.id), {
        todoitem: editedValue.todoitem,
      });
      setIsEdit(false);
    } else {
      setUpdateErr("Enter Your Update Todo")
    }
  };

  const handleDelete = (item: todoitem) => {
    remove(ref(db, "todolistTS/" + item.id));
  };

  return (
    <div className="main">
      <div className="heading">
        <h1>ToDo List</h1>
        <h2>Total: {todolist.length}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder={dataErr}
          onChange={(e) => setData(e.target.value)}
          value={data}
        />
        <button>Submit</button>
      </form>
      {todolist.length > 0 && (
        <ul>
          {todolist.map((item) => {
            return (
              <li key={item.id}>
                {isEdit && editedValue.id === item.id ? (
                  <input
                    className="editInput"
                    type="text"
                    onChange={(e) =>
                      setEditedValue((prev) => ({
                        ...prev,
                        todoitem: e.target.value,
                      }))
                    }
                    value={editedValue.todoitem}
                    placeholder={updateErr}
                  />
                ) : (
                  item.todoitem
                )}
                <div>
                  <button
                    onClick={() =>
                      isEdit ? handleUpdate() : handleEnableEdit(item)
                    }
                  >
                    {isEdit ? "Update" : "edit"}
                  </button>
                  <button
                    onClick={() =>
                      isEdit ? setIsEdit(false) : handleDelete(item)
                    }
                  >
                    {isEdit ? "Cancel" : "Delete"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
