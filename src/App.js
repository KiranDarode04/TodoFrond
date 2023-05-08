import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import axios from "axios";

const App = () => {
  const [input, setInput] = useState({
    FirstName:"",
    LastName:"",
    City:""
  });

  const[updateId,setUpdateId]=useState();
  const [data, setData] = useState([]); //task
  const [updateUi, setUpdateUI] = useState(1);
  const [update, setUpdate] = useState(false);

  const handelInput = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };
  const tastOptaions={
    position: toast.POSITION.TOP_RIGHT,
    autoClose:8000,
    pauseOnHover:true,
    theme:"dark"
   
};
  const handelValidation=()=>{
    const {FirstName,LastName,City}=input;
    if(FirstName.length<2){
       toast.error("Name shuld be greater than 2 characters !",
       tastOptaions
       );
       return false;
    }else if(LastName.length<3){
      toast.error("Surname should be greater than 3 characters !",tastOptaions );
      return false;
    }else if(City.length<3){
      toast.error("Password  should be equal or greater than 3 characters !",tastOptaions);
      return false;
    }else if(input ===null){
      toast.error("Please fill the data",tastOptaions);
      return false;
    }
    return true;
  }
  
  const addTask = () => {
    
    const { FirstName, LastName, City } = input;
    if (update && handelValidation()) {
   
        axios.put("http://localhost:8000/update",{FirstName,LastName,City},{params:{id:updateId}});
        console.info("data updated");
        setUpdateUI(updateUi + 1);
      setUpdate(()=>false) ;
      
    } else {
      if (FirstName != null && LastName != null && City != null &&  handelValidation()) {
        axios
          .post("http://localhost:8000/save", { FirstName, LastName, City })
          .then(() => {
            setUpdateUI(updateUi + 1);
          })
          .then((err) => {
            console.info(err);
          });
      } 
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8000/get").then((res) => {
      setData(res.data);
    });
  }, [updateUi]);

  return (
    <>
      <div
        className="container"
        style={{ textAlign: "center", justifyContent: "center", gap: "0.2rem" }}
      >
        <h1>Todo App</h1>
        <ul
          style={{
            gap: "2rem",
            listStyle: "none",
            padding: "10px",
            margin: "10px",
          }}
        >
          <li className="p-2">
            FirstName:
            <input
            value={input.FirstName}
              type="text"
              name="FirstName"
              onChange={(event) => handelInput(event)}
            />
          </li>
          <li>
            LastName:
            <input
            value={input.LastName}
              type="text"
              name="LastName"
              style={{ margin: "10px" }}
              onChange={(event) => handelInput(event)}
            />
          </li>
          <li>
            City:
            <input
            value={input.City}
              type="text"
              name="City"
              style={{ margin: "10px" }}
              onChange={(event) => handelInput(event)}
            />
          </li>
          <li style={{ margin: "10px" }}>
            <button
              className="btn btn-info space-top1"
              onClick={() => addTask()}
            >
              Add Data
            </button>
          </li>
        </ul>
      </div>
      <div className="container">
        <h3 style={{ textDecoration: "underline" }}>Data :-</h3>
        <hr style={{ border: "2px solid #999494" }}></hr>
        <ul>
          {data.map(({ FirstName, LastName, City, _id }, index) => {
            const deleteItem = (_id) => {
              axios
                .delete(`http://localhost:8000/delete/`, { params: { id: _id }})
                .then((res) => {
                  setUpdateUI(updateUi - 1);
                  console.log("deleted record");
                })
                .catch((err) => {});
            };
            return (
              <>
                <li key={index}>
                  {index + 1 + " " + FirstName + " " + LastName + " " + City}{" "}
                  <div className="icon_holder">
                    <BiEditAlt
                      className="icon"
                      onClick={() => {
                        setUpdate(true);
                        setInput({FirstName,LastName,City});
                         setUpdateId(()=>_id);
                      }}
                    />
                    <BsTrash
                      className="icon"
                      onClick={() => {
                        return deleteItem(_id);
                      }}
                    />
                  </div>
                </li>
                <ToastContainer/>
              </>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default App;
//mutiple fild todo application with backed include
