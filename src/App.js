import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


function App() {
  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();
  
  if(isLoading) {
    return <></>
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  // Function to map JSON object to a table

  function populateTableEmil(data) {
  const tableBody = document.getElementById('tableEmil').getElementsByTagName('tbody')[0];
  // Clear previous table rows (if any)
  tableBody.innerHTML = '';

  // Add a row for each event start date
  data.items.forEach((event, index) => {
      let row = tableBody.insertRow(); // Insert a new row at the end of the table
      let cell1 = row.insertCell(0);   // Insert the first cell (for the event index)
      let cell2 = row.insertCell(1);   // Insert the second cell (for the start date)
      let cell3 = row.insertCell(2); 

      cell1.innerHTML = index + 1;     // Display the index of the event
      cell2.innerHTML = event.start.date; // Display the start date
      cell3.innerHTML = event.summary
  });
}

function populateTableSvetoslav(data) {
  const tableBody = document.getElementById('tableSvetoslav').getElementsByTagName('tbody')[0];
  // Clear previous table rows (if any)
  tableBody.innerHTML = '';

  // Add a row for each event start date
  data.items.forEach((event, index) => {
      let row = tableBody.insertRow(); // Insert a new row at the end of the table
      let cell1 = row.insertCell(0);   // Insert the first cell (for the event index)
      let cell2 = row.insertCell(1);   // Insert the second cell (for the start date)
      let cell3 = row.insertCell(2); 

      cell1.innerHTML = index + 1;     // Display the index of the event
      cell2.innerHTML = event.start.date; // Display the start date
      cell3.innerHTML = event.summary
  });
}


  async function signOut() {
    await supabase.auth.signOut();
  }

  //     //Display data in textbox used in getHomeOffice() function
  //     // const startDateBox = document.getElementById('jsonOutput');
  //     // const startDates = data.items.map(event => event.start.date).join('\n'); // Join all start dates with a comma
  //     // startDateBox.value = startDates; // Display start dates in the textbox


//INSTANTIATE FANCY CALENDAR
  function FancyCalendar(datePattern) {

    const [events, setEvents] = useState([]);
  
    const fetchGoogleCalendarData = async () => {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/hms@blankfactor.com/events?q=HomeOffice - Svetoslav Zlatev&timeMin=" + datePattern + "&showDeleted=false", {
      method: "GET",
      headers: {
          'Authorization': 'Bearer ' + session.provider_token // Access token for Google
        }
      });
  
      // Check for HTTP errors.
      if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      //Parse Response
      const data = await response.json();
      const calendarEvents = data.items.map(event => ({
        title: event.summary,
        start: new Date(event.start.date),
        end: new Date(event.end.date)
      }));
      console.log("raw data: "+data);
      alert("Results fetched successfully!");
      setEvents(calendarEvents);
    };
  
    return (
      <div className="App">
        <button onClick={fetchGoogleCalendarData}>Load Events</button>
        <Calendar
          localizer={momentLocalizer(moment)}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    );
  }
  

  async function getHomeOfficeEmil(datePattern) {
    try {
        const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/hms@blankfactor.com/events?q=Emil&timeMin=" + datePattern + "&showDeleted=false", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + session.provider_token // Access token for Google
            }
        });

        // Check for HTTP errors.
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        populateTableEmil(data);
        console.log("raw data: "+data);
        alert("Results fetched successfully!");
    } catch (error) {
        console.error('Failed to fetch data:', error);
        alert("Failed to fetch data: " + error.message); // Provides user feedback directly.
    }
}
  
  async function getHomeOfficeSvetoslav(datePattern) {
    try {
        const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/hms@blankfactor.com/events?q=HomeOffice - Svetoslav Zlatev&timeMin=" + datePattern + "&showDeleted=false", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + session.provider_token // Access token for Google
            }
        });

        // Check for HTTP errors.
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        populateTableSvetoslav(data);
        console.log("raw data: "+data);
        alert("Results fetched successfully!");
    } catch (error) {
        console.error('Failed to fetch data:', error);
        alert("Failed to fetch data: " + error.message); // Provides user feedback directly.
    }
}

  function handleDropdownChange() {
    const dropdown = document.getElementById('myDropdown');
    const selectedValue = dropdown.value;  // Get the selected option value
    console.log("Selected value:", selectedValue);
    return selectedValue;
  }
  

  console.log(session); //log session

  return (
    <div className="App">

      <h1>&#127987;&#65039;&#8205;&#127752; Fancy Calendar &#128054;</h1>
      <FancyCalendar />

       <div style={{width: "400px", margin: "30px auto"}}>
        {session ?
          <>
            <h2>User logged in {session.user.email}</h2>
            <hr />
            <button onClick={() => getHomeOfficeEmil(handleDropdownChange())}>Fetch Home Office Emil</button>
            <button onClick={() => getHomeOfficeSvetoslav(handleDropdownChange())}>Fetch Home Office Svetoslav</button>
            <select id="myDropdown" onChange={() => handleDropdownChange()}>
              <option value="2024-06-01T00:00:00.00Z&timeMax=2024-06-30T00:00:00.00Z">June 2024</option>
              <option value="2024-06-30T00:00:00.00Z&timeMax=2024-07-31T00:00:00.00Z">July 2024</option>
              <option value="2024-07-31T00:00:00.00Z&timeMax=2024-08-31T00:00:00.00Z">August 2024</option>
              <option value="2024-08-31T00:00:00.00Z&timeMax=2024-09-30T00:00:00.00Z">Septmber 2024</option>
              <option value="2024-09-30T00:00:00.00Z&timeMax=2024-10-31T00:00:00.00Z">October 2024</option>
              <option value="2024-10-31T00:00:00.00Z&timeMax=2024-11-30T00:00:00.00Z">November 2024</option>
              <option value="2024-11-30T00:00:00.00Z&timeMax=2024-12-31T00:00:00.00Z">December 2024</option>
              <option value="2025-12-31T00:00:00.00Z&timeMax=2025-01-31T00:00:00.00Z">January 2025</option>
              <option value="2025-01-31T00:00:00.00Z&timeMax=2025-02-28T00:00:00.00Z">February 2025</option>
              <option value="2025-02-28T00:00:00.00Z&timeMax=2025-03-31T00:00:00.00Z">March 2025</option>
            </select>
            <p></p>
            <button onClick={() => signOut()}>Sign Out</button>
            
            <table id="tableEmil" border="1">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
            </tbody>
            </table>
            <table id="tableSvetoslav" border="1">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
            </tbody>
            </table>
          </>
          :
          <>
            <button onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        }
      </div>
    
    </div>
  );
}

export default App;
