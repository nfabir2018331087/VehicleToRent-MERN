import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Navbar from '../components/Navbar';
import { Helmet } from 'react-helmet';
// import moment from 'moment'
// import vehicle from '../../../backend/models/vehicle';

const Rent = () => {
  const [reservation, setReservation] = useState({
    reservationId: '',
    pickupDate: '',
    returnDate: '',
    vehicleType: '',
    vehicle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    additionalCharges: {
      collisionDamageWaiver: false,
      liabilityInsurance: false,
      rentalTax: false,
    },
  });
  const [cars, setCars] = useState([]);
  const [carTypes, setCarTypes] = useState(new Set([]))
//   const [weeks, setWeeks] = useState(0)
//   const [days, setDays] = useState(0)
//   const [hours, setHours] = useState(0.0)

  var weeks = 0;
  var days = 0;
  var hours = 0.0;
  var hourly = 0.0;
  var daily = 0.0;
  var weekly = 0.0;
  var total = 0.0;
  var disc = 0.0;
  var tax = 0.0;
  var carName = "";
  var carType = "";


  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/availablecars');
        const json = await response.json();

        // console.log(response.data)
        if(response.ok){
            setCars(json.data);
            setCarTypes(json.types);
        }
        
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  },[]);

  const calculateDuration = () => {
    const s = reservation.pickupDate;
    const r =  reservation.returnDate;

    if(s !== '' && r !== ''){
        const sDate = new Date(s)
        const rDate = new Date(r)
        const diffInMs = rDate - sDate;

        let totalHours = diffInMs / (1000 * 60 * 60);
        if( totalHours > 168){
            weeks = Math.floor(totalHours/168);
            // setWeeks(totalHours/168);
            totalHours = totalHours%168;
        }
        if( totalHours > 24){
            // setDays(totalHours/24);
            days = Math.floor(totalHours/24);
            totalHours = totalHours%24;
        }
        if( totalHours < 24) {
            // setHours(totalHours);
            hours = Number(totalHours).toFixed(2);
        }
    }
  }

  const setCarPrice = () => {
    cars.forEach(el => {
      var name = el.make + " " + el.model
      if(reservation.vehicle === name){
        hourly = el.rates.hourly
        daily = el.rates.daily
        weekly = el.rates.weekly
        carName = el.make + " " + el.model
        carType = el.type
      }
    })
  }

  const calculateTotal = () => {
    if(weeks !== 0) total += Number(weekly*weeks)
    if(days !== 0){
      if((days*daily) > weekly){
        total += Number(weekly)
        disc += Number((days*daily) - weekly)
      }
      else total += Number(days*daily)
    }
    if(hours !== 0){
      if((hours*hourly) > daily){
        total += Number(daily)
        disc += Number((hours*hourly) - daily)
      }
      else total += Number(hours*hourly)
    }
    if(reservation.additionalCharges.collisionDamageWaiver) total += 9
    if(reservation.additionalCharges.liabilityInsurance) total += 15
    if(reservation.additionalCharges.rentalTax){
      tax = Number(total * 11.5 / 100)
      total += Number(tax)
      tax = Number(tax).toFixed(2)
    }
    total = Number(total).toFixed(2)
    disc = Number(disc).toFixed(2)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setReservation(prevState => ({
        ...prevState,
        additionalCharges: {
          ...prevState.additionalCharges,
          [name]: checked,
        }
      }));
    } else {
      setReservation(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // calculateDuration();
    // setCarPrice();
    // calculateTotal();

    doc.setFontSize(18);
    doc.setFont('Helvetica','bold');
    doc.text('VehicleToRent Inc', 14, 10);
    doc.setFontSize(12);
    doc.setFont('Helvetica','normal');
    doc.text('162 Bergen St', 14, 16);
    doc.text('Brooklyn, NY 11213', 14, 22);
    doc.text('PH#', 14, 28);

    doc.setFontSize(10);
    doc.setFont('Helvetica','bold');
    doc.text('RENTER INFO', 14, 38);
    doc.text(reservation.firstName + " " + reservation.lastName, 14, 44);
    doc.setFont('Helvetica','normal');
    doc.text(reservation.email, 14, 50);
    doc.text('PH: ' + reservation.phone, 14, 56);

    doc.setFontSize(16);
    doc.setFont('Helvetica','bold');
    doc.text('Reservation', 120, 10);
    doc.setFontSize(12);
    doc.text('RID: ' + reservation.reservationId, 120, 16);
    doc.setFont('Helvetica','normal');
    doc.setFontSize(10)
    doc.text('Date/Time Out: ' + reservation.pickupDate, 120, 22);
    doc.text('Date/Time In: ' + reservation.returnDate, 120, 28);

    doc.setFontSize(12);
    doc.setFont('Helvetica','bold');
    doc.text('Vehicle Info', 120, 40);
    doc.setFont('Helvetica','normal');
    doc.setFontSize(10)
    doc.text('Vehicle Name: '+ carName, 120, 46);
    doc.text('Vehicle Type: '+ carType, 120, 52);
    
    
    total = Number(total)
    const tableColumn = ['Charge', 'Unit', 'Rate', 'Amount'];
    const tableRows = [
      ['Hourly', '1', `$${hourly}`, `$${(hourly * hours).toFixed(2)}`],
      ['Daily', days, `$${daily}`, `$${(daily * days).toFixed(2)}`],
      ['Weekly', weeks, `$${weekly}`, `$${(weekly * weeks).toFixed(2)}`],
      ['NYS State Tax', '11.5%', tax, tax],
      ['EST TOTAL TIME & MILEAGE', '', '', `${(hourly * hours + daily * days + weekly * weeks).toFixed(2)}`],
      ['Discount', '', '', disc],
      ['Collision Damage Waiver', '', '', reservation.additionalCharges.collisionDamageWaiver ? 9 : 0],
      ['Liability Insurance', '', '', reservation.additionalCharges.liabilityInsurance ? 15 : 0],
      ['Rental Tax', '', '', reservation.additionalCharges.rentalTax ? tax : 0],
      ['TOTAL ESTIMATED CHARGES', '', '', `$${total}`],
      ['Renter Payments', '', '', `$${Math.ceil(total)}`],
      ['Change','','',`${(Math.ceil(total) - total).toFixed(2)} cents`]
    ];

    doc.autoTable({
      startY: 70,
      head: [tableColumn],
      body: tableRows,
    });

    doc.text(
      'Hope you have enjoyed your rental car from VehicleToRent INC. Come Again!',
      10,
      doc.lastAutoTable.finalY + 10,
    );
    doc.text('Renters Signature ______________________________', 10, doc.lastAutoTable.finalY + 30);
    doc.text('Drivers Signature _____________________________', 10, doc.lastAutoTable.finalY + 40);

    doc.save('reservation.pdf');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const duration = weeks+" "+"Week(s)"+" "+days+" "+"Day(s)"+" "+hours+" "+"Hour(s)"

    const completeReservation = {
      ...reservation, duration, disc, total
    }

    const response = await fetch('/api/storereservation', {
      method:'POST',
      body: JSON.stringify(completeReservation),
      headers: {
        'content-type': 'application/json'
      }
    })
    const json = response.json()

    if(response.ok){
      console.log(json)
      generatePDF();
      window.location.href = '/rent'
    }
    else console.log(json.error)
  };

  return (
    <div>
      <Helmet>
        <title> Reservation | VehicleToRent Inc</title>
      </Helmet>
      <Navbar pageName={"rent"} />
    <div className="container mx-auto p-4 mt-6">
      <h1 className="text-4xl font-bold mb-4">Reservation</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
        {/* Reservation Details */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 border-b-4 border-emerald-400">Reservation Details</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Reservation ID</label>
            <input
              type="text"
              name="reservationId"
              value={reservation.reservationId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Pickup Date</label>
            <input
              type="datetime-local"
              name="pickupDate"
              value={reservation.pickupDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Return Date</label>
            <input
              type="datetime-local"
              name="returnDate"
              value={reservation.returnDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4 flex justify-between">
            <div className='block text-gray-700 font-bold mb-2'>
                Duration
            </div>
            <div className='border px-10 py-2 rounded-lg'>
                {calculateDuration()}
                {weeks} Week(s) {days} Day(s) {hours} Hour(s)
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 border-b-4 border-emerald-400">Vehicle Information</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Vehicle Type</label>
            <select
              name="vehicleType"
              value={reservation.vehicleType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Vehicle Type</option>
              {Array.from(carTypes).map((el, idx) => (
                <option key={idx} value={el}>{el}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Vehicle</label>
            <select
              name="vehicle"
              value={reservation.vehicle}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Vehicle</option>
              {cars && cars.map((car) => (
                (reservation.vehicleType === car.type)
                ?
                <option key={car.id} value={`${car.make} ${car.model}`}>{car.make} {car.model}</option> 
                :
                console.log(reservation.vehicleType)
                
              ))}
            </select>
          </div>
        </div>

        {/* Customer Information */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 border-b-4 border-emerald-400">Customer Information</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={reservation.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={reservation.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={reservation.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={reservation.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        {/* Additional Charges */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 border-b-4 border-emerald-400">Additional Charges</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Collision Damage Waiver</label>
            <input
              type="checkbox"
              name="collisionDamageWaiver"
              checked={reservation.additionalCharges.collisionDamageWaiver}
              onChange={handleChange}
              className="mr-2"
            />
            $9.00
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Liability Insurance</label>
            <input
              type="checkbox"
              name="liabilityInsurance"
              checked={reservation.additionalCharges.liabilityInsurance}
              onChange={handleChange}
              className="mr-2"
            />
            $15.00
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Rental Tax</label>
            <input
              type="checkbox"
              name="rentalTax"
              checked={reservation.additionalCharges.rentalTax}
              onChange={handleChange}
              className="mr-2"
            />
            11.5%
          </div>
        </div>

        {/* Charges Summary */}
        <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 border-b-4 border-emerald-400">Charges Summary</h2>
          <div className="border p-4 rounded-lg bg-emerald-200">
            {setCarPrice()}
            <table className="min-w-full bg-emerald-200">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b-2">Charge</th>
                    <th className="py-2 px-4 border-b-2">Unit</th>
                    <th className="py-2 px-4 border-b-2">Rate</th>
                    <th className="py-2 px-4 border-b-2">Total</th>
                </tr>
                </thead>
                <tbody>
                {(weeks !== 0) ?
                <tr>
                    <td className="py-2 px-4 border-b">Weekly</td>
                    <td className="py-2 px-4 border-b">{weeks}</td>
                    <td className="py-2 px-4 border-b">${weekly}</td>
                    <td className="py-2 px-4 border-b">${weekly * weeks}</td>
                </tr> 
                : console.log(weeks)
                }
                {(days !== 0) ?
                <tr>
                    <td className="py-2 px-4 border-b">Daily</td>
                    <td className="py-2 px-4 border-b">{days}</td>
                    <td className="py-2 px-4 border-b">${daily}</td>
                    <td className="py-2 px-4 border-b">${daily * days}</td>
                </tr> 
                : console.log(days)
                }
                {(hours !== 0) ?
                <tr>
                    <td className="py-2 px-4 border-b">Hourly</td>
                    <td className="py-2 px-4 border-b">{hours}</td>
                    <td className="py-2 px-4 border-b">${hourly}</td>
                    <td className="py-2 px-4 border-b">${(hourly * hours).toFixed(2)}</td>
                </tr> 
                : console.log(hours)
                }
                {(reservation.additionalCharges.collisionDamageWaiver) ?
                <tr>
                    <td className="py-2 px-4 border-b">Collision Damage Waiver</td>
                    <td className="py-2 px-4 border-b"></td>
                    <td className="py-2 px-4 border-b">$9.00</td>
                    <td className="py-2 px-4 border-b">$9.00</td>
                </tr>
                : console.log("Not Damaged")
                }
                {(reservation.additionalCharges.liabilityInsurance) ?
                <tr>
                    <td className="py-2 px-4 border-b">Liability Insurance</td>
                    <td className="py-2 px-4 border-b"></td>
                    <td className="py-2 px-4 border-b">$15.00</td>
                    <td className="py-2 px-4 border-b">$15.00</td>
                </tr>
                : console.log("No Liability")
                }
                {calculateTotal()}
                {(reservation.additionalCharges.rentalTax) ?
                <tr>
                    <td className="py-2 px-4 border-b">Rental Tax</td>
                    <td className="py-2 px-4 border-b"></td>
                    <td className="py-2 px-4 border-b">11.5%</td>
                    <td className="py-2 px-4 border-b">${tax}</td>
                </tr>
                : console.log("No Tax")
                }
                <tr className="font-semibold">
                    <td className="py-2 px-4 border-t">Discount</td>
                    <td className="py-2 px-4 border-t"></td>
                    <td className="py-2 px-4 border-t"></td>
                    <td className="py-2 px-4 border-t">${disc}</td>
                </tr>
                <tr className="font-bold">
                    <td className="py-2 px-4 border-t">Total</td>
                    <td className="py-2 px-4 border-t"></td>
                    <td className="py-2 px-4 border-t"></td>
                    <td className="py-2 px-4 border-t">${total}</td>
                </tr>
                </tbody>
            </table>
          </div>
        </div>

        {/* Print/Download Button */}
        <div className="col-span-3 text-right">
          <button className="mr-10 mb-10 text-lg bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:shadow-outline">
            Print / Download
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Rent;
