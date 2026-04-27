import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* 🔒 QUESTIONS */
const questions = [
{
type:"drag",
question:"Drag and drop the routing protocol characteristics",
items:[
{id:"cost",text:"cost-based metric"},
{id:"dijkstra",text:"Dijkstra algorithm"},
{id:"dual",text:"DUAL algorithm"},
{id:"metrics",text:"bandwidth, delay, reliability"}
],
zones:[
{text:"OSPF",answer:["cost","dijkstra"]},
{text:"EIGRP",answer:["dual","metrics"]}
]
},
{
question:"Which protocol is used to send email?",
options:["FTP","SMTP","HTTP","DNS"],
answer:1,
explanation:"SMTP is used to send emails"
}
];

/* COUNT */
app.get("/api/count",(req,res)=>{
  res.json({count:questions.length});
});

/* GET QUESTION */
app.get("/api/question/:index",(req,res)=>{
  const i = parseInt(req.params.index);

  if(i < 0 || i >= questions.length){
    return res.status(404).json({error:"Not found"});
  }

  let q = JSON.parse(JSON.stringify(questions[i]));

  delete q.answer;

  if(q.type === "drag"){
    q.zones.forEach(z => delete z.answer);
  }

  res.json(q);
});

/* VALIDATION */
app.post("/api/validate",(req,res)=>{

  const {index, answer, dragAnswers} = req.body;
  const q = questions[index];

  let correct = false;

  if(q.type === "drag"){

    correct = q.zones.every(zone=>{
      let expected = zone.answer.sort().join(",");
      let given = (dragAnswers[zone.text] || []).sort().join(",");
      return expected === given;
    });

  } else {
    correct = answer === q.answer;
  }

  res.json({correct});
});

/* ✅ IMPORTANT FIX RENDER */
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log("Server running on port " + PORT);
});
