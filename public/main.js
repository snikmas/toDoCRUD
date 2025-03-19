const deleteBtns = Array.from(document.querySelectorAll(".delete"))

deleteBtns.forEach((btn) => {
  btn.addEventListener('click', deleteTask)
})

function deleteTask(){
  let taskLi = this.closest("li");
  console.log(taskLi) // got it

  // send a request to the db
  const result = await fetch ('/deleteTask', {
    method: 'delete',
    headers: {'Conent-Type': 'application/json'}
    // we send name and delete it by id on the server
    body: JSON.stringify({
      taskName: task 
    })
  })

}
