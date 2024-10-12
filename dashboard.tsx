import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Non.png';

const Dashboard = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [ctsBalance, setCtsBalance] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Initialize navigate

    const fetchUserData = async () => {
        const storedUsername = localStorage.getItem('username');
        const storedCtsBalance = localStorage.getItem('ctsBalance');

        // If both username and balance exist in local storage, use them
        if (storedUsername && storedCtsBalance) {
            setUsername(storedUsername);
            setCtsBalance(parseFloat(storedCtsBalance));
        } else if (storedUsername) {
            // Otherwise, fetch from the backend
            try {
                const checkRes = await axios.get(`${import.meta.env.VITE_API_URL}/users/check/${storedUsername}`);

                // Redirect if the user doesn't exist
                if (!checkRes.data.exists) {
                    navigate('/'); // Redirect to the welcome page
                    return;
                }

                // Fetch user data
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${storedUsername}`);
                setUsername(res.data.userName);
                setCtsBalance(res.data.ctsBalance);

                // Store the data in local storage for future use
                localStorage.setItem('username', res.data.userName);
                localStorage.setItem('ctsBalance', res.data.ctsBalance.toString());
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load user data.");
            }
        } else {
            setError("No username found in local storage.");
        }
    };

    useEffect(() => {
        // Check local storage and fetch data only if necessary
        fetchUserData();

        // Set an interval to refetch user data every 60 seconds
        const intervalId = setInterval(() => {
            fetchUserData();
        }, 60000);

        // Clear the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#7d0000', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
                <img src={logo} alt="logo" style={{ minWidth: '100px', maxWidth: '200px', height: 'auto' }} />
            </div>
            <h1 style={{ fontSize: '6vw', margin: '20px 0', lineHeight: '1.2' }}>
                Welcome, {username || 'Guest'}!
            </h1>
            {ctsBalance !== null && (
                <p style={{ fontSize: '4vw', margin: '10px 0 20px' }}>
                    Your current balance: {ctsBalance} $NDT
                </p>
            )}
            {error && (
                <div style={{ color: 'red', fontSize: '3vw' }}>{error}</div>
            )}
            <div style={{ marginTop: '40px' }}>
                <a 
                    href="/tasks" 
                    style={{
                        color: '#fff',
                        backgroundColor: '#00f',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        fontSize: '4vw',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0057e7')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00f')}
                >
                    View Tasks
                </a>
            </div>
        </div>
    );
};

export default Dashboard;
