import React, { useState, useEffect, Fragment } from 'react';
import { Button, Table } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [carList, setCarList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);

  useEffect(() => {
    getCars();
    getOwners();
  }, []);

  const getCars = async () => {
    const response = await axios.get("http://localhost:5000/cars");
    if (response.status === 200) {
      setCarList(response.data);
    }
  };

  const getOwners = async () => {
    const response = await axios.get("http://localhost:5000/owners");
    if (response.status === 200) {
      setOwnerList(response.data);
    }
  };

  const onDeleteCar = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      const response = await axios.delete(`http://localhost:5000/car/${id}`);
      if (response.status === 204) {
        toast.success("Car deleted");
        getCars();
      } else {
        toast.error("Couldn't delete car");
      }
    }
  };

  const onDeleteOwner = async (id) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/owner/${id}`);
        if (response.status === 204) {
          toast.success("Owner deleted");
          getOwners();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Owner cannot be deleted because they own a car");
        } else {
          toast.error("Couldn't delete owner");
        }
      }
    }
  };

  return (
    <Fragment>
      <div style={{ margin: "10rem" }}>
        <h1>Cars</h1>
        <Table striped hover size="sm">
          <thead>
            <tr>
              <th style={{ fontSize: '18px', textAlign: 'center' }}>Name</th>
              <th style={{ fontSize: '18px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carList.length > 0 ? carList.map((item) => (
              <tr style={{ textAlign: 'center', fontSize: '17px' }} key={item.id}>
                <td style={{ textAlign: 'center' }}>{item.name}</td>
                <td>
                  <Link to={`/update/${item.id}`}>
                    <Button className="btn btn-update" style={{ backgroundColor: '#0077be', borderColor: '#0077be' }}>Update</Button>
                  </Link>
                  &nbsp;
                  <Button className="btn btn-delete" onClick={() => onDeleteCar(item.id)} style={{ backgroundColor: '#DC143C', borderColor: '#DC143C' }}>Delete</Button>
                  &nbsp;
                  <Link to={`/showDetails/${item.id}`}>
                    <Button variant="info" style={{ backgroundColor: '#4169E1', color: 'white' }}>Show Details</Button>
                  </Link>
                </td>
              </tr>
            )) : null}
          </tbody>
        </Table>
        <br />
        <div className='d-grid gap-2' style={{ marginBottom: '20px' }}>
          <Link to="/add" style={{ width: '50%', marginLeft: 'auto' }}>
            <Button size="lg" style={{ width: '100%', backgroundColor: '#74B72E', borderColor: '#74B72E' }}>Add</Button>
          </Link>
        </div>

        <h1>Owners</h1>
        <Table striped hover size="sm">
          <thead>
            <tr>
              <th style={{ fontSize: '18px', textAlign: 'center' }}>Name</th>
              <th style={{ fontSize: '18px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ownerList.length > 0 ? ownerList.map((item) => (
              <tr style={{ textAlign: 'center', fontSize: '17px' }} key={item.id}>
                <td style={{ textAlign: 'center' }}>{item.name}</td>
                <td>
                  <Link to={`/updateOwner/${item.id}`}>
                    <Button className="btn btn-update" style={{ backgroundColor: '#0077be', borderColor: '#0077be' }}>Update</Button>
                  </Link>
                  &nbsp;
                  <Button className="btn btn-delete" onClick={() => onDeleteOwner(item.id)} style={{ backgroundColor: '#DC143C', borderColor: '#DC143C' }}>Delete</Button>
                  &nbsp;
                  <Link to={`/showOwnerDetails/${item.id}`}>
                    <Button variant="info" style={{ backgroundColor: '#4169E1', color: 'white' }}>Show Details</Button>
                  </Link>
                </td>
              </tr>
            )) : null}
          </tbody>
        </Table>
        <br />
        <div className='d-grid gap-2' style={{ marginBottom: '20px' }}>
          <Link to="/addOwner" style={{ width: '50%', marginLeft: 'auto' }}>
            <Button size="lg" style={{ width: '100%', backgroundColor: '#74B72E', borderColor: '#74B72E' }}>Add Owner</Button>
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;