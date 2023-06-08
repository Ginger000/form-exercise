import { interpret } from 'xstate';
import formMachine from '../../machines/formMachine';

describe('test Form Machine', () => {
    let service;

    beforeEach(() => {
        service = interpret(formMachine)
            .onTransition((state) => {
                console.log(state.value);
            })
            .start();
    });

    afterEach(() => {
        service.stop();
    });

    it('should reach "survey" state when the "NEXT" event is sent in the "userInfo" state', () => {
        service.send({ type: 'INPUT', field: 'name', value: 'John Doe' });
        service.send({
            type: 'INPUT',
            field: 'email',
            value: 'john.doe@example.com',
        });
        service.send('NEXT'); // move to "survey" state

        expect(service.state.value).toBe('survey');
    });

    it('should validate user data and stay in "userInfo" state if validation fails', () => {
        service.send({ type: 'INPUT', field: 'name', value: '' });
        service.send({ type: 'INPUT', field: 'email', value: 'invalid email' });
        service.send('NEXT'); // move to "survey" state

        expect(service.state.value).toBe('userInfo');
    });

    // Test moving from "survey" to "confirm" state
    it('should reach "confirm" state when the "NEXT" event is sent in the "survey" state', () => {
        service.send({ type: 'INPUT', field: 'name', value: 'John Doe' });
        service.send({
            type: 'INPUT',
            field: 'email',
            value: 'john.doe@example.com',
        });
        service.send('NEXT'); // move to "survey" state
        service.send({
            type: 'INPUT',
            field: 'question1',
            value: 'Answer to question 1',
        });
        service.send('NEXT'); // move to "confirm" state

        expect(service.state.value).toBe('confirm');
    });

    // Test going back from "survey" to "userInfo" state
    it('should reach "userInfo" state when the "PREVIOUS" event is sent in the "survey" state', () => {
        service.send({ type: 'INPUT', field: 'name', value: 'John Doe' });
        service.send({
            type: 'INPUT',
            field: 'email',
            value: 'john.doe@example.com',
        });
        service.send('NEXT'); // move to "survey" state
        service.send('PREVIOUS'); // move back to "userInfo" state

        expect(service.state.value).toBe('userInfo');
    });

    // Test going back from "confirm" to "survey" state
    it('should reach "survey" state when the "PREVIOUS" event is sent in the "confirm" state', () => {
        service.send({ type: 'INPUT', field: 'name', value: 'John Doe' });
        service.send({
            type: 'INPUT',
            field: 'email',
            value: 'john.doe@example.com',
        });
        service.send('NEXT'); // move to "survey" state
        service.send({
            type: 'INPUT',
            field: 'question1',
            value: 'Answer to question 1',
        });
        service.send('NEXT'); // move to "confirm" state
        service.send('PREVIOUS'); // move back to "survey" state

        expect(service.state.value).toBe('survey');
    });

    // Test submission and reach "submitted" state
    it('should reach "submitted" state when the "SUBMIT" event is sent in the "confirm" state', () => {
        service.send({ type: 'INPUT', field: 'name', value: 'John Doe' });
        service.send({
            type: 'INPUT',
            field: 'email',
            value: 'john.doe@example.com',
        });
        service.send('NEXT'); // move to "survey" state
        service.send({
            type: 'INPUT',
            field: 'question1',
            value: 'Answer to question 1',
        });
        service.send('NEXT'); // move to "confirm" state
        service.send('SUBMIT'); // move to "submitted" state

        expect(service.state.value).toBe('submitted');
    });
});
