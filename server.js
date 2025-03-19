import express, { urlencoded } from "express"
import {MongoClient} from "mongodb"
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000
// const __dirname = import.meta.dirname //? what is meta
const MB_CONNECTION_STRING = process.env.MB_CONNECTION_STRING;


async function connectToDb(){
  try{
    const client = await MongoClient.connect(MB_CONNECTION_STRING);
    const db = client.db('toDo')
    const tasks = db.collection('tasks')
    
    return tasks //return a collection
    
  } catch(err) {
    console.error("Erro during connectingToDb: ", err);
  }
}


function createServer(tasks){
  
  app.use(express.urlencoded({extended: true}))
  app.set("view engine", 'ejs');
  app.use(express.json());
  

  app.get('/', async (req, res) => {
    
    try{
      // firstly: need to get data from the db
      const tasksArray = await tasks.find().toArray()
      console.log(tasksArray);

      // rendering EJS, pass in task data
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