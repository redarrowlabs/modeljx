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
            const expectedValue = 'Hello there';
            const expectedInnerValue = 'something';
            const expectedAnotherInnerValue = 'inner something';

            const projected = Response_to_ViewModel(
                {
                    value: expectedValue,
                    inner: {
                        value: expectedInnerValue
                    },
                    anotherInner: {
                        value: expectedAnotherInnerValue
                    },
                    DifferentCase: 'value'
                }) as IClientViewModel;

            projected.value.should.equal(expectedValue);
            projected.moreData.value.should.equal(expectedInnerValue);
            projected.anotherInner.value.should.equal(expectedAnotherInnerValue);
        });

        it('can project based on conditions', () => {
            var magicValue = 'magic';

            const projected = Response_to_ViewModel(
                {
                    value: 'Hello there',
                    inner: {
                        value: magicValue
                    },
                    anotherInner: {
                        value: magicValue
                    },
                    DifferentCase: magicValue
                }) as IClientViewModel;
            projected.anotherInner.should.not.equal(magicValue); // This has a conditional 'when' projection. Notice the 'not'.
            projected.moreData.value.should.equal(magicValue);   // This is projected directly
            projected.differentcase.should.equal(magicValue);
        });
    });
});