import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShowDetails.css';

const ShowCarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [owner, setOwner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarAndOwner = async () => {
      try {
        const carResponse = await axios.get(`http://localhost:5000/car/${id}`);
        setCar(carResponse.data);

        if (carResponse.data.ownerId) {
          const ownerResponse = await axios.get(`http://localhost:5000/owner/${carResponse.data.ownerId}`);
          setOwner(ownerResponse.data);
        }
      } catch (error) {
        console.error('Error fetching car:', error);
      }
    };

    fetchCarAndOwner();
  }, [id]);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="details-container">
      {car ? (
        <div>
          <h2>Car Details</h2>
          <div className="details-section">
            <p><strong>Name:</strong> {car.name}</p>
            <p><strong>Brand:</strong> {car.brand}</p>
            <p><strong>Price:</strong> ${car.price}</p>
          </div>
          {owner && (
            <div className="details-section">
              <h2>Owner Details</h2>
              <p><strong>Name:</strong> {owner.name}</p>
              <p><strong>Email:</strong> {owner.email}</p>
            </div>
          )}
          <button className="back-button" onClick={handleGoBack}>Back to main</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShowCarDetails;