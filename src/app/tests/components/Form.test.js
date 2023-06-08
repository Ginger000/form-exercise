import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Form } from '../../components/Form';
import mockLocalStorage from '../mocks/localStorage';

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

test('loads with initial state', () => {
    const { getByLabelText } = render(<Form />);
    expect(getByLabelText(/Name:/i).value).toBe('');
    expect(getByLabelText(/Email:/i).value).toBe('');
});

test('allows entering of name and email', () => {
    const { getByLabelText } = render(<Form />);
    fireEvent.change(getByLabelText(/Name:/i), {
        target: { value: 'John Doe' },
    });
    fireEvent.change(getByLabelText(/Email:/i), {
        target: { value: 'john.doe@example.com' },
    });

    expect(getByLabelText(/Name:/i).value).toBe('John Doe');
    expect(getByLabelText(/Email:/i).value).toBe('john.doe@example.com');
});

//* state transition
test('allows progressing to the survey form', async () => {
    const { getByText, getByLabelText, queryByText } = render(<Form />);
    fireEvent.change(getByLabelText(/Name:/i), {
        target: { value: 'John Doe' },
    });
    fireEvent.change(getByLabelText(/Email:/i), {
        target: { value: 'john.doe@example.com' },
    });
    fireEvent.click(getByText(/Next/i));

    await waitFor(() =>
        expect(queryByText(/User Information/i)).not.toBeInTheDocument()
    );

    expect(queryByText(/Survey/i)).toBeInTheDocument();
    expect(getByLabelText(/Question 1:/i).value).toBe('Bagel');
    expect(getByLabelText(/Question 2:/i).value).toBe('Water');
});

//*state transition
test('validate user data when moving to survey', async () => {
    const { getByText, getByLabelText, findByText } = render(<Form />);

    fireEvent.change(getByLabelText(/Name:/i), { target: { value: '' } });
    fireEvent.change(getByLabelText(/Email:/i), {
        target: { value: 'invalid' },
    });
    fireEvent.click(getByText(/Next/i));

    expect(await findByText(/Name is required/i)).toBeInTheDocument();
    expect(await findByText(/Email is not valid/i)).toBeInTheDocument();
});

//*state transition
test('transitions to confirmation and submitted state', async () => {
    const { getByText, getByLabelText, findByText } = render(<Form />);

    // Fill out user data
    fireEvent.change(getByLabelText(/Name:/i), {
        target: { value: 'John Doe' },
    });
    fireEvent.change(getByLabelText(/Email:/i), {
        target: { value: 'john.doe@example.com' },
    });
    fireEvent.click(getByText(/Next/i));

    // Fill out survey data
    fireEvent.change(getByLabelText(/Question 1:/i), {
        target: { value: 'Bagel' },
    });
    fireEvent.change(getByLabelText(/Question 2:/i), {
        target: { value: 'Water' },
    });
    fireEvent.click(getByText(/Next/i));

    // Confirm data
    fireEvent.click(getByText(/Submit/i));

    expect(await findByText(/Form Submitted!/i)).toBeInTheDocument();
});

//*test localStorage
test('stores user data in local storage and loads from it', async () => {
    const { getByText, getByLabelText } = render(<Form />);

    fireEvent.change(getByLabelText(/Name:/i), {
        target: { value: 'John Doe' },
    });
    fireEvent.change(getByLabelText(/Email:/i), {
        target: { value: 'john.doe@example.com' },
    });
    fireEvent.click(getByText(/Next/i));

    expect(JSON.parse(window.localStorage.getItem('userData'))).toEqual({
        name: 'John Doe',
        email: 'john.doe@example.com',
    });

    //render a new form
    const { getByTestId } = render(<Form />);

    expect(getByTestId('name-input').value).toBe('John Doe');
    expect(getByTestId('email-input').value).toBe('john.doe@example.com');
});
