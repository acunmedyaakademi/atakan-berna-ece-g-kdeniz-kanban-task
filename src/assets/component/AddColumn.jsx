import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../App";

export default function AddColumn({ addNewColRef, id, type }) {
  const [inputId, setInputId] = useState(0);
  const [inputs, setInputs] = useState([]);
  const { data, setData } = useContext(DataContext);
  const boardData = data.find((x) => x.id == id); // useEffect içinde daha mı iyi olur diye sor
  const resetRef = useRef();

  useEffect(() => {
    if (boardData?.columns) {
      setInputs(boardData.columns.map((column) => ({
        id: column.id,
        name: column.name,
      })));
    }
  }, [boardData]);

  function addNewColumnInput(e) {
    e.preventDefault();
    const newInput = {
      id: crypto.randomUUID(),
      name: "",
    };
    setInputs([...inputs, newInput]);
  }

  function handleColumnSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    const updatedColumns = inputs.map((input) => ({
      id: input.id,
      name: formObj[`columnName${input.id}`],
      tasks: boardData?.columns?.find(x => x.id == input.id)?.tasks,
    }));


    const updatedData = data.map((board) =>
      board.id === id
        ? { ...board, columns: updatedColumns }
        : board
    );

    setData(updatedData);
    addNewColRef.current.close();
    resetRef.current.reset();
  }

  return (
    <>
      <dialog ref={addNewColRef} className="add-column">
        <div>
          <h4>Add New Column</h4>
          <form ref={resetRef} onSubmit={handleColumnSubmit}>
            <legend>Name</legend>
            <input
              disabled
              type="text"
              name="name"
              defaultValue={boardData?.name}
              placeholder="e.g. Web Design"
            />
            <legend>Columns</legend>
            {inputs.map((input) => (
              <input
                key={input.id}
                type="text"
                defaultValue={input.name}
                name={`columnName${input.id}`}
              />
            ))}
            <button onClick={addNewColumnInput} className="addNewColumnBtn">+ Add New Column</button>
            <button type="submit" className="saveChBtn">Save Changes</button>
          </form>
        </div>
      </dialog>
    </>
  );
}