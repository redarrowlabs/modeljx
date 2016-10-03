import {TypedRecord} from "typed-immutable-record";

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