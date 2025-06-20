import React,{useState,useEffect} from 'react'
import pic1 from '../images/pic8.jpg'
import pic2 from '../images/pic2.jpeg'
import pic3 from '../images/pic3.png'
import pic4 from '../images/pic7.jpg'
import pic5 from '../images/pic5.jpg'
const backgrounds = [pic1, pic2, pic3,pic4,pic5];

function ChangeBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
        
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  return (
      <div className='change' style={{ backgroundSize: "cover", backgroundPosition: "center", transition: "background-image 0.5s ease-in-out", backgroundImage: `url('${backgrounds[currentIndex]}')`,}}>
      </div>
  )
}

export default ChangeBar