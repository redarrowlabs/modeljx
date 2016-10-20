import * as chai from 'chai';

import {Response_to_ViewModel} from "./example.projections";
import {DomainObject} from "./example.client.models";

import * as Immutable from 'immutable';

chai.should();

//
// The ability to test your data shape projections seperately from
// the other logic in your app is one of the reasons to use a framework like this one:
//
describe('ProjectionBuilder', () => {
    describe('build', () => {
        it('handles collections w/out needing a seperate projection definition', () => {
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
            ]) as Immutable.List<DomainObject>;

            JSON.stringify(projected.toJS()).should.equal(JSON.stringify([
                {
                    value: "Hello there",
                    isDirty: false,
                    moreData: {
                        value: "something"
                    },
                    anotherInner: {
                        value: "inner something"
                    },
                    differentcase: ""
                },
                {
                    value: "Something else in a collection",
                    isDirty: false,
                    moreData: {
                        value: "inner value"
                    },
                    anotherInner: {
                        value: "inner something"
                    },
                    differentcase: ""
                },
                {
                    value: "Another collection item",
                    isDirty: false,
                    moreData: {
                        value: "in"
                    },
                    anotherInner: {
                        value: "inner something"
                    },
                    differentcase: ""
                }
            ]));
        });

        it('can also project a single model outside of a collection', () => {

            const projected = Response_to_ViewModel(
                {
                    value: "Hello there",
                    inner: {
                        value: "something"
                    },
                    anotherInner: {
                        value: "inner something"
                    },
                    DifferentCase: 'value'
                }) as DomainObject;

            JSON.stringify((projected as any).toJS()).should.equal(JSON.stringify({
                    value: "Hello there",
                    isDirty: false,
                    moreData: {
                        value: "something"
                    },
                    anotherInner: {
                        value: "inner something"
                    },
                    // Note: this is projected from uppercased DifferentCase:
                    differentcase: "value"
                }
            ));
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
                    },
                    DifferentCase: 'magic'
                }) as DomainObject;

            JSON.stringify((projected as any).toJS()).should.equal(JSON.stringify({
                    value: "Hello there",
                    isDirty: false,
                    moreData: {
                        value: "magic"
                    },
                    // Notice that the projection 'did some magic' because the server
                    // responded with a 'magic' value.
                    // This can be used to perform more advanced transforms on server data that
                    // you may or may not have control over.
                    anotherInner: "did some magic",
                    differentcase: "magic"
                }
            ));
        });
    });
});