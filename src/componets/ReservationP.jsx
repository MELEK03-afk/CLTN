import React, { useState,useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"
import { toast, Toaster } from 'sonner';
import moment from 'moment'
import { ArrowBigRightDash,ArrowBigLeftDash  } from 'lucide-react';
import {useNavigate} from "react-router-dom"
import { Button, Modal } from 'antd';
import {BeatLoader } from "react-spinners"

const ReservationP = () => {
  const {id} = useParams(); // This gets the :id from the URL
  const [time, settime] = useState("");
  const [day, setday] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }); 
  const [title,setTiltle]=useState('')
  const [capacity,setCapacity]=useState('')
  const [price,setPrice]=useState('')
  const [owner,setOwner]=useState('')
  const [NameDay, setNameDay] = useState(moment().format('dddd'));
  const [type, setType] = useState(moment().format('dddd'));
  const [field, setField] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]); // Store available times
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address,setAddress]=useState('')
  const [Image,setImage]=useState('')
  const [Images,setImages]=useState([])
  const [timeRef, timetVisible] = useRevealOnScroll();
    const [loading, setLoading] = useState(true);
  
  const navigate=useNavigate()
  const user=JSON.parse(localStorage.getItem("user"))
  const times = [
    "7:30", "9:00", "10:30", "12:00", "13:30",
    "15:00", "16:30", "18:00", "19:30", "21:00", "22:30"
  ];

  const getField = async (id) => {
    try {
      const res = await axios.get(`http://localhost:2024/api/getField/${id}`);
      setField(res.data.field);
      setTiltle(res.data.field.title)
      setCapacity(res.data.field.capacity)
      setPrice(res.data.field.price)
      setOwner(res.data.field.owner)
      setType(res.data.field.type)
      setAddress(res.data.field.address)
      setImages(res.data.field.images)
      setImage(res.data.field.images[0])
    } catch (error) {
      console.error("Failed to fetch field:", error);
    }
  };
function useRevealOnScroll() {
  const ref = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}
  useEffect(() => {
    toast('You should pick time and day', {
      icon: '⚠️',
      duration: 2000,
    });   
    getField(id);
    
  }, []);
  
  const ChangeImage = async ()=>{

  }

  const checkTime = async () => {
    try {
      const available = [];
  
      await Promise.all(
        times.map(async (time) => {
          const res = await axios.post("http://localhost:2024/api/checktime", {
            time,
            day,
            title,
          });
          if (res.status === 201) {
            available.push(time);
          }
        })
      );
  
      // Sort available times based on their original order
      available.sort((a, b) => times.indexOf(a) - times.indexOf(b));
      setAvailableTimes(available);
    } catch (error) {
      console.error("Failed to fetch time:", error);
    }
  };
  
  const clickreserve = async () =>{
    if (time === '') {
      toast.error("Your should Pick time first ")
    }
    else{
      setIsModalOpen(true)
    }
  }
  
  useEffect(() => {
    if (day && title) {
      checkTime();
    }
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [day, title]);

  
  const sendRequest = async ()=>{
    if (time === '') {
      toast.error("You should pick time")

    }
    try {
      const res= await axios.post(`http://localhost:2024/api/send-Request`,{
        fullName:user.fullName,
        phoneNumber:user.phoneNumber,
        user:user.id,
        title,
        day,
        time,
        price,
        capacity,
        owner,
        type,
        address
      })
      if (res.status === 201) {
        toast.success("Your request sendet ✅")
        setTimeout(() => {
          navigate('/Profile')
        }, 2000); }
    } catch (error) {
      console.log(error)
      if (error.status != 201) {
        toast.error(error.response?.data?.message || "Server error occurred");
      }
    }
  }


  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = moment().add(i, 'days');
      // console.log(day); // This logs the full moment object
      days.push({
        date: day.format('YYYY-MM-DD'),  // Formats the date as "2025-04-23"
        dayName: day.format('dddd'),     // Full day name, e.g., "Wednesday"
        shortDay: day.format('ddd'),     // Abbreviated day, e.g., "Wed"
      });
    }
    return days;
  };


    const days = getNext7Days();    
    // const filteredday= Users.filter((user) =>
    //   user.email.toLowerCase().includes(searchTerm.toLowerCase())
    // );
  return (
    <div className='Reservation'>
      <h1>Your  Reservation</h1>
      <div>
        <div className="TimeReservation">
         
          {
          days.map(item => (
            <div key={item.date} className="day" style={{color: day === item.date ? "white" :'',backgroundColor: day === item.date ? "#141414" :''}} onClick={() => (setday(item.date),setNameDay(item.dayName))}>
              <h5>{item.dayName}</h5>
              <h5>{item.date}</h5>
            </div>
          ))
          }

        </div>
      </div>
      <h3>Time Available in this day</h3>
      <div className={`TimeReservation reveal ${timetVisible ? 'visible' : ''}`} ref={timeRef}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20vh" }}>
            <BeatLoader color="black" size={25} />
          </div>
        ) : (
          availableTimes.map((Time, index) => {
            const isToday = moment().format("YYYY-MM-DD") === day;

            const [hours, minutes] = Time.split(":");
            const slotMoment = moment(day).set({ hour: parseInt(hours), minute: parseInt(minutes), second: 0 });

            const isPast = isToday && slotMoment.isBefore(moment());

            return (
              <button
                key={index}
                onClick={() => !isPast && settime(Time)}
                disabled={isPast}
                style={{
                  color: Time === time ? "white" : isPast ? "gray" : '',
                  backgroundColor: Time === time ? "black" : '',
                  cursor: isPast ? "not-allowed" : "pointer",
                  opacity: isPast ? 0.5 : 1,
                  display: isPast ? 'none' : ''
                }}
                className='Timebt'
              >
                {Time}
              </button>
            );
          })
        )}
      </div>

      {field ? (
        <div className='Reservation-1'>
          <div className="Reservation-2">
              <img
                src={`http://localhost:2024/${Image}`}
                alt="main"
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '10px'
                }}
              />
          {field.images.map((src, index) => (
              <img
                key={index}
                src={`http://localhost:2024/${src}`}
                alt={`preview-${index}`}
                onClick={() => setImage(src)}
                style={{
                  width: '150px',
                  height: '80px',
                  objectFit: 'cover',
                  margin: '5px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: Image === src ? '3px solid #007BFF' : '1px solid #ccc'
                }}
              />
            ))}
          <Modal title=" ✅" open={isModalOpen} onOk={()=>(sendRequest(),setIsModalOpen(false))} onCancel={()=>setIsModalOpen(false)}>
            <h3>Your request has been sent. You can view the result in your profile.</h3>
          </Modal>  
          </div>
          <div className="Reservation-3">
            <h2>Reserve: <span style={{color: field.type === "padel" ?"#212121":"#212121",fontSize:"24px",fontWeight:"400"}}>{field.title}</span></h2>
            <h2>City: <span style={{color: field.type === "padel" ?"#212121":"#212121",fontSize:"24px",fontWeight:"600"}}>{field.city || "Unknown"}</span></h2>
            <h2>Address: <span style={{color: field.type === "padel" ?"#212121":"#212121",fontSize:"24px",fontWeight:"600"}}>{field.address || "N/A"}</span></h2>
            <h2>Capacity: <span style={{color: field.type === "padel" ?"#212121":"#212121",fontSize:"24px",fontWeight:"600"}}>{field.capacity}</span></h2>
            <h2>Price: <span style={{color: field.type === "padel" ?"#212121":"#212121",fontSize:"24px",fontWeight:"600"}}>{field.price} dt</span></h2>
            <h2>Day: <span style={{color: field.type === "padel" ?"#212121":"#212121"}}> <span style={{color: field.type === "padel" ?"#212121":"#212121"}}>{NameDay}</span> {day} </span></h2>
            <h2>Time: <span style={{color: field.type === "padel" ?"#212121":"#212121"}}>{time}</span></h2>
            <button className="Timebt" onClick={()=>clickreserve()} style={{marginLeft:"80%"}}>Resrve</button>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default ReservationP