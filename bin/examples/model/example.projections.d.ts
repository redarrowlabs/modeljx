import { IClientViewModel, IServerResponse } from "./example.models";
import * as Immutable from 'immutable';
export declare const Response_to_ViewModel: (from: IServerResponse | Immutable.List<IServerResponse> | IServerResponse[]) => IClientViewModel | Immutable.List<IClientViewModel>;
