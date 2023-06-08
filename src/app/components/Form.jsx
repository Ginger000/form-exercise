// Form.js
'use client'
import React, {useEffect} from 'react';
import { useMachine } from '@xstate/react';
import formMachine from '../machines/formMachine';
import styles from './Form.module.css'

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
          <div className={styles.itemContainer}>
          <label >
            
            Name:
            <br />
            <input className={styles.myInput} data-testid="name-input" type="text" name="name" value={state.context.userData.name || ''} onChange={handleChange} />
            {state.context.errors.name && <div className={styles.warning}>{state.context.errors.name}</div>}
          </label>
          </div>
          
          <div className={styles.itemContainer}>
          <label >
            
            Email:
            <br />
            <input className={styles.myInput} data-testid="email-input" name="email" value={state.context.userData.email || ''} onChange={handleChange} />
            {state.context.errors.email && <div className={styles.warning}>{state.context.errors.email}</div>}
          </label>
          </div>
     
          <button className={styles.btn} type="submit">Next</button>
        </form>
      )}
      {state.matches('survey') && (
        <form onSubmit={handleSubmit}>
          <h2>Survey</h2>
          <div className={styles.itemContainer}>
          <label >
            Question 1:
            <p>What would you like for breakfast?</p>
            <select className={styles.mySelect} name="question1" value={state.context.surveyData.question1 || ''} onChange={handleChange}>
              
              <option className={styles.option} value="Bagel">Bagel</option>
              <option className={styles.option} value="Bun">Bun</option>
              <option className={styles.option} value="Cereal">Cereal</option>
        
            </select>
          </label>
          </div>
          <div className={styles.itemContainer}>
          <label >
            Question 2:
            <p>What drink would u like?</p>
            <select className={styles.mySelect} name="question2" value={state.context.surveyData.question2 || ''} onChange={handleChange}>

              <option className={styles.option} value="Water">Water</option>
              <option className={styles.option} value="Milk">Milk</option>
              <option className={styles.option} value="Milk">Tea</option>
              <option className={styles.option} value="Milk">Coffee</option>
              <option className={styles.option} value="Orange Juice">Orange Juice</option>

            </select>
          </label>
          </div>
          {/* Add more questions as needed */}
          <div className={styles.btnContainer}>
          <button className={styles.btn} type="button" onClick={goBack}>Back</button>
          <button className={styles.btn} type="submit">Next</button>
          </div>
          
        </form>
      )}
      {state.matches('confirm') && (
        <div>
          <h2 >Confirmation</h2>
          <p>Name: {state.context.userData.name}</p>
          <p>Email: {state.context.userData.email}</p>
          <p>Question 1 Breakfast choice: {state.context.surveyData.question1}</p>
          <p>Question 2 Drink choice: {state.context.surveyData.question2}</p>
          {/* Display more data as needed */}
          <div className={styles.btnContainer}>
          <button className={styles.btn} type="button" onClick={goBack}>Back</button>
          <button className={styles.btn} type="button" onClick={() => send('SUBMIT')}>Submit</button>
          </div>
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