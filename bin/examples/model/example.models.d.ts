export interface IServerResponse {
    value: string;
    inner: IServerResponseInner;
}
export interface IServerResponseInner {
    value: string;
}
export interface IClientViewModel {
    value: string;
    isDirty: boolean;
    moreData: IClientViewModelInner;
}
export interface IClientViewModelInner {
    value: string;
}
