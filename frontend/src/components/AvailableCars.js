import React, { useEffect, useState } from 'react';

const CarList = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/availablecars');
        const json = await response.json();

        console.log(response)
        if(response.ok){
            setCars(json.data);
        }
        
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-bold mt-2 mb-10 ">Available Cars</h1>
      <div className="flex flex-col gap-10 m-auto items-center">
        {cars && cars.map(car => (
          <div key={car.id} className="flex bg-white border border-emerald-700 rounded-lg p-5 shadow-lg w-3/4 transition hover:scale-105">
            <img src={car.imageURL} alt={`${car.make} ${car.model}`} className="w-1/3 h-full object-cover rounded" />
            <div className='w-full flex justify-between items-center'>
            <div className="w-2/5 ml-4">
              <h2 className="text-2xl font-semibold">{car.make} {car.model}</h2>
              <p className="text-teal-700">{car.year} {car.type}</p>
              <p className="mt-2"><strong>Seats:</strong> {car.seats}</p>
              <p className="mt-2"><strong>Bags:</strong> {car.bags}</p>
              </div>
              <div className='w-1/3'>
              <p className='mb-2'><strong>Features:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {car.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              </div>
              <div className='w-1/3'>
                <p className='mb-2'><strong>Rates:</strong></p>
                <p>Hourly: <span className='font-bold'>${car.rates.hourly}</span></p>
                <p>Daily: <span className='font-bold'>${car.rates.daily}</span></p>
                <p>Weekly: <span className='font-bold'>${car.rates.weekly}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
