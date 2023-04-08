import React, {useEffect, useState} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {Star} from "@material-ui/icons";
import * as L from "leaflet";
import axios from "axios"; 
import {format} from "timeago.js"
import "./app.css";
import blackMapIcon from './images/blackIcon.png';
import redMapIcon from './images/redIcon.png';

function App() {

  //  Create the Icon
  const LeafIcon = L.Icon.extend({
    options: {}
  });

  const blackIcon = new LeafIcon({
    iconUrl: blackMapIcon,  
    iconSize: [28, 32] 
  });
  
  const redIcon = new LeafIcon({
    iconUrl: redMapIcon,
    iconSize: [28, 32]   
  });

  const currentUser = "Lyna";
  const [pins, setPins] = useState([]);


  const getPins = async () => {
    try {
      const res = await axios.get("/pins");
      // console.log(res.data.data)
      setPins(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPins()
  }, [])

  return (
    <MapContainer center={[46, 17]} zoom={4} scrollWheelZoom={false}>
      <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {pins.map((pin) => (
        <Marker position={[pin.latitude, pin.longitude]} icon={pin.username === currentUser? redIcon:blackIcon}>
        <Popup>
          <div className="card">
            <label>Place</label>
            <h3 className="place">{pin.title}</h3>
            <label>Review</label>
            <p className="desc">{pin.desc}</p>
            <label>Rating</label>
            <div className="stars">
              <Star className="star"/>
              <Star className="star"/>
              <Star className="star"/>
              <Star className="star"/>
              <Star className="star"/>
              <Star className="star"/>
              <Star className="star"/>
            </div>
            <label>Information</label>
            <span className="username">Created by <b>{pin.username}</b></span>
            <span className="date">{format(pin.createdAt)}</span>
          </div>
        </Popup>
      </Marker>
      ))}

    </MapContainer>
  );
}
export default App;