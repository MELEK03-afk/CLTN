import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ScaleLoader } from "react-spinners"; // Import ScaleLoader
import HeadAdmin from "./HeadAdmin";
import { Check } from "lucide-react";

function ManegementPrd() {
  const [Users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [editMode, setEditMode] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [role, setRole] = useState(''); 
  const [w,setW]=useState(false)
  const [loading, setLoading] = useState(true); // State for loading
  const user = JSON.parse(localStorage.getItem('user'));

  // Function to fetch users
  const getUser = async () => {
  
    try {
      const res = await axios.get("https://svko.onrender.com/api/Admin/getUsers",{
        headers: {
          'Authorization': `Bearer ${user.token}`
          }
      });
      setUsers(res.data);

      // Delay hiding loader for 3 seconds
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to update a user
  const updateUser = async(id) => {
    try {
        if (role == '') {
          return toast.error('select new role or close')
        }
      const res = await axios.put(`https://svko.onrender.com/api/Admin/Update-User/${id}`,{
        role
      },{
        headers: {
          'Authorization': `Bearer ${user.token}`
          }
      });
      if(res.status === 200) {
        toast.success('User Updated');
        setEditMode(null)
        setRole('')
        getUser();
      }
    } catch (error) {
      console.error(error);
      if (error.status != 200) {
        
        toast.error(error.response?.data?.message || 'Server error occurred');
      }
    }
  };

  // Function to delete a user
  const deleteUser = async (id) => {
    toast((t) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "white" }}>
        <p>Are you sure you want to delete this user?</p>
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

  const confirmDelete = async (id, toastId) => {
    try {
      const res = await axios.delete(`https://svko.onrender.com/api/Admin/deleteUser/${id}`,{
        headers: {
          'Authorization': `Bearer ${user.token}`
          }
      });
      if (res.status === 200) {
        toast.dismiss(toastId);
        toast.success("User deleted successfully!");
        getUser();
      }
    } catch (error) {
      console.error(error);
      if (error.status != 200) {
        
        toast.error(error.response?.data?.message || 'Server error occurred');
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, Users.length, { duration: 2 });
    return () => controls.stop();
  }, [Users]);

  const displayForm = (user) => {
    if (editMode === user._id) {
      return (
        <tr key={user._id}>
        <td>
          {user.fullName}
        </td>
        <td>{user.email}</td>
        <td>
          <select 
            className="roleselecte" 
            onChange={(e) => setRole( e.target.value)}
          >
            <option value="">Role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Owner">Owner</option>
          </select>
        </td>
        <td>{user._id}</td>
        <td style={{ textAlign: "center" }}>
          <Check onClick={() => updateUser(user._id)} style={{ color: "green", cursor: "pointer" }} size={22} />
          <IoIosClose onClick={() => setEditMode(null)} size={22} style={{ cursor: "pointer", color: "red" }} />
        </td>
      </tr>
      
      );
    } else {
      return (
        
        <tr key={user._id}>
          <td>{user.fullName}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>{user.phoneNumber}</td>
          <td style={{ display: "flex", justifyContent: "space-evenly", fontSize: "large" }}>
            <MdDelete onClick={() => deleteUser(user._id)} style={{ cursor: "pointer" }} />
            <CiEdit onClick={() => { setEditMode(user._id); setUpdatedName(user.fullName); }} style={{ cursor: "pointer" }} />
          </td>
        </tr>
      );
    }
  };

  // Filtered users based on search term
  const filteredUsers = Users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="APUSers">
      <HeadAdmin />
      <div className="headUsrs">
        <Toaster />
        <h1>Management Users</h1>
        <div className="head-3">
          <div className="srch-1">
            <input type="search" className="search" placeholder="Search by Email" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="srch-2">
            <FaSearch style={{ color: "black" }} />
          </div>
        </div>
        <motion.h6 style={{ fontSize: "20px", style: 'text' }}>{rounded}</motion.h6>
      </div>
      
      {/* Display ScaleLoader while loading */}
      {loading ? (
          <ScaleLoader style={{position:"absolute",top:"50%",marginLeft:"50%",fontSize:"xx-large"}} color="white" />
      ) : (
        <div className="divtabe">
          <table border={0}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => displayForm(user))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              No users found
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ManegementPrd;
