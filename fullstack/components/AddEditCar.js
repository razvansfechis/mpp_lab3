import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddEdit.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';

const initialState = {
  name: '',
  brand: '',
  price: '',
  ownerId: ''
};

const AddEditCar = () => {
  const [state, setState] = useState(initialState);
  const [owners, setOwners] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getSingleCar(id);
    }
    getOwners();
  }, [id]);

  const getSingleCar = async (id) => {
    const response = await axios.get(`http://localhost:5000/car/${id}`);
    if (response.status === 200) {
      setState(response.data);
    }
  };

  const getOwners = async () => {
    const response = await axios.get('http://localhost:5000/owners');
    if (response.status === 200) {
      setOwners(response.data);
    }
  };

  const addCar = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/car', data);
      if (response.status === 201) {
        toast.success('Car added successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Car not added');
    }
  };

  const updateCar = async (data, id) => {
    try {
      const response = await axios.put(`http://localhost:5000/car/${id}`, data);
      if (response.status === 200) {
        toast.success(response.data);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.name || !state.brand || !state.price || !state.ownerId) {
      toast.error('Please fill each input field');
    } else {
      const sanitizedData = {
        ...state,
        name: DOMPurify.sanitize(state.name),
        brand: DOMPurify.sanitize(state.brand),
        price: DOMPurify.sanitize(state.price),
        ownerId: DOMPurify.sanitize(state.ownerId)
      };
      if (!id) {
        addCar(sanitizedData);
      } else {
        updateCar(sanitizedData, id);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name..."
          onChange={handleInputChange}
          value={state.name}
        />

        <label htmlFor="brand">Brand</label>
        <input
          type="text"
          id="brand"
          name="brand"
          placeholder="Enter brand..."
          onChange={handleInputChange}
          value={state.brand}
        />

        <label htmlFor="price">Price</label>
        <input
          type="text"
          id="price"
          name="price"
          placeholder="Enter price..."
          onChange={handleInputChange}
          value={state.price}
        />

        <label htmlFor="ownerId">Owner</label>
        <select id="ownerId" name="ownerId" onChange={handleInputChange} value={state.ownerId}>
          <option value="">Select an Owner</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>{owner.name}</option>
          ))}
        </select>

        <input type="submit" value={id ? "Update" : "Add"} />
      </form>
    </div>
  );
};

export default AddEditCar;