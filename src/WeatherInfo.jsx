import React, { useState, useEffect, useCallback } from "react";
import "./WeatherInfo.css";

// function WeatherInfo() {
//   // Place to hold the data
//   const [data, setData] = useState([]);

//   // in the browser so we make a call
//   useEffect(() => {
//     // this function fetches the data (I've removed all but the basics)
//     async function fetchData() {
//       const response = await fetch(
//         "http://api.weatherapi.com/v1/current.json?key=69439bd952804a09a75182714222606&q=London&aqi=no"
//       );
//       const data = await response.json();

//       // here we set it into the state to the page re-renders with the items in it.
//       setData(data);
//     }

//     // here we run it
//     fetchData();
//   }, []); // This runs once because deps array is present but empty

//   return (
//     <>
//       <ul>{data.location.name}</ul>
//     </>
//   );
// }

const API_ENDPOINT =
  "http://api.weatherapi.com/v1/current.json?key=69439bd952804a09a75182714222606&q=London&aqi=no";

const defaultState = {
  data: [], // default starting data.
  loaded: false, // flag to show we are done or not.
  isLoading: false, // 'flag' to tell me we're currently calling the server
  error: null, // placeholder for any errors
};

function WeatherInfo() {
  // console.count("rerender");

  // OUR STATE
  const [state, setState] = useState(defaultState);

  const { error, isLoading, data, loaded } = state;

  // USEFUL FUNCTIONS FOR CHANGING DIFFERENT BITS OF THE STATE
  const setLoaded = useCallback(
    (loadedState) => {
      setState({
        ...state,
        loaded: loadedState,
      });
    },
    [state]
  );

  const setLoading = useCallback(
    (loadingState) => {
      setState({
        ...state,
        isLoading: loadingState,
      });
    },
    [state]
  );

  const setError = useCallback(
    (err) => {
      setState({
        ...state,
        isLoading: false,
        loaded: true,
        error: err,
      });
    },
    [state]
  );

  const setData = useCallback(
    (items) => {
      setState({
        ...state,
        isLoading: false,
        loaded: true,
        error: null,
        data: items,
      });
    },
    [state]
  );

  // THE FUNCTION THAT ACTUALLY DOES THE CALL (LOOK HERE CAREFULLY!!!)
  const fetchData = async () => {
    // IF we have already run this and there is a fetch call in progress, then stop
    // this is not that necessary in this example, but it is just good practice to prevent re-renders sending multiple calls.
    if (isLoading) {
      console.log("abandoming because call in flight");
      return;
    }

    // So, it's the first time, so we set loading to true so that no more fetch calls can be made
    setLoading(true);
    console.log("calling");

    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) throw response;
      const data = await response.json();
      console.log("got data");
      // WE GOT DATA, so stick it in the state and let the list render
      setData(data);
    } catch (err) {
      console.log("got error");
      // We got an error, so stick it in the state and let the error display happen
      setError(err);
    }
  };

  // THE useEffect that triggers the call if we're in the browser and we haven't loaded
  // This should run just once. We use the 'loaded' flag to make sure and to allow reloads if we change it
  useEffect(() => {
    console.log("useEffect called. loaded was", loaded);
    if (!loaded) {
      console.log("making the call");
      fetchData();
    } else {
      console.log("useEffect but no fetch happened because loaded", loaded);
    }
  }, [loaded]); // ignore exhaustive-deps warning here

  // THE DIFFERENT UI STATES
  // Loading
  if (isLoading) return <p>Loading!!</p>;

  // Errored
  if (error)
    return (
      <>
        <p>{error.status || error.message}</p>
        <button onClick={() => setLoaded(false)}>Try again</button>
      </>
    );

  // Success
  return (
    <>
      <div className="container">
        <div className="row">
          <h1>
            {data.location.name}, {data.location.country}
          </h1>
        </div>
      </div>
    </>
  );
}

export default WeatherInfo;
