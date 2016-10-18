export interface IServerResponse {
    value: string,
    inner: IServerResponseInner,
    anotherInner: IServerResponseInner,
    DifferentCase: string
}

export interface IServerResponseInner {
    value: string,
}

export interface IClientViewModel {
    value: string,
    isDirty: boolean,
    moreData: IClientViewModelInner,
    anotherInner: IClientViewModelInner,
    differentcase: string
}

export interface IClientViewModelInner {
    value: string
}