const mongoose = require("mongoose");
const Question = require("./models/Question");

mongoose.connect("mongodb+srv://rahulkhartudedev_db_user:Rahul%40123456@cluster0.3x0zudy.mongodb.net/LiveExamPortal");

const questions = [

{
question:"What is the output of 2 + '2' in JavaScript?",
options:["4","22","NaN","Error"],
answer:"22"
},

{
question:"Which keyword declares a variable in JavaScript?",
options:["var","int","string","float"],
answer:"var"
},

{
question:"Which company developed JavaScript?",
options:["Microsoft","Netscape","Google","IBM"],
answer:"Netscape"
},

{
question:"Which method converts JSON to object?",
options:["JSON.parse()","JSON.stringify()","parseJSON()","toObject()"],
answer:"JSON.parse()"
},

{
question:"Which operator checks equality with type?",
options:["==","===","!=","<>"],
answer:"==="
},

{
question:"Which symbol is used for comments?",
options:["//","#","<!-- -->","**"],
answer:"//"
},

{
question:"Which loop runs at least once?",
options:["for","while","do...while","foreach"],
answer:"do...while"
},

{
question:"Which function prints in console?",
options:["print()","console.log()","echo()","write()"],
answer:"console.log()"
},

{
question:"Which keyword stops a loop?",
options:["break","stop","exit","halt"],
answer:"break"
},

{
question:"Which keyword skips iteration?",
options:["skip","continue","next","pass"],
answer:"continue"
},

{
question:"React is a _____?",
options:["Framework","Library","Language","Database"],
answer:"Library"
},

{
question:"Which hook manages state in React?",
options:["useEffect","useState","useContext","useMemo"],
answer:"useState"
},

{
question:"Which command creates React app?",
options:["npm start","create-react-app","node app","react new"],
answer:"create-react-app"
},

{
question:"MongoDB stores data as?",
options:["Tables","Documents","Rows","Cells"],
answer:"Documents"
},

{
question:"Which database is used in MERN?",
options:["MySQL","MongoDB","Oracle","PostgreSQL"],
answer:"MongoDB"
},

{
question:"Which HTTP method retrieves data?",
options:["POST","GET","PUT","DELETE"],
answer:"GET"
},

{
question:"Node.js is built on?",
options:["Java","Chrome V8","Python","Ruby"],
answer:"Chrome V8"
},

{
question:"Which command installs packages?",
options:["npm install","npm run","node install","package add"],
answer:"npm install"
},

{
question:"Which port does React run on?",
options:["3000","5000","8000","8080"],
answer:"3000"
},

{
question:"Which port does Express often run on?",
options:["3000","5000","8000","8080"],
answer:"5000"
}

]

async function seed(){

await Question.deleteMany()

await Question.insertMany(questions)

console.log("Questions inserted")

mongoose.connection.close()

}

seed()