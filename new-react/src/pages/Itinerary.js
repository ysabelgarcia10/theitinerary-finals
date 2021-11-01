import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import LoginContext from "../context/LoginContext";
import Day from "../components/Day";

const Itinerary = ({ props }) => {
  //take the :id from url
  const params = useParams();
  const { token } = useContext(LoginContext);
  const history = useHistory();
  const [itinerary, setItinerary] = useState({});
  const [days, setDays] = useState([]);
  const [activities, setActivities] = useState([]);
  const [allNonSelectedActivities, setAllNonSelectedActivities] = useState([]);

  useEffect(() => {
    getData(params.id).then((data) => {
      console.log("data that front end got back", data);
      setActivities(data.activities);
      setItinerary(data.itinerary);
      setDays(data.days);
      setAllNonSelectedActivities(data.allActivities);
    });
  }, [params.id]);

  async function getData(id) {
    return fetch(`http://localhost:8080/api/itinerary/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => {
      return data.json();
    });
  }

  const primaryDays = days.filter((day) => day.day_type_id === 1);

  const dayTab = primaryDays.map((day, id) => {
    const dayNum = day.day[4];

    const altDays = days.filter(
      (alt) => alt.day_type_id !== 1 && alt.day[4] === dayNum
    );

    const alt = altDays.map((altDay) => {
      if (day.day[4] === altDay.day[4]) {
        return altDay;
      }
    });

    const allOptions = [day].concat(alt);

    return (
      <Day
        key={id}
        itineraryId={params.id}
        allOptions={allOptions}
        allNonSelectedActivities={allNonSelectedActivities}
        setAllNonSelectedActivities={setAllNonSelectedActivities}
        setActivities={setActivities}
        activities={activities}
        days={days}
        setDays={setDays}
      ></Day>
    );
  });

  return (
    <div>
      {!token && history.push("/login")}
      {dayTab}
    </div>
  );
};

export default Itinerary;
