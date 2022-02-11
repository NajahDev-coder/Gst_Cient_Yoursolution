const  express = require ('express');
const  db = require('./config/db');
const cors = require('cors');
const  cookieParser = require( 'cookie-parser');
const session  = require( 'express-session');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const dotenv = require( 'dotenv');
dotenv.config();

const app = express();
const  PORT = 3001;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
// initialize express-session to allow us track the logged-in user across sessions.
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'pecuniamsekretsession',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000
		//secure: true
    }
}));
app.use(express.static(__dirname + '/public'));
// Route for login agent
app.post('/api/login', (req,res)=> {
//cpt_admin@yrsol22
const Username = req.body.username;
const Password = req.body.password;
if(	Username===process.env.AD_USERNAME && Password===process.env.AD_PASSWORD)
{
		res.send({  token: 'admin' });
}
else
{
db.query("SELECT id FROM agent WHERE username = ? and password = ?", [Username,Password], 
 (err,result)=>{
    if(err) {
    console.log(err);
    } 
	var i=0;
	var token=null;
    for( i in result) {
		token =result[i].id;
	}
	if(token!=null)
	{
	 res.send({ token: token});
	}
	else
	{
		res.send({  token: 'Veuillez vérifier vos données!' });
	}
    });
}	
});

// Route to get agent
app.get("/api/getAgent/:agent", (req,res)=>{
 
 const agent = req.params.agent;
var sql="SELECT username FROM agent WHERE id = ?"
db.query(sql,agent, (err,result)=>{
    if(err) {
    console.log(err)
    } 
res.send(result)
});   
});
// Route to get all agents
app.get("/api/getagent", (req,res)=>{
 
var sql="SELECT * FROM agent"
db.query(sql, (err,result)=>{
    if(err) {
    console.log(err)
    } 
res.send(result)
});   });
// Route to get all clients avec pagination
app.get("/api/get/:agent/:pageId", (req,res)=>{
 const numero = req.params.numero;

  let  pageId = req.params.pageId;
  let i=0;
const limit=49;
if(pageId > 1){ i= (pageId-1) * limit ; }
 const agent = req.params.agent;
 
  if(agent==='admin') var sql="  SELECT A.* , B.username FROM client_agent as A join agent as B  ON A.agent=B.id  WHERE A.Numero!='' ORDER BY A.id DESC limit "+i+","+limit+""
  else var sql="SELECT * FROM client_agent WHERE agent = ? AND   Numero!=''  ORDER BY id DESC limit "+i+","+limit+""
db.query(sql,agent, (err,result)=>{
    if(err) {
    console.log(err)
    } 
res.send(result)
});   });
// Route to get all clients
app.get("/api/get/:agent", (req,res)=>{
 const numero = req.params.numero;

 const agent = req.params.agent;
 
  if(agent==='admin') var sql="  SELECT A.* , B.username FROM client_agent as A join agent as B  ON A.agent=B.id  WHERE A.Numero!='' "
  else var sql="SELECT * FROM client_agent WHERE agent = ? and   Numero!='' "
db.query(sql,agent, (err,result)=>{
    if(err) {
    console.log(err)
    } 
res.send(result)
});   });
// Route to get all clients en sourdine depuis plus que 45 jours
app.get("/api/getsourdine/:agent", (req,res)=>{
 
 const agent = req.params.agent;
 const dateauj=new Date(new Date("").setDate(new Date().getDate()-45))
 console.log('dateauj',dateauj)
 if(agent==='admin') var sql="SELECT A.* , B.username FROM client_agent as A join agent as B  ON A.agent=B.id WHERE A.Numero IN( SELECT numero_a_biller FROM cdr where DATEDIFF(NOW(),str_to_date(calldate,'%Y-%m-%d'))>45) and A.Numero NOT IN( SELECT numero_a_biller FROM cdr where DATEDIFF(NOW(),str_to_date(calldate,'%Y-%m-%d'))<45)"
 else var sql="SELECT * FROM client_agent WHERE Numero IN( SELECT numero_a_biller FROM cdr where DATEDIFF(NOW(),str_to_date(calldate,'%Y-%m-%d'))>45) and Numero NOT IN( SELECT numero_a_biller FROM cdr where DATEDIFF(NOW(),str_to_date(calldate,'%Y-%m-%d'))<45) and agent = ?"
db.query(sql,agent, (err,result)=>{
    if(err) {
    console.log(err)
    } 
res.send(result)
});   });
// Route to get one client
app.get("/api/getFromId/:numero", (req,res)=>{

const numero = req.params.numero;
 
 var sql="SELECT * FROM client_agent WHERE Numero = ? "; 
 db.query(sql, [numero],
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
    //console.log("client x:",result);
    res.send(result)
    });   
});
//Dernier_Passage client from cdr
app.get("/api/Dernier_Passage/:numero/:date", (req,res)=>{

const numero = req.params.numero;
 var sql="SELECT calldate FROM cdr WHERE numero_a_biller = ? and collect_call_status=1 ORDER BY calldate DESC limit 1";
 db.query(sql,numero,
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
    console.log("client cdr:",result);
    res.send(result)
    });   
});

//Dernier_Date_Rappel client from cdr
app.get("/api/Dernier_Date_Rappel/:numero/:date", (req,res)=>{

const numero = req.params.numero;
 var sql="SELECT calldate FROM cdr WHERE numero_a_biller = ? ORDER BY calldate DESC limit 1";
 db.query(sql,numero,
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
    console.log("client cdr:",result);
    res.send(result)
    });   
});
//nbre passage client from cdr
app.get("/api/nbr_passage/:numero/:date", (req,res)=>{
const numero = req.params.numero;
const date = req.params.date;
if(date=="all")
 var sql=" SELECT count(*) as NBR_Passage FROM cdr WHERE numero_a_biller = ? and collect_call_status=1";
else
 var sql=" SELECT count(*) as NBR_Passage FROM cdr WHERE numero_a_biller = ? and collect_call_status=1 and calldate like '%"+date+"%'";

 db.query(sql,numero,
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
    //console.log("client nbre passage:",result);
    res.send(result)
    });   
});
//deatails passage client from cdr
app.get("/api/getpassage/:numero/:date/:pageId", (req,res)=>{

const numero = req.params.numero;

  let  pageId = req.params.pageId;
  let  date = req.params.date;
  let i=0;

const limit=5;
if(pageId > 1){ i= (pageId-1) * limit ; }

if(date=="all")
 var sql="SELECT * FROM cdr WHERE numero_a_biller = ? and collect_call_status=1 ORDER BY calldate DESC limit "+i+","+limit+"";
else
 var sql="SELECT * FROM cdr WHERE numero_a_biller = ? and collect_call_status=1 and  calldate like  '%"+date+"%' ORDER BY calldate DESC limit "+i+","+limit+"";
 db.query(sql,numero,
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
    //console.log("client passage cdr:",result);
    res.send(result)
    });   
});
//nbre tentative client from cdr
app.get("/api/tent_rapp/:numero/:date", (req,res)=>{

const numero = req.params.numero;
const date = req.params.date;
if(date=="all")
 var sql=" SELECT count(*) as Tentative_du_Rappel FROM cdr WHERE numero_a_biller = ?";
else
 var sql=" SELECT count(*) as Tentative_du_Rappel FROM cdr WHERE numero_a_biller = ? and calldate like '%"+date+"%'";
 db.query(sql,numero,
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
    //console.log("client nbre tentative:",result);
    res.send(result)
    });   
});
//consomation totale  client
app.get("/api/ConsomClientTotal/:numero/:date/", (req,res)=>{

const numero = req.params.numero;
const date = req.params.date;
if(date=="all") 
 var sql=" SELECT COALESCE(ROUND(sum(collect_call_montant_total),2),0) as ConsomClientTotal FROM cdr WHERE numero_a_biller = ? ";
else
 var sql=" SELECT COALESCE(ROUND(sum(collect_call_montant_total),2),0) as ConsomClientTotal FROM cdr WHERE numero_a_biller = ? and calldate LIKE '%"+date+"%'";
 db.query(sql,numero,
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
	
    //console.log("client ConsomM:",result);
    res.send(result)
    });   
});
//consomation totale  client par mois from cdr
app.get("/api/getConsomM/:numero/:date/", (req,res)=>{

const numero = req.params.numero;
let datem = req.params.date;
if(datem<10) datem='0'+datem;
const datey = new Date().getFullYear();
const date=datey+'-'+datem;
//console.log("consomation totale",date )
 var sql=" SELECT COALESCE(ROUND(sum(collect_call_montant_total),2),0) as ConsomM FROM cdr WHERE numero_a_biller = ? and calldate LIKE '%"+date+"%'";
 db.query(sql,numero,
 (err,result)=>{
    if(err) {
    console.log(err)
    } 
	
    //console.log("client ConsomM:",result);
    res.send(result)
    });   
});

//Route for CALENDER list CALLDATE
app.get('/events/:agent', function (req, res) {
 const agent = req.params.agent;
   if(agent==='admin') var sql='SELECT C.calldate, C.collect_call_status, C.client, C.numero_a_biller from `cdr` as C WHERE C.numero_a_biller IN(SELECT B.Numero from client_agent as B )';
 else var sql = 'SELECT C.calldate, C.collect_call_status, C.client, C.numero_a_biller from `cdr` as C WHERE C.numero_a_biller IN(SELECT B.Numero from client_agent as B where B.agent=?)';
  db.query(sql,agent, function (err, rows) {
    if (err) {
      res.json({ Error: true, Message: 'Error Execute Sql', err })
    } else {
      // res.json({ "Error": false, "Message": "Success", "Visitors": rows });
	  //console.log("rows events:",rows)
      res.json(rows)
    }
  })
})
//Route for CALENDER list RDV
app.get('/eventsrdv/:agent', function (req, res) {
 const agent = req.params.agent;
 
  //var sql = 'SELECT id,Extension,Date_RDV FROM client_agent  WHERE agent=?';
    if(agent==='admin') var sql = 'SELECT DISTINCT A.id,A.Extension,ANY_VALUE(A.Numero) as Num,A.statu,A.Date_RDV,  B.collect_call_status  FROM  client_agent as A join cdr as B ON A.Numero=B.numero_a_biller WHERE A.Date_RDV like B.calldate or DATEDIFF(str_to_date(B.calldate,"%Y-%m-%d"),str_to_date(A.Date_RDV,"%Y-%m-%d")) >=1 OR str_to_date(A.Date_RDV,"%Y-%m-%d") > str_to_date(B.calldate,"%Y-%m-%d") GROUP BY Num'
	else var sql = 'SELECT DISTINCT A.id,A.Extension,ANY_VALUE(A.Numero) as Num,A.statu,A.Date_RDV,  B.collect_call_status FROM  client_agent as A join cdr as B ON A.Numero=B.numero_a_biller WHERE A.agent= ? AND (A.Date_RDV like B.calldate or DATEDIFF(str_to_date(B.calldate,"%Y-%m-%d"),str_to_date(A.Date_RDV,"%Y-%m-%d")) >=1 OR str_to_date(A.Date_RDV,"%Y-%m-%d") > str_to_date(B.calldate,"%Y-%m-%d")) GROUP BY Num';
  db.query(sql,agent, function (err, rows) {
    if (err) {
      res.json({ Error: true, Message: 'Error Execute Sql', err })
    } else {

      res.json(rows)
    }
  })
})
//etat rdv 
app.post('/api/dt_rdv', function (req, res) {
 const numero = req.body.numero;
 let  dt_rdv = req.body.dt_rdv;
 dt_rdv=dt_rdv.substr(0,15)
 var sql = 'SELECT  collect_call_status as statu from `cdr`  WHERE numero_a_biller ="'+numero+'" and calldate like "%'+dt_rdv+'%"';
  db.query(sql, function (err, rows) {
    if (err) {
      res.json({ Error: true, Message: 'Error Execute Sql', err })
    } else {
      //res.json(rows)
      res.json(rows)
    }
  })
})
// Route for creating the client
app.post('/api/create', (req,res)=> {

const Extension = req.body.Extension;
const Numero = req.body.Numero;	
const Cellulaire = req.body.Cellulaire;	
const Nom_Prenom = req.body.Nom_Prenom;	
const Adresse = req.body.Adresse;	
const Situation_familiale = req.body.Situation_familiale;	
const Situation_sociale = req.body.Situation_sociale;
const Date_RDV = req.body.Date_RDV;	
const Commentaire_du_Rappel = req.body.Commentaire_du_Rappel;
const agent = req.body.agent;

//const agent = token;
const stat = 1;

db.query("INSERT INTO client_agent (Extension,Numero,Cellulaire,Nom_Prenom,Adresse,Situation_familiale,Situation_sociale,Date_RDV,Commentaire_du_Rappel,agent,statu) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[Extension,Numero,Cellulaire,Nom_Prenom,Adresse,Situation_familiale,Situation_sociale,Date_RDV,Commentaire_du_Rappel,agent,stat], (err,result)=>{
	
      
   if(err) {
   console.log(err); return;
   } 
   //res.send({message: 'Client Crée avec succes!'});
   //console.log(result);
   res.status(200);
 
});   })
// Route for creating the agent
app.post('/api/createAgent', (req,res)=> {

const Username = req.body.Username;
const Password = req.body.Password;	


//const agent = token;
const stat = 1;

db.query("INSERT INTO agent (username,password) VALUES (?,?)",[Username,Password], (err,result)=>{
	
      
   if(err) {
   console.log(err); return;
   } 
   //res.send({message: 'Client Crée avec succes!'});
   //console.log(result);
   res.status(200);
 
});   })
// Route to edit one client
app.post("/api/edit/", (req,res)=>{

const Extension = req.body.Extension;
const Numero = req.body.Numero;	
const Cellulaire = req.body.Cellulaire;	
const Nom_Prenom = req.body.Nom_Prenom;	
const Adresse = req.body.Adresse;	
const Situation_familiale = req.body.Situation_familiale;	
const Situation_sociale = req.body.Situation_sociale;
const Date_RDV = req.body.Date_RDV;	
console.log("Date_RDV edit",Date_RDV);
const Commentaire_du_Rappel = req.body.Commentaire_du_Rappel;
db.query("update  client_agent SET Extension=?, Numero=?, Cellulaire=?, Nom_Prenom=?, Adresse=?, Situation_familiale=?, Situation_sociale=?, Date_RDV=?, Commentaire_du_Rappel=? WHERE Numero = ?"
, [Extension,Numero,Cellulaire,Nom_Prenom,Adresse,Situation_familiale,Situation_sociale,Date_RDV,Commentaire_du_Rappel,Numero], (err,result)=>{
    if(err) {
    console.log(err)
    } 
	console.log(result);
    console.log("edit client succes!");
    res.status(200)
    });   
});

// Route to like a post
/*app.post('/api/like/:id',(req,res)=>{

const id = req.params.id;
db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?",id, (err,result)=>{
    if(err) {
   console.log(err)   } 
   console.log(result)
    });    
});*/

// Route to delete a client

app.delete('/api/delete/:id',(req,res)=>{
const id = req.params.id;

db.query("DELETE FROM client_agent WHERE id= ?", id, (err,result)=>{
if(err) {
console.log(err)
        } }) });

// Route to delete a agnet

app.delete('/api/deleteagent/:id',(req,res)=>{
const id = req.params.id;

db.query("DELETE FROM agent WHERE id= ?", id, (err,result)=>{
if(err) {
console.log(err)
        } }) })
		
//annuler rendezvous ou remttre
app.put('/api/ban/:id/:stat',(req,res)=>{
const id = req.params.id;
const stat = req.params.stat;
//anuler rdv ou re-mettre
db.query("update  client_agent SET statu=? WHERE id= ?", [stat,id], (err,result)=>{
if(err) {
console.log(err)
        } }) })

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})