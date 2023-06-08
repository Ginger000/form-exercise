// Form.js
'use client'
import React, {useEffect} from 'react';
import { useMachine } from '@xstate/react';
import formMachine from '../machines/formMachine';

export function Form() {
  const [state, send] = useMachine(formMachine);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedSurveyData = localStorage.getItem('surveyData');

    if (storedUserData) {
      send({
        type: 'LOAD',
        field: 'userData',
        value: JSON.parse(storedUserData),
      });
    }

    if (storedSurveyData) {
      send({
        type: 'LOAD',
        field: 'surveyData',
        value: JSON.parse(storedSurveyData),
      });
    }
  }, []);

  // Callback for onChange events from input elements
  const handleChange = (e) => {
    send({
      type: 'INPUT',
      field: e.target.name,
      value: e.target.value,
    });
  };

  // Callback for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    send('NEXT');
  };

  const goBack = () => {
    send('PREVIOUS');
  };

  // Conditional rendering based on the current state
  return (
    <div>
       {state.matches('userInfo') && (
        <form onSubmit={handleSubmit} >
          <h2>User Information</h2>
          <label>
            Name:
            <input data-testid="name-input" type="text" name="name" value={state.context.userData.name || ''} onChange={handleChange} />
            {state.context.errors.name && <span>{state.context.errors.name}</span>}
          </label>
          <br />
          <label>
            Email:
            <input data-testid="email-input" name="email" value={state.context.userData.email || ''} onChange={handleChange} />
            {state.context.errors.email && <span>{state.context.errors.email}</span>}
          </label>
          <br />
          <button type="submit">Next</button>
        </form>
      )}
      {state.matches('survey') && (
        <form onSubmit={handleSubmit}>
          <h2>Survey</h2>
          <label>
            Question 1:
            <p>What would you like for breakfast?</p>
            <select name="question1" value={state.context.surveyData.question1 || ''} onChange={handleChange}>
              
              <option value="Bagel">Bagel</option>
              <option value="Bun">Bun</option>
              <option value="Cereal">Cereal</option>
              {/* Add more options as needed */}
            </select>
          </label>
          <label>
            Question 2:
            <p>What drink would u like?</p>
            <select name="question2" value={state.context.surveyData.question2 || ''} onChange={handleChange}>

              <option value="Water">Water</option>
              <option value="Milk">Milk</option>
              <option value="Milk">Tea</option>
              <option value="Milk">Coffee</option>
              <option value="Orange Juice">Orange Juice</option>
              {/* Add more options as needed */}
            </select>
          </label>
          {/* Add more questions as needed */}
          <button type="button" onClick={goBack}>Back</button>
          <button type="submit">Next</button>
        </form>
      )}
      {state.matches('confirm') && (
        <div>
          <h2>Confirmation</h2>
          {/* Display the user data and survey data */}
          <p>Name: {state.context.userData.name}</p>
          <p>Email: {state.context.userData.email}</p>
          <p>Question 1 Breakfast choice: {state.context.surveyData.question1}</p>
          <p>Question 2 Drink choice: {state.context.surveyData.question2}</p>
          {/* Display more data as needed */}
          <button type="button" onClick={goBack}>Back</button>
          <button type="button" onClick={() => send('SUBMIT')}>Submit</button>
        </div>
      )}
      {state.matches('submitted') && (
        <div>
          <h2>Form Submitted!</h2>
          {/* Display a success message or do a redirect */}
        </div>
      )}
    </div>
  );
}