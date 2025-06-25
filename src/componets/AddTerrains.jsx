import React, { useState, useEffect, useRef } from 'react';
import HeadAdmin from './HeadAdmin.jsx';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function AddTerrains() {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatu] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fileInputRef = useRef(null); // 👈 For hidden input
  const user = JSON.parse(localStorage.getItem('user'));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click(); // 👈 Trigger file picker
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url)); // Clean up
    };
  }, [imagePreviews]);

  const AddTerrains = async () => {
    if (!title || !city || !address || !type || !capacity || !price || !status) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("city", city);
    formData.append("status", status);
    formData.append("address", address);
    formData.append("type", type);
    formData.append("capacity", capacity);
    formData.append("price", price);
    formData.append("owner", user.id);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await axios.post(
        "https://svko.onrender.com/api/Owner/add-field",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (res.status === 201) {
        toast.success("Terrain created successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create terrain");
    }
  };

  return (
    <div>
      <HeadAdmin />
      <div className='addTerrains'>
        <Toaster />
        <h1>Sports Terrain Manager</h1>
        <h4>Add and manage football or padel terrains</h4>
        <div className='gid'>
          <div className='gid1'></div>
          <div className='gid2'></div>
        </div>
        <div className='contenaire'>
          

          <div className='donnerAdd'>
            <h4 style={{ textAlign: 'center', position: "relative", top: "2%", }}>
              Add football or padel terrains
            </h4>
            <div style={{ marginTop: '10%' }}>
              <div className='form1'>
                <div>
                  <h4>title</h4>
                  <input type="text" onChange={(e) => setTitle(e.target.value)} placeholder="title" />
                </div>
                <div>
                  <h4>city</h4>
                  <input type="text" onChange={(e) => setCity(e.target.value)} placeholder="city" />
                </div>
              </div>
              <div className='form1'>
                <div>
                  <h4>Address</h4>
                  <input type="text" onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                </div>
              </div>
              <div className='form1'>
                <select name="Status" onChange={(e) => setStatu(e.target.value)}>
                  <option value="">Status</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
              <div className='form1'>
                <div>
                  <h4>capacity</h4>
                  <input type="number" onChange={(e) => setCapacity(e.target.value)} placeholder="capacity" />
                </div>
                <div>
                  <h4>price</h4>
                  <input type="number" onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
                </div>
              </div>
              <div className='form1'>
                <select name="type" onChange={(e) => setType(e.target.value)}>
                  <option value="">type</option>
                  <option value="football">Football</option>
                  <option value="padel">Padel</option>
                </select>
              </div>

              <button className='add' onClick={AddTerrains}>add</button>
            </div>
          </div>
          <div className='imagesadd'>
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview-${index}`}
                style={{
                  width: index === 0 ? '80%' : '150px',
                  height: index === 0 ? '40%' : '80px',
                  objectFit: 'cover',
                  margin: '5px',
                  marginLeft: index === 0 ? '11%' : '2%',
                  marginTop: index === 0 ? '3%' : '2%',
                  borderRadius: '8px'
                }}
              />
            ))}
            <div className='form1' id='imagesdiv'>
              <button type="button" className='Chooseimg' onClick={triggerFileSelect} style={{ marginBottom: '10px' }}>
                Choose Images
              </button>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTerrains;
