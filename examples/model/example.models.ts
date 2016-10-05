export interface IServerResponse {
    value: string,
    inner: IServerResponseInner,
    anotherInner: IServerResponseInner
}

export interface IServerResponseInner {
    value: string,
}

export interface IClientViewModel {
    value: string,
    isDirty: boolean,
    moreData: IClientViewModelInner,
    anotherInner: IClientViewModelInner
}

export interface IClientViewModelInner {
    value: string
}