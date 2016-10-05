import { makeTypedFactory } from "typed-immutable-record";
export const ServerResponseInnerRecord = makeTypedFactory({
    value: ''
});
export const ClientViewModelInnerRecord = makeTypedFactory({
    value: ''
});
export const ServerResponseRecord = makeTypedFactory({
    value: '',
    inner: {
        value: ''
    },
    anotherInner: {
        value: ''
    }
});
export const ClientViewModelRecord = makeTypedFactory({
    value: '',
    isDirty: false,
    moreData: {
        value: ''
    },
    anotherInner: {
        value: ''
    }
});
