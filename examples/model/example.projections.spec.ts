import chai from 'chai';
import {IClientViewModel} from "./example.models";
import {Projection} from "../../src/modeljx";
import {serverToClient} from "./example.projections";

chai.should();

describe('ProjectionContainer', () => {
    describe('serverToClient', () => {
        it('registers and executes properly', () => {
            const projected: IClientViewModel = Projection
                .using(serverToClient)
                .project([
                    {
                        value: 'Hello there',
                        inner: {
                            value: 'something'
                        }
                    },
                    {
                        value: 'Something else in a collection',
                        inner: {
                            value: 'inner value'
                        }
                    },
                    {
                        value: 'Another collection item',
                        inner: {
                            value: 'in'
                        }
                    },
                ]);

            projected.should.not.be.null;
        });
    });
});