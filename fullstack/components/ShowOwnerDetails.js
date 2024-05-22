import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShowOwnerDetails.css';

const ShowOwnerDetails = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/owner/${id}`);
        setOwner(response.data);
      } catch (error) {
        console.error('Error fetching owner:', error);
      }
    };

    fetchOwner();
  }, [id]);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="owner-details-container">
      {owner ? (
        <div>
          <h2>Owner Details</h2>
          <p><strong>Name:</strong> {owner.name}</p>
          <p><strong>Email:</strong> {owner.email}</p>
          <button className="back-button" onClick={handleGoBack}>Back to main</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShowOwnerDetails;