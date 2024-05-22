import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddEdit.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DOMPurify from 'dompurify';

const initialState = {
  name: '',
  email: ''
};

const AddEditOwner = () => {
  const [state, setState] = useState(initialState);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getSingleOwner(id);
    }
  }, [id]);

  const getSingleOwner = async (id) => {
    const response = await axios.get(`http://localhost:5000/owner/${id}`);
    if (response.status === 200) {
      setState(response.data);
    }
  };

  const addOwner = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/owner', data);
      if (response.status === 201) {
        toast.success('Owner added successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Owner not added');
    }
  };

  const updateOwner = async (data, id) => {
    try {
      const response = await axios.put(`http://localhost:5000/owner/${id}`, data);
      if (response.status === 200) {
        toast.success('Owner updated successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Owner not updated');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.name || !state.email) {
      toast.error('Please fill each input field');
    } else {
      const sanitizedData = {
        ...state,
        name: DOMPurify.sanitize(state.name),
        email: DOMPurify.sanitize(state.email)
      };
      if (!id) {
        addOwner(sanitizedData);
      } else {
        updateOwner(sanitizedData, id);
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

        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter email..."
          onChange={handleInputChange}
          value={state.email}
        />

        <input type="submit" value={id ? "Update" : "Add"} />
      </form>
    </div>
  );
};

export default AddEditOwner;