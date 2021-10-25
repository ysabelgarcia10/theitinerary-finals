import React, { useState } from 'react';
// import React, { useState, useCallback, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import LocationMarker from '../Map/LocationMarker'
import LocationInfoBox from '../Map/LocationInfoBox';
import DaysCheckbox from '../Map/Checkbox';

const Map = ({ eventData, center, zoom }) => {
  const [locationInfo, setLocationInfo] = useState(null);
  const [show, setShow] = useState([]);

  // const [map, setMap] = useState(null);
  // const onLoad = useCallback((map) => setMap(map), []);

  // useEffect(() => {
  // MUST FIGURE OUT HOW TO AUTOZOOM, AUTOCENTER, FIND THE CENTER!
  //   if (map) {
  //     const bounds = new window.google.maps.LatLngBounds();
  //     eventData.map(marker => {
  //       bounds.extend({
  //         lat: marker.latitude,
  //         lng: marker.longitude,
  //       });
  //     });
  //     map.fitBounds(bounds);
  //   }
  // }, [map, eventData]);
  // }, [])

  const randomColor = () => {
    return Math.floor(Math.random()*16777215).toString(16);
  }

  const uniqueDays = (eventData) => {
    const allDays = [];
    eventData.map(event => allDays.push(event.day))

    const days = allDays.filter((value, index, self) => self.indexOf(value) === index);

    return days;
  }

  const daysList = uniqueDays(eventData)
  const assignDayProperties = (daysList, eventData) => {
    const daysProps = {};
    
    daysList.forEach(day => {
      daysProps[day] = {};
      daysProps[day].name = day;
      daysProps[day].visibility = true;
      daysProps[day].color = randomColor();
    })
  
    return daysProps;
  };

  const dayProperties = assignDayProperties(daysList, eventData);

  const assignMarkerColor = (dayProperties, dayName) => {
    const color = dayProperties[dayName].color;
    return color;
  };

  const handleCallback = (childData) => {
    setShow(childData)
  };

  //create a filtered list of the days selected from the checkbox.
  const filteredDays = eventData.filter((event) => {
    if (show.includes(event.day)) {
      return event;
    }
  });
  
  console.log("filteredDays", filteredDays)
  
  //show only the markers that are enabled on checkbox
  const markers = filteredDays.map(event => {
    return (
    <LocationMarker 
      key = {event.name}
      lat={event.lat} 
      lng={event.lng} 
      onClick={() => setLocationInfo({
        name: event.name, 
        day: event.day, 
        img: event.img
      })}
      color={assignMarkerColor(dayProperties, event.day)}
    />)
  })

  return (
    <div className="map">
      <GoogleMapReact
        bootstrapURLKeys={{ key:
          // process.env.REACT_GOOGLE_MAP_API
          'AIzaSyBTwu8B2_jxWotAM4c_9uEJJJoTmiBE7Aw'
        }}
        defaultCenter={center}
        defaultZoom={zoom}
        // onLoad={onLoad}
      >
       {markers}
      </GoogleMapReact>
      {locationInfo && <LocationInfoBox info={locationInfo}/>}
      <DaysCheckbox daysList={daysList} dayProperties={dayProperties} parentCallback={handleCallback}/>
    </div>
  )
}

Map.defaultProps = {
  center: {
    lat: 49.2827,
    lng: -123.1207
  },
  zoom: 12
}

export default Map;