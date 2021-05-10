import axios from 'axios'
import React , { useState } from 'react'

const Form = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked((selectedFile)?true:false);
  };


  const handleSubmission = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('File', selectedFile);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);

    console.log('hi');
    const config = {
      headers: {
        "Contetnt-Type": "multipart/form-data"
      }
    };

    axios.post('http://localhost:8000/users', formData , config).then((result) => {
      console.log('Success:', result);
    })
      .catch((error) => {
        console.error('Error:', error);
      });

    // console.log(selectedFile);
  };


  return (
    <div className="App">
      <div>
        FirstName:
        <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
      </div>
      <div>
        LastName:
        <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
      </div>
      <div>
        Email:
        <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
      </div>
        <input type="file" name="myImager" onChange={changeHandler} />
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
      {isFilePicked ? (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{' '}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
    </div>
  );
}


export default Form;

