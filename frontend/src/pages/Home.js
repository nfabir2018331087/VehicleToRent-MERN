import AvailableCars from '../components/AvailableCars'
import Navbar from '../components/Navbar'
import {Helmet} from 'react-helmet'

const Home = () => {

    return(
        <div className="home">
            <Helmet>
                <title> Home | VehicleToRent Inc</title>
            </Helmet>
            <Navbar pageName={"home"}/>
            <AvailableCars />
            <div className="flex justify-center">
                <button onClick={() => window.location.href = '/rent'} className="mx-auto my-32 text-lg px-5 py-3 border-2 border-emerald-400 rounded-md hover:bg-emerald-400 hover:shadow-xl transition duration-300 hover:text-white hover:scale-105">
                    Go to Vehicle Reservation Page
                </button>
            </div>
        </div>
    )
}

export default Home