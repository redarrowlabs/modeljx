import * as Immutable from 'immutable';

export interface IProjectionStage<TFromType, TResultType> {
    override(props: {
        fromProperty: (from: TFromType) => any,
        toProperty: (to: TResultType) => any,
        use: (from: any) =>  any
    } | {
        forProperty: (from: TFromType) => any,
        use: (from: any) =>  any
    }): IProjectionStage<TFromType, TResultType>,

    build(): (from: TFromType | TFromType[] | Immutable.List<TFromType>) => TResultType | Immutable.List<TResultType>
}

class ProjectionStage<TFromType, TResultType> implements IProjectionStage<TFromType, TResultType> {
    private from: (o: any) => TFromType;
    private to: (o: any) => TResultType;

    private _projections: Immutable.Map<string, Immutable.Map<string, Function>> =
        Immutable.Map<string, Immutable.Map<string, Function>>();

    constructor(
        from: (o: any) => TFromType,
        to: (o: any) => TResultType) {
        this.from = from;
        this.to = to;
    }

    private overrideProperty(
        fromProperty: string,
        toProperty: string,
        use: (from: any) => any) {
        let toMap = this._projections.get(fromProperty);
        if (!toMap) {
            toMap = Immutable.Map<string, Function>();
        }
        toMap = toMap.set(toProperty, use);
        this._projections = this._projections.set(fromProperty, toMap);
    }

    override(props: {
        fromProperty: (from: TFromType) => any,
        toProperty: (to: TResultType) => any,
        use: (from: any) =>  any,
        [index: string]: any;
    } | {
        forProperty: (from: TFromType) => any,
        use: (from: any) =>  any,
        [index: string]: any;
    }): IProjectionStage<TFromType, TResultType> {
        props;
        let {fromProperty, toProperty, forProperty, use} = props;
        let from = '';
        let to = '';
        if (fromProperty) {
            from = ProjectionStage.extractPropertyName(fromProperty);
            to = ProjectionStage.extractPropertyName(toProperty);
            this.overrideProperty(from, to, use);
        } else if (forProperty) {
            from = to = ProjectionStage.extractPropertyName(forProperty);
        } else {
            throw "unsupported projection type";
        }
        this.overrideProperty(from, to, use);
        return this;
    }

    // ~todo~ Add error checking and make this more safe.
    private static extractPropertyName(fromProperty: Function): string {
        let serialized: string = fromProperty.toString();
        let isLambda = serialized.indexOf('=>') > -1;
        return isLambda
            ? serialized.split('=>')[1].trim().split('.').splice(-1, 1)[0]
            : serialized.split('return')[1].split(';')[0].split('.')[1].trim();
    }

    // ~todo~ This needs to handle collections.
    build(): (from: TFromType) => TResultType {
        return (from: TFromType) => {
            let result: { [key: string]: any } = this.to({});
            let source: { [key: string]: any } = this.from(from);
            for (const fromProperty in source) {

                //noinspection JSUnfilteredForInLoop
                const registeredProjections = this._projections.get(fromProperty);
                let projectionFound: boolean = false;

                // ### Attempt to find a specific projection definition:
                if (registeredProjections) {
                    registeredProjections.forEach((projection: Function, toProperty: string) => {
                        if (result.hasOwnProperty(toProperty)) {
                            //noinspection JSUnfilteredForInLoop
                            result[toProperty] = projection(fromProperty);
                            projectionFound = true;
                        }
                    });
                }

                // ### Attempt to do a direct mapping:
                if (!projectionFound) {
                    //noinspection JSUnfilteredForInLoop
                    if (result.hasOwnProperty(fromProperty)) {
                        //noinspection JSUnfilteredForInLoop
                        result[fromProperty] = source[fromProperty];
                    }
                }
            }
            return result as TResultType;
        };
    }
}

export default class ProjectionBuilder {
    static defineProjection<TFromType, TResultType>(
        from: (o: any) => TFromType,
        to: (o: any) => TResultType): IProjectionStage<TFromType, TResultType> {
        return new ProjectionStage<TFromType, TResultType>(from, to);
    }
}