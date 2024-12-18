

import React, { useState, useEffect } from "react";
import './styles.css';
//require('dotenv').config();

const HubDBForm = () => {

  
  
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    topics:[],
    industry:"",
    type: "",
    audience: ""


  });
  const [responseMessage, setResponseMessage] = useState("");

  const [columns, setColumns] = useState([]);

  const [error, setError] = useState(null);

  // State to store fetched topics, industries,  asset types and audience
  const [availableTopics, setAvailableTopics] = useState([]);
  const [availableIndustries, setAvailableIndustries] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableAudience, setAvailableAudience] = useState([]);

   // State for loading indicators
   const [loadingTopics, setLoadingTopics] = useState(true);
   const [loadingIndustries, setLoadingIndustries] = useState(true);
   const [loadingAssets, setLoadingAssets] = useState(true);

   const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isSubmitted, setIsSubmitted] = useState(false); // Submission success state

   // State for confirmation message
  const [successMessage, setSuccessMessage] = useState('');

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const successMessageStyle = {
    backgroundColor: '#d4edda', // Light green background
    color: '#155724', // Dark green text
    padding: '10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    marginTop: '10px',
  };

  const buttonStyle= {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: isLoading ? "#cccccc" : "#ff7a59",
    color: isLoading ? "#666666" : "#fff",
    //color: "#fff",
    fontFamily: "Lexend Deca, sans-serif",
    transition: "background-color 0.3s ease",
    border: "none",
    cursor: isLoading ? "not-allowed" : "pointer",
    borderRadius: "4px",
  //cursor: "pointer",
  };

 

  useEffect(() => {
    const fetchColumns = async () => {
      setLoadingTopics(true);
        try {
            const response = await fetch("/hs/serverless/parrot");
           
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("HEYY"+JSON.stringify(data));
       
            setAvailableTopics(data.topics);
            setAvailableTypes(data.types);
            setAvailableIndustries(data.industries);
            setAvailableAudience(data.audience)

        } catch (err) {
            setError('Error fetching column data');
        }finally {
          setLoadingTopics(false);
        }
    };

    fetchColumns();
}, []);



  //handle inputs title and link
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
  };



  const handleTopicChange = (topic) => {
    setFormData((prevFormData) => {
      const topics = prevFormData.topics.includes(topic)
        ? prevFormData.topics.filter((t) => t !== topic) // Remove topic if already selected
        : [...prevFormData.topics, topic]; // Add topic if not already selected
      return { ...prevFormData, topics };
    });
  };

 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading
    console.log("Form Data Submitted: ", formData);
    try {
      const response = await fetch("/hs/serverless/parrot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoading(false); // Hide loading
        setIsSubmitted(true); // Show success message
        setIsPopupVisible(true); // Show the pop-up
        setSuccessMessage('Asset has been successfully added! Thank you 😄'); // Set success message
        setFormData({ title: '', link: '', topics: [], industry: '', type: '', audience: '' }); // Reset form data
        
      } else {
         console.log("HERE");
        setSuccessMessage('Failed to add asset. Please try again.'); // Set error message
        setResponseMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.log("HERE222"+x);
      setSuccessMessage('Failed to add asset. Please try again.'); // Set error message
      setResponseMessage(`Error: ${error.message}`);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Hide the pop-up
    setIsSubmitted(false);
  };

  


  // Split availableTopics into two halves for two columns
  const midpoint = Math.ceil(availableTopics.length / 2);
  const firstColumnTopics = availableTopics.slice(0, midpoint);
  const secondColumnTopics = availableTopics.slice(midpoint);

  return (
    <div className="form-container" style={styles.container}>
      <h2 style={styles.header}>Submit New Asset</h2>
      <p> {columns} </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title Field */}
        <div style={styles.field}>
          <label style={styles.label}>Asset Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a title"
            style={styles.input}
            required
          />
        </div>

        {/* Link Field */}

        <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
        <div style={{ ...styles.field, flex: 1 }}>
            <label style={styles.label}>Asset Link *</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Enter a link"
              style={styles.input}
              required
            />
          </div>


        {/* Industry Dropdown */}
        <div style={{ ...styles.field, flex: 1 }}>
          <label>Industry *</label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            required
          >
            <option value="" disabled>Select Industry</option>
            {availableIndustries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

      </div>

        {/* Asset Dropdown */}

        <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
        <div style={{ ...styles.field, flex: 1 }}>
        <label>Asset Type *</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        >
          <option value="" disabled>Select Type</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>


        {/* Audience Dropdown */}
        <div style={{ ...styles.field, flex: 1 }}>
        <label>Audience *</label>
        <select
          value={formData.audience}
          onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
          required
        >
          <option value="" disabled>Select Audience</option>
          {availableAudience.map((audience) => (
            <option key={audience} value={audience}>
              {audience}
            </option>
          ))}
        </select>
      </div>

      </div>


{/* Topics Dropdown with Checkboxes in Two Columns */}
      <div>
        <label>Topics *</label>
        <div style={{ display: 'flex', gap: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
          {/* Show loading spinner if topics are loading */}
          {loadingTopics ? (
           <div> Loading Topics... </div> // Loading spinner 
          ) : (
            <>
          {/* First Column */}
          <div>
            {firstColumnTopics.map((topic) => (
              <div key={topic}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.topics.includes(topic)}
                    onChange={() => handleTopicChange(topic)}
                  />
                  {topic}
                </label>
              </div>
            ))}
          </div>

          {/* Second Column */}
          <div>
            {secondColumnTopics.map((topic) => (
              <div key={topic}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.topics.includes(topic)}
                    onChange={() => handleTopicChange(topic)}
                  />
                  {topic}
                </label>
              </div>
            ))}
          </div>
          </>
        )}
        </div>
      </div>
        
        {/* Submit Button */}
        <button type="submit" style={buttonStyle} disabled={isLoading}>
          {isLoading ? "Submitting Asset..." : "Submit"}
        </button>
      </form>

       {/* Pop-Up */}
       {isPopupVisible && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2 style={{ fontFamily: "'Lexend Deca', sans-serif"}}>Asset Submitted!</h2>
            <p style={{ fontFamily: "'Lexend Deca', sans-serif", fontWeight:300}}>Your asset has been successfully added! Thank you 😄</p>
            <button style={styles.button} onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
    </div>
  );
};

// Basic inline styles for simplicity
const styles = {
  
  
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Lexend Deca, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: "Lexend Deca, sans-serif",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "8px",
    gap: "15px",
    fontFamily: "Lexend Deca, sans-serif",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "Lexend Deca, sans-serif",

    color: "#555",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontFamily: "Lexend Deca, sans-serif",
    fontSize: "16px",
  },
  select: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontFamily: "Lexend Deca, sans-serif",
    fontSize: "16px",
  },
  checkboxGroup: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  button: {
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor:  "#ff7a59",
    color: "#fff",
    fontFamily: "Lexend Deca, sans-serif",
    border: "none",
    borderRadius: "4px",
  cursor: "pointer",
  },


  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  

  
};

export default HubDBForm;

