import React from 'react'; 

const RangeInput = ({ 
  value, 
  onChange, 
  currency, 
  step = 1,
  formatter = (value) => value.toString()
}) => {
  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= value.max) {
      onChange({ ...value, min: newMin });
    }
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= value.min) {
      onChange({ ...value, max: newMax });
    }
  };

  return (
    <div className="range-input">
      <div className="range-input-group">
        <label>Min</label>
        <div className="input-with-currency">
          {currency && <span className="currency-symbol">{currency}</span>}
          <input
            type="text"
            value={formatter(value.min)}
            onChange={handleMinChange}
            className={currency ? 'has-currency' : ''}
          />
        </div>
      </div>
      
      <div className="range-input-group">
        <label>Max</label>
        <div className="input-with-currency">
          {currency && <span className="currency-symbol">{currency}</span>}
          <input
            type="text"
            value={formatter(value.max)}
            onChange={handleMaxChange}
            className={currency ? 'has-currency' : ''}
          />
        </div>
      </div>
    </div>
  );
};

export default RangeInput;
