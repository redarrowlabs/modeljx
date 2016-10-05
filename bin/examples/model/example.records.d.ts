import { TypedRecord } from "typed-immutable-record";
import { IClientViewModelInner, IServerResponseInner, IClientViewModel, IServerResponse } from "./example.models";
export interface IServerResponseRecord extends TypedRecord<IServerResponseRecord>, IServerResponse {
}
export interface IClientViewModelRecord extends TypedRecord<IClientViewModelRecord>, IClientViewModel {
}
export interface IServerResponseInnerRecord extends TypedRecord<IServerResponseInnerRecord>, IServerResponseInner {
}
export interface IClientViewModelInnerRecord extends TypedRecord<IClientViewModelInnerRecord>, IClientViewModelInner {
}
export declare const ServerResponseInnerRecord: (val?: IServerResponseInner | undefined) => IServerResponseInnerRecord;
export declare const ClientViewModelInnerRecord: (val?: IClientViewModelInner | undefined) => IClientViewModelInnerRecord;
export declare const ServerResponseRecord: (val?: IServerResponse | undefined) => IServerResponseRecord;
export declare const ClientViewModelRecord: (val?: IClientViewModel | undefined) => IClientViewModelRecord;
