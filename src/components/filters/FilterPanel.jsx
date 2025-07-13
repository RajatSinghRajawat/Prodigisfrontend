import DateRangePicker from './DateRangePicker';
import RangeInput from './RangeInput';
import MultiSelect from './MultiSelect';
import Slider from './Slider'; 
import { useState } from 'react';

const FilterPanel = ({ onApplyFilters }) => {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [feeRange, setFeeRange] = useState({ min: 10, max: 150 });
  const [selectedSubjects, setSelectedSubjects] = useState(['Maths']);
  const [scaleRange, setScaleRange] = useState({ min: 100000, max: 3000000 });
  const [selectedLocations, setSelectedLocations] = useState(['Mumbai']);

  const subjectOptions = ['Maths', 'Science', 'English', 'History', 'Geography', 'Computer Science'];
  const locationOptions = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];

  const handleResetDate = () => {
    setDateRange({ from: '', to: '' });
  };

  const handleResetFee = () => {
    setFeeRange({ min: 10, max: 150 });
  };

  const handleResetSubjects = () => {
    setSelectedSubjects([]);
  };

  const handleResetScale = () => {
    setScaleRange({ min: 100000, max: 3000000 });
  };

  const handleResetLocation = () => {
    setSelectedLocations([]);
  };

  const handleResetAll = () => {
    handleResetDate();
    handleResetFee();
    handleResetSubjects();
    handleResetScale();
    handleResetLocation();
  };

  const handleApply = () => {
    const filters = {
      dateRange,
      feeRange,
      selectedSubjects,
      scaleRange,
      selectedLocations
    };
    onApplyFilters(filters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <div className="filter-header">
          <h3>Competition Date</h3>
          <button className="reset-button" onClick={handleResetDate}>Reset</button>
        </div>
        <DateRangePicker
          value={dateRange} 
          onChange={setDateRange} 
        />
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Registration Fee</h3>
          <button className="reset-button" onClick={handleResetFee}>Reset</button>
        </div>
        <RangeInput 
          value={feeRange}
          onChange={setFeeRange}
          currency="₹"
        />
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Subjects</h3>
          <button className="reset-button" onClick={handleResetSubjects}>Reset</button>
        </div>
        <MultiSelect 
          options={subjectOptions}
          selectedValues={selectedSubjects}
          onChange={setSelectedSubjects}
        />
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Scale</h3>
          <button className="reset-button" onClick={handleResetScale}>Reset</button>
        </div>
        <RangeInput 
          value={scaleRange}
          onChange={setScaleRange}
          step={100000}
          formatter={(value) => value.toLocaleString('en-IN')}
        />
        <Slider 
          min={100000}
          max={3000000}
          value={scaleRange}
          onChange={setScaleRange}
        />
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h3>Location</h3>
          <button className="reset-button" onClick={handleResetLocation}>Reset</button>
        </div>
        <MultiSelect 
          options={locationOptions}
          selectedValues={selectedLocations}
          onChange={setSelectedLocations}
        />
      </div>

      <div className="filter-actions">
        <button className="reset-all-button" onClick={handleResetAll}>Reset All</button>
        <button className="apply-button" onClick={handleApply}>Apply Filters</button>
      </div>
    </div>
  );
};

export default FilterPanel;
