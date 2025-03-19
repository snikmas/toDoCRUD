const deleteBtns = Array.from(document.querySelectorAll(".delete"))
const checkbox = Array.from(document.querySelectorAll(".isDone"))

deleteBtns.forEach((btn) => {
  btn.addEventListener('click', deleteTask)
})
checkbox.forEach((btn) => {
  btn.addEventListener('change', changeStatus)
})

function getId(data){
  // const taskLi = data.closest("li");
  return data.getAttribute('data-id');
}

async function changeStatus(){
  try{
    const taskId = getId(this.closest('li'));
    const isChecked = this.checked;

    const newStatus = isChecked?  'false':'true';
    
    const result = await fetch('/updateTask', {
        method: "put",
          headers: {'Content-Type': "application/json"},
          body: JSON.stringify({taskId, status: newStatus})
        })
  

    console.log("change status main")
    
    this.value = newStatus;
    // location.reload()
  } catch(error){
    console.error("erorr in the changing status: ", error);
  }
}
  
  async function deleteTask(){
    
  let taskLi = this.closest("li");
  // console.log(taskLi) // got it
  
  let taskId = getId(taskLi);
    // this.getAttribute('data-id');


  // send a request to the db
  const result = await fetch ('/deleteTask', {
    method: 'delete',
    headers: {'Content-Type': 'application/json'},
    // we send name and delete it by id on the server
    body: JSON.stringify({taskId})
  });

  if (result.ok){
    taskLi.remove();
    console.log("deleted from the db")
  } else {
    const error = await result.json();
    console.error("Failed to delete task from the db: ", error.message);
  }

}
