import React from 'react';
import { Link } from 'react-router-dom'; // For routing

const Navbar = () => {
    const navbarStyle = {
        backgroundColor: '#D6E4F0', 
        padding: '10px 20px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    };

    const navbarContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    };

    const logoStyle = {
        height: '50px'
    };

    const navLinksStyle = {
        listStyle: 'none',
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        margin: 0,
        padding: 0
    };

    const navLinkItemStyle = {
        margin: '0 15px'
    };

    const navLinkStyle = {
        color: '#000000',
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'color 0.3s ease'
    };

    const navLinkHoverStyle = {
        color: '#8EACCD'
    };

    const loginButtonStyle = {
        backgroundColor: '#ffcc00',
        color: '#003366',
        padding: '10px 15px',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.3s ease'
    };

    const loginButtonHoverStyle = {
        backgroundColor: '#e6b800',
        transform: 'translateY(-2px)'
    };

    return (
        <header>
            <nav style={navbarStyle}>
                <div style={navbarContainerStyle}>
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <img src="images/nss logo.jpeg" alt="NSS Logo" style={logoStyle} />
                    </Link>

                    {/* Navbar Links */}
                    <ul style={navLinksStyle}>
                        <li style={navLinkItemStyle}>
                            <Link 
                                to="/" 
                                style={navLinkStyle} 
                                onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color}
                                onMouseOut={(e) => e.target.style.color = navLinkStyle.color}
                            >
                                Home
                            </Link>
                        </li>
                        <li style={navLinkItemStyle}>
                            <Link 
                                to="/about" 
                                style={navLinkStyle}
                                onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color}
                                onMouseOut={(e) => e.target.style.color = navLinkStyle.color}
                            >
                                About Us
                            </Link>
                        </li>
                        <li style={navLinkItemStyle}>
                            <Link 
                                to="#" 
                                style={navLinkStyle}
                                onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color}
                                onMouseOut={(e) => e.target.style.color = navLinkStyle.color}
                            >
                                Events
                            </Link>
                        </li>
                        <li style={navLinkItemStyle}>
                            <Link 
                                to="/team" 
                                style={navLinkStyle}
                                onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color}
                                onMouseOut={(e) => e.target.style.color = navLinkStyle.color}
                            >
                                Team
                            </Link>
                        </li>
                        <li style={navLinkItemStyle}>
                            <Link 
                                to="/gallery" 
                                style={navLinkStyle}
                                onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color}
                                onMouseOut={(e) => e.target.style.color = navLinkStyle.color}
                            >
                                Gallery
                            </Link>
                        </li>
                        <li style={navLinkItemStyle}>
                            <Link 
                                to="/contact" 
                                style={navLinkStyle}
                                onMouseOver={(e) => e.target.style.color = navLinkHoverStyle.color}
                                onMouseOut={(e) => e.target.style.color = navLinkStyle.color}
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>

                    {/* Login Button */}
                    <Link 
                        to="/login" 
                        style={loginButtonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = loginButtonHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = loginButtonStyle.backgroundColor}
                    >
                        Login
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
