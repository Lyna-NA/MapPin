import { useEffect, useRef, useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import * as L from "leaflet";
import redMapIcon from '../images/redIcon.png';
import axios from "axios";

function LocationMarker(props){
    const baseURL = process.env.REACT_APP_API_URL;
    const titleRef = useRef();
    const reviewRef = useRef();
    const ratingRef = useRef();
    const [position, setPosition] = useState(null);
    const [showPopup, setShowPopup] = useState(true);
    const currentUser = window.localStorage.getItem("user");


    const LeafIcon = L.Icon.extend({
        options: {}
    });

    const redIcon = new LeafIcon({
    iconUrl: redMapIcon,
    iconSize: [28, 32]   
    });

    const map = useMapEvents({
      dblclick(e) {
        setPosition(e.latlng);
        setShowPopup(true);
      }
    })

    useEffect(() => {
      if (position !== null) {
        map.flyTo(position, map.getZoom())
      }
    }, [position, map])
  

    const onSubmitHandler = async(event) => {
        event.preventDefault();

        const newPin = {
          username: currentUser,
          title: titleRef.current.value,
          desc: titleRef.current.value,
          rating: ratingRef.current.value,
          latitude: position.lat,
          longitude: position.lng
        }

        try {
          const res = await axios.post(`${baseURL}/pins`, newPin);
          props.setPins((prevState) => [res.data.data, ...prevState]);
        } catch (error) {
          console.log(error);
        }

        clearForm();
    }

    const clearForm = () => {
      titleRef.current.value ="";
      reviewRef.current.value ="";
      ratingRef.current.value ="";

      setShowPopup(false);
    }

    const onCancelAddHandler = () => {
        setPosition(null);
    }

    return position === null ? null : (
      <Marker position={position} icon={redIcon}>
        {showPopup && <Popup>
            <form onSubmit={onSubmitHandler}>
                <label>Place</label>
                <input placeholder="Enter a title" ref={titleRef}/>
                <label>Review</label>
                <textarea placeholder="Say us something about this place" ref={reviewRef}/>
                <label>Rating</label>
                <select ref={ratingRef}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                </select>  
                <div className="btns">
                    <button className="submitBtn btn" type="submit">Add Pin</button>
                    <button className="cancelBtn btn" onClick={onCancelAddHandler}>Cancel</button>
                </div>            
            </form>
        </Popup>}
      </Marker>
    )
}
export default LocationMarker;