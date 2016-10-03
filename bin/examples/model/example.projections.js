import { makeTypedFactory } from "typed-immutable-record";
import { Projection } from '../../src/modeljx';
export const innerServerToClient = {
    from: makeTypedFactory({
        value: ''
    }),
    to: makeTypedFactory({
        value: ''
    })
};
Projection
    .using(innerServerToClient)
    .register((from) => {
    return {
        value: from.value
    };
});
export const serverToClient = {
    from: makeTypedFactory({
        value: '',
        inner: {
            value: ''
        },
    }),
    to: makeTypedFactory({
        value: '',
        isDirty: false,
        moreData: {
            value: ''
        }
    })
};
Projection
    .using(serverToClient)
    .register((from) => {
    return {
        value: `${from.value}: Logic added.`,
        isDirty: false,
        moreData: Projection.using(innerServerToClient).project(from.inner)
    };
});
