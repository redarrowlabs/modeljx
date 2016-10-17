import chai from 'chai';

import {Response_to_ViewModel} from "./example.projections";
import {IClientViewModel} from "./example.models";

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
                        value: 'something'
                    },
                    anotherInner: {
                        value: 'inner something'
                    }
                });
            projected.should.not.be.null;
        });


        it('can project based on conditions', () => {
            const projected = Response_to_ViewModel(
                {
                    value: 'Hello there',
                    inner: {
                        value: 'magic'
                    },
                    anotherInner: {
                        value: 'magic'
                    }
                }) as IClientViewModel;
            debugger;
            projected.anotherInner.should.equal("did some magic"); // this is defined by a conditional expression in the projection.
        });
    });
});