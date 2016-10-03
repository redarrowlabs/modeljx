import chai from 'chai';
chai.should();
describe('ProjectionContainer', () => {
    describe('serverToClient', () => {
        it('registers and executes properly', () => {
            const projected = ProjectionContainer
                .using(serverToClient)
                .project({});
        });
    });
});
