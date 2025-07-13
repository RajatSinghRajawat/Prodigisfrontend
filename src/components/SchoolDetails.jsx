import React from 'react';
import './StudentLogin.css';
import './SchoolDetails.css';
import './AdditionalDetails.css';

import { Link } from 'react-router-dom';

import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';

const SchoolDetails = () => {
  return (
    <div className="schoolform">
    <div className="registration-container">
      <Card className="registration-form">
        <h1>Tell us more about
        your school</h1>

       

        <form>
          <div className="form-group">
            <Input
              label="School Name"
              name="text"
              
              placeholder="Enter School Name"
              required
            />
          </div>

          <div className="form-group password-group">
          <div className="form-group">
            <Input
              label="School Adress"
             
              type="text"
              placeholder="Address Line 1"
              required
            />
            <Input
             
             
              type="text"
              placeholder="Address Line 2"
              required
            />
            <Input
             
              type="text"
              placeholder="Address Line 3"
              required
            />
            </div>
            <div className="form-row">
            <div className="form-group">
            <Input
              label="City / District*"
              name="text"
              placeholder="Enter City"
              required
            />
          </div>
            <div className="form-group">
            <Input
              label="Pincode"
              name="number"
              placeholder="Enter PIncode"
              required
            />
          </div>
          </div>
          <div className="form-group">
            <label htmlFor="Country" className='contit'>Country</label>
          <select className="custom-select select-input">
        <option value="">Select</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>

          </div>
          <div className="form-group">
            <Input
              label="School Mobile number"
              name="number"
              placeholder="Enter School’s mobile number"
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="School Email ID"
              name="text"
              placeholder="Enter school email ID"
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="School Website link"
              name="text"
              placeholder="Enter link to school’s website"
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="Principal’s Name"
              name="text"
              placeholder="Enter School Principal’s Name"
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="Principal’s Mobile Number"
              name="number"
              placeholder="Enter School Principal’s Mobile Number"
              required
            />
          </div>
           
          </div>

         

          <div className="form-actions">
           

            <Button 
              type="submit"
              variant="primary"
              size="large"
              className="submit-btn sub-but"
            >
             Continue
            </Button>
          </div>

          
        </form>
      </Card>
    </div>
    </div>
  );
};

export default SchoolDetails;
