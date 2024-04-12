import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [ProductData, setProductData] = useState([]);
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(null);

  const [selectedTier, setSelectedTier] = useState('Tier1Supplier');
  const [tier1supplier, setTier1Supplier] = useState([]);
  const [tier2supplier, setTier2Supplier] = useState([]);
  const [displayedSupplier, setDisplayedSupplier] = useState(null);


  const API_KEY = '9053b61501b841aa240f60b301be5e07';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setProductData(response.data.products);

        const tier1response = await axios.get('http://13.56.68.120:10090/dashboard/info/default/primarySupplier?nodeName=Tier1Supplier');
        setTier1Supplier(tier1response.data.response)
        console.log("1", tier1response.data.response.currentBalance)

        const tier2response = await axios.get('http://13.56.68.120:10090/dashboard/info/secondarySupplier/emailId?nodeName=Tier2Supplier&emailId=admin@subconOne.com');
        setTier2Supplier(tier2response.data.response)
        console.log("2", tier2response.data.response.currentBalance  )

      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await response.json();
      setTemperature(data.main.temp);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeatherData();
  };

  const handleTierChange = (event) => {
    setSelectedTier(event.target.value);
    console.log("selectedTier=========> ", event.target.value);
    const selectedSupplier = event.target.value === 'Tier1Supplier' ? tier1supplier : tier2supplier;
    setDisplayedSupplier(selectedSupplier); 

  };

  return (
    <div className="App">
      <div>
        <h1>Weather of city!!!</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter city name" value={city} onChange={handleChange}/>
            <button type="submit">Get Temperature</button>
          </form>
          {temperature && (
          <div>
            <h3>Temperature in {city}:</h3>
            <p>{temperature}°C</p>
          </div>
      )}
    </div>

    <div>
      <h1>Token Balance !!!</h1>
      <div>
        <label for="cars">Choose a car:</label>
        <select onChange={handleTierChange} name='cars' id='cars' value={selectedTier}>
          <option value='Tier1Supplier'>Tier1Supplier</option>
          <option value='Tier2Supplier'>Tier2Supplier</option>
        </select>
        {displayedSupplier && (
        <div>
          <p>Current Balance: {displayedSupplier.currentBalance || 0} {displayedSupplier.currency}</p>
        </div>
      )}
      </div>
    </div>

    </div>
      <h1>Product Details !!!</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Id</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Title</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Brand</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
            </tr>
          </thead>
          <tbody>
            {ProductData.map(p => (
              <tr key={p.id}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{p.id}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{p.title}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{p.price}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{p.brand}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{p.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
