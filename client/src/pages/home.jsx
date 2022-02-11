import React, { Component} from 'react';
import { Calendar, momentLocalizer  } from 'react-big-calendar';
import { useNavigate  } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../App.css';

//moment.locale('en-GB');
//BigCalendar.momentLocalizer(moment);
const localizer = momentLocalizer(moment)

async function GetEtatRdv(credentials) {
 return fetch('http://178.32.70.7:3001/api/dt_rdv', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}
class CalendarPage extends Component{

  constructor(props) {
    super(props)

    this.state = {
      cal_events: [
        //State is updated via componentDidMount
      ],
	   redirect: false,
	   url_event:''
    }

  }

  convertDate = (date) => {
	
	 date= moment(date).add(0, 'minutes');
	return moment.utc(date).toDate();
  }
  
  convertDate2 = (date) => {
	 date= this.convertDate(date);
    return moment(date).add(30, 'minutes');
  }
  componentDidMount() {
  let agent = localStorage.getItem("user");

	   axios.get(`http://178.32.70.7:3001/eventsrdv/${agent}`)
      .then(response => {

		 
        let  appointments = response.data;
        
		for (let j =0; j < appointments.length; j++) {
          let dtrdv=moment.utc(appointments[j].Date_RDV).format("YYYY-MM-DD HH:MM:SS");
		 
		 let statu;
          let dtauj=moment.utc(new Date()).format("YYYY-MM-DD HH:MM:SS");
	console.log("this.convertDate(dtrdv)",dtrdv);
	console.log("this.convertDate(dtauj)",dtauj);
		  if(dtrdv >= dtauj) 
		  {
			  if(appointments[j].statu===0)  { statu='RDV' ;}
		      if(appointments[j].statu===1)  { statu='Appel Annulé';}
		  }
		  else {
			  
			  if(appointments[j].collect_call_status==='1') { statu="Appel Passé"; }
			  else if( appointments[j].collect_call_status==='2'){ statu="Tentative Appel";}
			  else
			  {
				  statu='Appel Annulé';
			  }
		  }     
			   console.log('statu',statu);
			 // }
			 console.log(this.convertDate(appointments[j].Date_RDV));
          appointments[j].target = '/client/'+appointments[j].Num;
          appointments[j].title = appointments[j].Extension + ' Num: '+appointments[j].Num+ ' ' +statu;
          appointments[j].start = this.convertDate(appointments[j].Date_RDV)
          appointments[j].end = this.convertDate2(appointments[j].Date_RDV)
          //console.log(i,appointments[i].Date_RDV);
        }
        this.setState({
          cal_events:appointments
        })
     
        });
	  
  }
  render(){
	   const { cal_events } = this.state;
	   const { redirect } = this.state;
	   const { url_event } = this.state;
	   const { selected } = this.state;
         
		 
		 const handleSelected = (event) => {
			 
  this.setState({
  selected:event,
  redirect: true,
  url_event:`${event.target}/all/1`
  })
   
  
};
if (redirect) {
       return <Navigate  to={url_event}/>;
     }
    return(
	 <div className="MainPage page-content p-5">
     <div className="container">
     <div className="ClientContainer">
	<h1 className="App-title"><i className="fa fa-calendar"></i> RDV Clients</h1>
        <span className="ss_tit"> </span>
       <Calendar 
	        localizer={localizer}
            events={cal_events}
			selected={selected}
			onSelectEvent={handleSelected}
           
            defaultView='week'
            views={['month','week','day']}
            defaultDate={new Date()}
          />
	</div>
	</div>
	</div>
    )
  }
}
export default CalendarPage