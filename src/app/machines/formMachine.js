import { createMachine, assign } from 'xstate';

const validateUserData = (context, event) => {
    const { name, email } = context.userData;
    const errors = {};

    // validate name
    if (!name || name === '') {
        errors.name = 'Name is required';
    }

    // validate email
    if (!email || email === '') {
        errors.email = 'Email is required';
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        errors.email = 'Email is not valid';
    }

    return errors;
};

const validateSurveyData = (context, event) => {
    const { question1 } = context.surveyData;
    const errors = {};

    // validate question1
    if (!question1 || question1 === '') {
        errors.question1 = 'Answer for question 1 is required';
    }

    // validate more questions as needed...

    return errors;
};

const storeUserData = (context, event) => {
    // Convert the userData object into a JSON string
    const userDataString = JSON.stringify(context.userData);

    // Store it in local storage
    localStorage.setItem('userData', userDataString);
};

const storeSurveyData = (context, event) => {
    // Convert the surveyData object into a JSON string
    const surveyDataString = JSON.stringify(context.surveyData);

    // Store it in local storage
    localStorage.setItem('surveyData', surveyDataString);
};

const formMachine = createMachine(
    {
        /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOgK6zHQEkA7NAYgBkB5AQQBEBtABgF1FQAHVWASwBdeqEhxAAPRAE5m2ACyyArAGYAjACYAbAoAcalZIDsGgDQgAnoiXMl2AwuYPNs5hrVK1AXw+m0WPAWIyVHIAOQBRAA0AFRZ2JBBuPkFhUQkENUVsZlkNbQM1I21tFW1TCwQlaWw1Zm0lDWZlIoVJFQUvHwwcfEJSCnDoxhU4rh4BIRF4tNkVbEl5hcWF7RNzRBUDbVt7BwMlZ0ldXI6QX26AvuCiEIAFAFUYtlFE8ZSpqRl5ZXUtXX0jMqIYrYHYOWRqNQKOzqWQnM7YWC4dAANzAZiodCYT3iL2Sk1A0yK2DqLSUBiMlQykkBFRUsmwSkZ9RUtW0CkhOThXQRSNR6JuACUwgA1IjUO4AZVizzGeNSlnUclydghbIaJQUNMZklstSUCns+Wykg0XL8iJRaNCkUeIwSsom8oQGlkNldBlkhjyijcahpzhkBlaGkkqhDRgUbTNOAtfOtg2GMqSjveCHkMkqLkhLKhjRUNJKOqZ9ShRSKns83lO3NjVuu91tSde+PEiFkRJJofJGkpnppkjUWTq9U0ey0+200ewAGNhMheFhyIKRWLJdKcQ63gTEAYWcTSeTKiorAYtfZqsG8gZmGpJAbTVX4bOyAvMOQJXcAEIAWSIjY3yZbq2CB3oGxQZHk+zyK4-olCCw6kj2zDXioXhViQqAQHAohnE2cqpgAtBoWQOKRZGkXSNJESR5G0chU49IEaB4Sm24IES7L7PsdJksG1JrGmLg0Q4UIGmyOQPp05q8miLFAYSWwzM4riqi0GhtLBxE6IyLo1GSCghlOz7zlgcktmk2iurY4H2HodIsn6AkzDqer1OC1h2IZj41rgABGmACPwkBmU6LK5FkmzqB5YYaKeTkbMSTI9oyshjrCaFAA */
        predictableActionArguments: true,
        id: 'form',
        initial: 'userInfo',
        context: {
            userData: {},
            surveyData: {
                question1: 'Bagel',
                question2: 'Water',
            },
            errors: {},
        },
        states: {
            userInfo: {
                on: {
                    LOAD: {
                        actions: assign({
                            userData: (context, event) =>
                                event.field === 'userData'
                                    ? event.value
                                    : context.userData,
                        }),
                    },
                    NEXT: [
                        {
                            target: 'survey',
                            actions: 'storeUserData',
                            cond: 'noErrors',
                        },
                        {
                            actions: ['validateUserData', 'setErrors'],
                        },
                    ],
                    INPUT: {
                        actions: assign({
                            userData: (context, event) => ({
                                ...context.userData,
                                [event.field]: event.value,
                            }),
                        }),
                    },
                },
            },
            survey: {
                on: {
                    LOAD: {
                        actions: assign({
                            surveyData: (context, event) =>
                                event.field === 'surveyData'
                                    ? event.value
                                    : context.surveyData,
                        }),
                    },
                    PREVIOUS: 'userInfo',
                    NEXT: [
                        {
                            target: 'confirm',
                            actions: 'storeSurveyData',
                            cond: 'noErrors',
                        },
                        {
                            actions: ['validateSurveyData', 'setErrors'],
                        },
                    ],
                    INPUT: {
                        actions: assign({
                            surveyData: (context, event) => ({
                                ...context.surveyData,
                                [event.field]: event.value,
                            }),
                        }),
                    },
                },
            },
            confirm: {
                on: {
                    PREVIOUS: 'survey',
                    SUBMIT: 'submitted',
                },
            },
            submitted: {
                type: 'final',
            },
        },
    },
    {
        actions: {
            validateUserData,
            validateSurveyData,
            setErrors: assign({
                errors: (context, event) => {
                    const userDataErrors = validateUserData(context, event);
                    const surveyDataErrors = validateSurveyData(context, event);
                    return {
                        ...userDataErrors,
                        ...surveyDataErrors,
                    };
                },
            }),
            // ...Other code...
            storeUserData,
            storeSurveyData,
        },
        guards: {
            noErrors: (context, event) => {
                const errors = validateUserData(context, event);
                return Object.keys(errors).length === 0;
            },
        },
    }
);
export default formMachine;

//just test
//test again
