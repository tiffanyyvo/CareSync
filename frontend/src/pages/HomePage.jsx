import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing user data or tokens)
    navigate('/login'); // Redirect to login after logging out
  };

  const styles = {
    container: {
      textAlign: 'center',
      padding: '20px',
    },
    button: {
      float: 'right',
      fontSize: '100%',
    },
    h1: {
      backgroundColor: 'aquamarine',
      fontSize: '400%',
      padding: '20px',
    },
    h2: {
      backgroundColor: 'mediumseagreen',
      fontSize: '300%',
      padding: '20px',
      margin: '20px 0',
    },
    link: {
      color: 'black',
      textDecoration: 'none',
    },
  };

  return (
    <>
    <div className='navbar-wrapper'>
        <NavBar />
      </div>
    </>
  );
};

export default Home;