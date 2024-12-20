import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
import { useState, useEffect } from 'react'
import NavBar from '../components/Navbar/NavBar';

export default function UpdatePage() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMessage, setPassMessage] = useState('');
  const [famMessage, setFamMessage] = useState('');
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL)
    const token = localStorage.getItem('token');
    getTasks(token);
    // Get all tokens from database
    axios
        .get(`${import.meta.env.VITE_API_URL}/api/tokens`)
        .then((res) => {
            console.log('Fetched tokens:', res.data.data)
            setTokens(res.data.data)
        })
        .catch((error) => console.error('Error fetching tokens:', error.message))
}, [])
    // Gets all tasks from database
    function getTasks(token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log('Fetched tasks:', res.data.data)
          setTasks(res.data.data)
        })
        .catch((error) => console.error('Error fetching tasks:', error.message))
        }

  // Updates password on button press
  const updateOnClick = () => {
    // Verfiies token
    const token = localStorage.getItem('token')
    const [header, payload, signature] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload));
    // Checks if a password hasn't been entered
    if(!newPassword || !oldPassword) 
        {
            setPassMessage(
                !newPassword
                    ? "New password not entered."
                    : "Old password not entered."
            );
        }
    // If the token was decoded
    else if(decodedPayload) {
        // Checks if the old password is correct
        if(decodedPayload.password != oldPassword) {
          setPassMessage("Old password is incorrect.")
        }  
        // Ensures the new password meets the proper conditions
        else if(!newPassword.match(/[0-9]/) || !newPassword.match(/[A-Z]/)) {
            setPassMessage("Password must have a captial letter and a number.")
        }
        // Update password
        else {
            updatePassword(decodedPayload._id, newPassword);
        }
    }
    else {
      setPassMessage("Error: Failed to get account information")
    }
  };

  // Join a family when clicking the button
  const joinOnClick = () => {
    // Verifies token
    const token = localStorage.getItem('token')
    const [header, payload, signature] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload));
    // Requires family code to be 5 numbers
    if(passcode.length != 5 || !passcode.match(/[0-9]/)) {
      setFamMessage("Family code needs to be 5 numbers")  
    }
    else {
      // Updates the user, token, and tasks with new family ID
      updateFam(decodedPayload._id, passcode);
      decodedPayload.familyGroup = passcode;
      updateTask(decodedPayload._id, passcode);
      localStorage.removeItem('token');
      const the_token = tokens.find(u => u.token === token);
      const id = the_token._id
      deleteToken(id)
      createToken(decodedPayload);
  };
};

// Sends a requst to update all tasks accoiated with a user ID
function updateTask(userId, familyId) {
  axios
    .put(`${import.meta.env.VITE_API_URL}/api/tasks/updateByUser/${userId}`, { family_id: familyId })
    .then((res) => {
      console.log('Tasks updated successfully:', res.data);
      // Optionally, you can update the local state here if needed
    })
    .catch((error) => console.error('Error updating tasks:', error.message));
}

// Creates a token
function createToken(tokenData) {
  axios
  .post(`${import.meta.env.VITE_API_URL}/api/tokens`, tokenData)
  .then(response => {
  // Handle successful response
      const token = response.data.data.token;  // Assuming the response includes the token
      localStorage.setItem('token', token);
  console.log('Token created:', response.data);
})
.catch((error) => {
  console.log('Error: Failed to create token')
})
};

// Deletes a token
function deleteToken(id) {
  axios
      .delete(`${import.meta.env.VITE_API_URL}/api/tokens/${id}`)
      .catch((error) => { 
        console.error('Error deleting user:', error.message);
      })
}

     // Send PUT request to backend API to update a specific password -- .then() handles response from the server
     function updatePassword(id, updatedPassword) {
        axios
            .put(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {password: updatedPassword})
            .then((res) => {
                setPassMessage("Updated password.")
                setUsers(currUsers =>
                    currUsers.map(user => {
                        if (user._id === id) {
                            return {...user, ...updatedPassword};
                        }
                        return user
                    })
                )
            })
            .catch((error) => { 
              console.error('Error updating user:', error.message);
              setPassMessage('Failed to change password');
            })
    }

         // Send PUT request to backend API to update a specific family -- .then() handles response from the server
         function updateFam(id, updatedFam) {
              axios
                  .put(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {familyGroup: updatedFam})
                  .then((res) => {
                      setFamMessage("Updated family.")
                      setUsers(currUsers =>
                          currUsers.map(user => {
                              if (user._id === id) {
                                  return {...user, ...updatedFam};
                              }
                              return user
                          })
                      )
                  })
                  .catch((error) => { 
                    console.error('Error updating family:', error.message);
                    setFamMessage('Failed to add family');
                  })
          }
  
  const styles = {
    body: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#33364B',
      margin: '0',
    },
    container: {
      padding: '30px',
      backgroundColor: '#ffffff',
      border: '2px solid #4caf50',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      width: '300px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    containerWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px', // Adjust the space between containers
      },
    header: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#4caf50',
    },
    text: {
        fontSize: '14px',
        marginBottom: '20px',
        color: '#4caf50',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#4caf50',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
    link: {
      fontSize: '14px',
      color: '#4caf50',
      textDecoration: 'none',
      display: 'block',
      marginTop: '10px',
    },
    linkHover: {
      textDecoration: 'underline',
    },
    message: {
      color: 'red',
    },
  };

  return (
    <div style={styles.body}>
    <div className='navbar-wrapper'>
        <NavBar />
    </div>
      <div style={styles.containerWrapper}>
      <div style={styles.container}>
      <h3 style={styles.header}>Update Password</h3>
      <p style={styles.text}>Please enter your old password</p>
        <input
            type="text"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={styles.input}
          />
        <input
            type="text"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
           <button
            type="button"
            onClick={updateOnClick}
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Update Password
          </button>
          <p style={styles.message}>{passMessage}</p>
      </div>
      <div style={styles.container}>
        <h3 style={styles.header}>Add Family</h3>
        <p style={styles.text}>Please enter your family's passcode</p>
        <input
            type="text"
            placeholder="Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            style={styles.input}
          />
           <button
            type="button"
            onClick={joinOnClick}
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Join Family
          </button>
          <p style={styles.message}>{famMessage}</p>
      </div>
      </div>
    </div>
  );
};