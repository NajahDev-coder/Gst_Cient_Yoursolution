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
class HistoriquePage extends Component{

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
    return moment.utc(date).toDate()
  }
  convertDate2 = (date) => {
	 date= this.convertDate(date);
    return moment(date).add(30, 'minutes');
  }

  componentDidMount() {
  let agent = localStorage.getItem("user");
 let statu;

    axios.get(`http://178.32.70.7:3001/events/${agent}`)
      .then(response => {
       
        let appointments = response.data;
       
        for (let i = 0; i < appointments.length; i++) {
           
          statu=(appointments[i].collect_call_status==1?'Passage':'Tentative');
          appointments[i].target = '/client/'+appointments[i].numero_a_biller;
          appointments[i].title = appointments[i].client + ' Num: '+appointments[i].numero_a_biller+ ' ' +statu;
          appointments[i].start = this.convertDate(appointments[i].calldate)
          appointments[i].end = this.convertDate2(appointments[i].calldate)
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
     <div className="ClientContainer History">
	<h1 className="App-title"><i className="fa fa-calendar"></i> Historique Appel </h1>
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
export default HistoriquePage