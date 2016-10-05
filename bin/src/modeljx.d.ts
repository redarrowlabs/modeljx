import * as Immutable from 'immutable';
export interface IProjectionStage<TFromType, TResultType> {
    override(props: {
        fromProperty: (from: TFromType) => any;
        toProperty: (to: TResultType) => any;
        use: (from: any) => any;
    } | {
        forProperty: (from: TFromType) => any;
        use: (from: any) => any;
    }): IProjectionStage<TFromType, TResultType>;
    build(): (from: TFromType | TFromType[] | Immutable.List<TFromType>) => TResultType | Immutable.List<TResultType>;
}
export default class ProjectionBuilder {
    static defineProjection<TFromType, TResultType>(from: (o: any) => TFromType, to: (o: any) => TResultType): IProjectionStage<TFromType, TResultType>;
}
