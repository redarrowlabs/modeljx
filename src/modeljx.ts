import * as Immutable from 'immutable';

export interface IProjectionStage<TFromType, TResultType> {
    override(props: {
        fromProperty: (from: TFromType) => any,
        toProperty: (to: TResultType) => any,
        use: (from: any) =>  any
    } | {
        forProperty: (from: TFromType) => any,
        use: (from: any) =>  any
    }

    ): IProjectionStage<TFromType, TResultType>,

    build(): (from: TFromType | TFromType[] | Immutable.List<TFromType>) => TResultType | Immutable.List<TResultType>
}

class ProjectionStage<TFromType, TResultType> implements IProjectionStage<TFromType, TResultType> {
    private from: (o: any) => TFromType;
    private to: (o: any) => TResultType;

    constructor(
        from: (o: any) => TFromType,
        to: (o: any) => TResultType
    ) {
        this.from = from;
        this.to = to;
    }

    override(props: {
            fromProperty: (from: TFromType) => any,
            toProperty: (to: TResultType) => any,
            use: (from: any) =>  any,
           [index : string] : any;
        } | {
            forProperty: (from: TFromType) => any,
            use: (from: any) =>  any,
           [index : string] : any;
        }): IProjectionStage<TFromType, TResultType> {
            props;
            return this;
    }

    build(): (from: TFromType) => TResultType {
        return (from: TFromType) => {
            if (from) {

            }
            return this.to({});
        };
    }
}

export default class ProjectionBuilder {
    static defineProjection<TFromType, TResultType>(
        from: (o: any) => TFromType,
        to: (o: any) => TResultType
    ): IProjectionStage<TFromType, TResultType> {
        return new ProjectionStage<TFromType, TResultType>(from, to);
    }
}