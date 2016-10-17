import chai from 'chai';

import {Response_to_ViewModel} from "./example.projections";

chai.should();

describe('ProjectionContainer', () => {
    describe('serverToClient', () => {
        it('handles collections', () => {
            const projected = Response_to_ViewModel([
                    {
                        value: 'Hello there',
                        inner: {
                            value: 'something'
                        },
                        anotherInner: {
                            value: 'inner something'
                        }
                    },
                    {
                        value: 'Something else in a collection',
                        inner: {
                            value: 'inner value'
                        },
                        anotherInner: {
                            value: 'inner something'
                        }
                    },
                    {
                        value: 'Another collection item',
                        inner: {
                            value: 'in'
                        },
                        anotherInner: {
                            value: 'inner something'
                        }
                    },
                ]);
            projected.should.not.be.null;
        });


        it('can project a single model', () => {
            const projected = Response_to_ViewModel(
                {
                    value: 'Hello there',
                    inner: {
                        value: 'something' // ~todo~ looks like this wasn't projecting to moreData
                    },
                    anotherInner: {
                        value: 'inner something'
                    }
                });
            projected.should.not.be.null;
        });
    });
});