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
        service.send('NEXT');

        expect(service.state.value).toBe('survey');
    });

    it('should validate user data and stay in "userInfo" state if validation fails', () => {
        service.send({ type: 'INPUT', field: 'name', value: '' });
        service.send({ type: 'INPUT', field: 'email', value: 'invalid email' });
        service.send('NEXT');

        expect(service.state.value).toBe('userInfo');
    });
});
