import React, { useEffect, useState } from 'react';
import logo from '../assets/Non.png';

const InvitePage: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [inviteCount, setInviteCount] = useState(0);
    const [totalCTS, setTotalCTS] = useState(0);
    const [inviteLink, setInviteLink] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Fetch the current user from the backend
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users/current`);
                const data = await response.json();
                if (response.ok) {
                    setUserName(data.userName);
                } else {
                    setError(data.message || "Failed to load user data.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Unable to fetch user data.");
            }
        };

        fetchUserName();
    }, []);

    // Set the current user (for development purposes)
    useEffect(() => {
        const setCurrentUser = async () => {
            if (!userName) {
                setError("User name is not available.");
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/users/set-current-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userName })
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message || "Failed to set current user.");
                } else {
                    console.log("Current user set successfully:", data.message);
                }
            } catch (error) {
                console.error("Error setting current user:", error);
                setError("Unable to set current user.");
            }
        };

        if (userName) {
            setCurrentUser();
        }
    }, [userName]);

    // Fetch invite data (invited friends count, total CTS earned)
    useEffect(() => {
        const fetchInviteData = async () => {
            if (!userName) {
                setError("User name is not available.");
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/invite/invite-data/${userName}`);
                const data = await response.json();
                if (response.ok) {
                    setInviteCount(data.inviteCount);
                    setTotalCTS(data.ctsEarned);
                } else {
                    setError(data.message || "Failed to load invite data.");
                }
            } catch (error) {
                console.error("Error fetching invite data:", error);
                setError("Unable to fetch invite data.");
            }
        };

        if (userName) {
            fetchInviteData();
        }
    }, [userName]);

    // Generate invite link for the inviter
    const generateInviteLink = async () => {
        if (!userName) {
            setError("User name is not available.");
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/invite/generate-invite-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName })
            });
            const data = await response.json();
            if (response.ok) {
                setInviteLink(data.inviteLink);
            } else {
                setError(data.message || "Failed to generate invite link.");
            }
        } catch (error) {
            console.error("Error generating invite link:", error);
            setError("Unable to generate invite link.");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied to clipboard!");
    };

    return (
        <div style={styles.container}>
            <img src={logo} alt="Logo" style={styles.logo} />
            <h2 style={styles.title}>Invite Friends to Get More NDT</h2>
            <h3>Total Friends Invited: <span style={styles.highlight}>{inviteCount}</span></h3>
            <h3>Total NDT Earned: <span style={styles.highlight}>{totalCTS}</span></h3>

            <div style={styles.inviteSection}>
                {inviteCount === 0 ? (
                    <>
                        <button onClick={generateInviteLink} style={styles.button}>
                            Generate Invite Link
                        </button>
                        {inviteLink && (
                            <div style={styles.linkContainer}>
                                <p>Share this link with your friends:</p>
                                <input type="text" readOnly value={inviteLink} style={styles.linkInput} />
                                <button onClick={copyToClipboard} style={styles.copyButton}>
                                    Copy Link
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <button onClick={generateInviteLink} style={styles.button}>
                        Invite More Friends
                    </button>
                )}
            </div>

            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
};

// Define styles as a constant object
const styles = {
    container: {
        padding: '20px',
        textAlign: 'center' as 'center', // Explicit type for textAlign
        minHeight: '100vh',
    } as React.CSSProperties,
    logo: {
        margin: '20px',
        width: '150px',
    } as React.CSSProperties,
    title: {
        fontWeight: 'bold',
        margin: '20px 0',
    } as React.CSSProperties,
    highlight: {
        fontWeight: 'bold',
        color: '#00f',
    } as React.CSSProperties,
    inviteSection: {
        marginTop: '30px',
    } as React.CSSProperties,
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: '#000',
        color: '#fff',
        cursor: 'pointer',
        border: 'none',
        margin: '10px 0',
    } as React.CSSProperties,
    linkContainer: {
        marginTop: '20px',
    } as React.CSSProperties,
    linkInput: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginTop: '10px',
    } as React.CSSProperties,
    copyButton: {
        marginTop: '10px',
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: '#000',
        color: '#fff',
        cursor: 'pointer',
        border: 'none',
    } as React.CSSProperties,
    error: {
        color: 'red',
        marginTop: '10px',
    } as React.CSSProperties,
};

export default InvitePage;