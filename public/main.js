const deleteBtns = Array.from(document.querySelectorAll(".delete"))
const checkbox = Array.from(document.querySelectorAll(".isDone"))

deleteBtns.forEach((btn) => {
  btn.addEventListener('click', deleteTask)
})
checkbox.forEach((btn) => {
  btn.addEventListener('change', changeStatus)
})

async function changeStatus(){
  try{
    const taskId = this.getAttribute('data-id');
    const isChecked = this.checked;
    console.log(taskId, 'ha')
    
    const newStatus = isChecked ?  'true':'false';
    
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
    
  let taskId = this.getAttribute('data-id');
  console.log(taskId)
    // this.getAttribute('data-id');


  // send a request to the db
  const result = await fetch ('/deleteTask', {
    method: 'delete',
    headers: {'Content-Type': 'application/json'},
    // we send name and delete it by id on the server
    body: JSON.stringify({taskId})
  });

  if (result.ok){
    this.closest('li').remove();
    console.log("deleted from the db")
  } else {
    const error = await result.json();
    console.error("Failed to delete task from the db: ", error.message);
  }

}
