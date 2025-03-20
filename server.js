import express, { urlencoded } from "express"
import {MongoClient, ObjectId} from "mongodb"
import dotenv from "dotenv";

dotenv.config(); // Load environment variables


const app = express();
const PORT = process.env.PORT || 3000
const MB_CONNECTION_STRING = process.env.MB_CONNECTION_STRING;


async function connectToDb(){
  try{
    const client = await MongoClient.connect(MB_CONNECTION_STRING);
    const db = client.db('toDo')
    const tasks = db.collection('tasks')
    
    return tasks //return a collection
    
  } catch(err) {
    console.error("Error in the connectingToDb: ", err);
  }
}

async function changeStatusTask(req, res, status, tasks){
  try {
    console.log(`status: ${req.body.taskId}`)
    
    const boolStatus = status === "true" || status === true;

    const result = await tasks.updateOne({
      _id: new ObjectId(req.body.taskId),
    }, {
      $set: {
        status: boolStatus,
      }
    });

    // console.log('hi from change status')
    res.json(`marked: ${status ? 'true' : "false"}`)
  } catch(err){
    console.error(
      console.error('failed')
    )
  }
}


function createServer(tasks){
  
  app.use(express.urlencoded({extended: true}))
  app.set("view engine", 'ejs');
  app.use(express.json());
  app.use(express.static('public'))
  

  app.put('/updateTask', async(req, res) => {
    const {taskId, status} = req.body
    await changeStatusTask(req, res,  status, tasks)
    console.log(await tasks.find().toArray())
  })
      
  app.get('/', async (req, res) => {
    
    try{
      // first: need to get data from the db
      const tasksArray = await tasks.find().toArray()
      // console.log(tasksArray);
      
      // rendering EJS, pass it
      res.render('index.ejs', { tasks: tasksArray});
      } catch(err){
      console.error("Error during get request: ", err);
    }
  })

  app.post("/addTask", async(req, res) => {
    try {
      const task = await tasks.insertOne({ 
        taskName: req.body.task,
        status: false
    })
      res.redirect("/");


    } catch(err){
      console.error("Error during post: ", err);
    }
  })

  app.delete("/deleteTask", async(req, res) => {

    try {
      //get the object
      // console.log(req.body.taskId)
      const task = await tasks.deleteOne({_id: new ObjectId(req.body.taskId)});
      // thats.. why we use json? -> for output
      res.json("deleted")
    } catch(err){
      console.error("Error in the delete: ", err)
    }
    
    
  })

  
  
  app.listen(PORT, () => {
    console.log("Listening...");
  } )
}  

// main function to start your application
async function main(){
  try {
    const tasks = await connectToDb(); // we will get a collection here
    createServer(tasks);
  } catch(err){
    console.error('Error in the main function: ', err);
  };
};
  
// run app
main();