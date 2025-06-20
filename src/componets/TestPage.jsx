import React, { useState, useEffect } from "react";
import HeadAdmin from "./HeadAdmin.jsx";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ScaleLoader } from "react-spinners";
import { Check } from "lucide-react";
import { use } from "react";

function TestPage() {
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [title, setUpdateTitle] = useState('');
  const [type, setUpdateType] = useState('');
  const [address, setUpdateAddress] = useState('');
  const [city, setUpdateCity] = useState('');
  const [price, setUpdatePrice] = useState('');
  const [status, setUpdateStatus] = useState('');
  const [capacity, setUpdateCapacity] = useState('');
  const [w,setW]=useState(false)
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const getAllFields = async () => {
    try {
      const URL = user?.role === 'Admin' ? 'http://localhost:2024/api/Admin/getAllFields' : `http://localhost:2024/api/Owner/get-fields-Owner/${user.id}`
      const res = await axios.get(URL , {headers : {Authorization : `Bearer ${user.token}`}});
      setFields(res.data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  useEffect(() => {
    getAllFields();
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const confirmDelete = async (id, toastId) => {
    try {
      const res = await axios.delete(`http://localhost:2024/api/owner/delete-field/${id}`,{
        //Adding token to the request
        headers: {
        'Authorization': `Bearer ${user.token}`
        }
        });
      if (res.status === 200) {
        toast.dismiss(toastId);
        toast.success("Field deleted successfully!");
        getAllFields();
      }
    } catch (error) {
      toast.error("Error deleting field.");
      console.error(error);
    }
  };

  const deleteField = async (id) => {
    toast((t) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "white" }}>
        <p>Are you sure you want to delete this field?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => confirmDelete(id, t.id)}
            style={{ background: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{ background: "gray", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const updateField = async (id) => {
    try {
      const res = await axios.put(`http://localhost:2024/api/owner/update-fields/${id}`, {
        title,
        address,
        city,
        capacity,
        price,
        status,
        type
      },{
        //Adding token to the request
        headers: {
        'Authorization': `Bearer ${user.token}`
        }
        });
      if (res.status === 200) {
        toast.success("Field updated successfully!");
        setUpdateTitle('');
        setUpdateAddress('');
        setUpdateCity('');
        setUpdatePrice('');
        setUpdateStatus('');
        setUpdateCapacity('');
        setUpdateType('')
        getAllFields();
        setEditMode(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error when updating field!");
    }
  };

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  const filteredFields = fields.filter((field) =>
    field.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const controls = animate(count, filteredFields.length, { duration: 2 });
    return () => controls.stop();
  }, [fields, filteredFields.length]);

  const displayForm = (field) => {
    if (editMode === field._id) {
      return (
        <tr key={field._id}>
          <td><input type="text" onChange={(e) => setUpdateTitle(e.target.value)} className="inpupdate" value={title} /></td>
          <td><input type="text" onChange={(e) => setUpdateAddress(e.target.value)} className="inpupdate" value={address} /></td>
          <td><input type="text" onChange={(e) => setUpdateCity(e.target.value)} className="inpupdate" value={city} /></td>
          <td><input type="number" onChange={(e) => setUpdateCapacity(e.target.value)} className="inpupdate" value={capacity} /></td>
          <td><input type="number" onChange={(e) => setUpdatePrice(e.target.value)} className="inpupdate" value={price} /></td>
          <td>
            <select className="roleselecte" onChange={(e) => setUpdateType(e.target.value)} value={type}>
              <option value="football">Football</option>
              <option value="padel">Padel</option>
            </select>
          </td>
          <td>
            <select className="roleselecte" onChange={(e) => setUpdateStatus(e.target.value)} value={status}>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </td>
          <td style={{ textAlign: "center" }}>
            <Check onClick={() => updateField(field._id)} style={{ color: "green", cursor: "pointer" }} size={22} />
            <IoIosClose onClick={() => setEditMode(null)} size={22} style={{ cursor: "pointer", color: "red" }} />
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={field._id}>
          <td>{field.title}</td>
          <td>{field.address}</td>
          <td>{field.city}</td>
          <td>{field.capacity}</td>
          <td>{field.price}</td>
          <td>{field.type}</td>
          <td>{field.status}</td>
          <td style={{ display: "flex", justifyContent: "space-evenly", fontSize: "large" }}>
            <MdDelete onClick={() => deleteField(field._id)} style={{ cursor: "pointer" }} />
            <CiEdit
              onClick={() => {
                setEditMode(field._id);
                setUpdateTitle(field.title);
                setUpdateAddress(field.address);
                setUpdateCity(field.city);
                setUpdatePrice(field.price);
                setUpdateStatus(field.status);
                setUpdateCapacity(field.capacity);
                setUpdateType(field.type)
              }}
              style={{ cursor: "pointer" }}
            />
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="APUSers">
      <HeadAdmin />
      <Toaster />
      <div className="headUsrs">
        <h1>Management Fields</h1>
        <div className="head-3">
          <div className="srch-1" >
            <input type="text" className="search" placeholder="Search by Type" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>
          <div className="srch-2" >
            <FaSearch style={{ color: "black" }} />
          </div>
        </div>
        <motion.h6 style={{ fontSize: "20px" }}>{rounded}</motion.h6>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <ScaleLoader color="white" />
        </div>
      ) : (
        <div className="divtabe">
          <table border={0}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Address</th>
                <th>City</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.map((field) => displayForm(field))}
            </tbody>
          </table>
          {filteredFields.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "10px" }}>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TestPage;
