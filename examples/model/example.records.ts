import {TypedRecord, makeTypedFactory} from "typed-immutable-record";

import {
    IClientViewModelInner,
    IServerResponseInner,
    IClientViewModel,
    IServerResponse
} from "./example.models";

export interface IServerResponseRecord extends TypedRecord<IServerResponseRecord>, IServerResponse {}
export interface IClientViewModelRecord extends TypedRecord<IClientViewModelRecord>, IClientViewModel {}
export interface IServerResponseInnerRecord extends TypedRecord<IServerResponseInnerRecord>, IServerResponseInner {}
export interface IClientViewModelInnerRecord extends TypedRecord<IClientViewModelInnerRecord>, IClientViewModelInner {}


export const ServerResponseInnerRecord = makeTypedFactory<IServerResponseInner, IServerResponseInnerRecord>({
    value: ''
});

export const ClientViewModelInnerRecord = makeTypedFactory<IClientViewModelInner, IClientViewModelInnerRecord>({
    value: ''
});

export const ServerResponseRecord = makeTypedFactory<IServerResponse, IServerResponseRecord>({
    value: '',
    inner: {
        value: ''
    },
    anotherInner: {
        value: ''
    }
});

export const ClientViewModelRecord = makeTypedFactory<IClientViewModel, IClientViewModelRecord>({
    value: '',
    isDirty: false,
    moreData: {
        value: ''
    },
    anotherInner: {
        value: ''
    }
});