import * as Immutable from 'immutable';

export interface IProjectionStage<TFromType, TResultType> {
    override(props: {
        fromProperty: (from: TFromType) => any,
        toProperty: (to: TResultType) => any,
        use: (from: any) => any,
        when?: (from: any) => boolean
    } | {
        forProperty: (from: TFromType) => any,
        use: (from: any) =>  any,
        when?: (from: any) => boolean
    }): IProjectionStage<TFromType, TResultType>,

    withMapping(mapping: (sourcePropertyName: string) => string): IProjectionStage<TFromType, TResultType>,

    build(): (from: TFromType | TFromType[] | Immutable.List<TFromType>) => TResultType | Immutable.List<TResultType>
}

interface IConditionalFunction {
    when?: (x: any) => boolean,
    use: (from: any) =>  any
}

class ProjectionStage<TFromType, TResultType> implements IProjectionStage<TFromType, TResultType> {
    private from: (o: any) => TFromType;
    private to: (o: any) => TResultType;

    private _projections: Immutable.Map<string, Immutable.Map<string, Immutable.List<IConditionalFunction>>> =
        Immutable.Map<string, Immutable.Map<string, Immutable.List<IConditionalFunction>>>();

    private _mappings: Immutable.List<((x: string) => string)> =
        Immutable.List<((x: string) => string)>();

    constructor(
        from: (o: any) => TFromType,
        to: (o: any) => TResultType) {
        this.from = from;
        this.to = to;
    }

    withMapping(mapping: (sourcePropertyName: string) => string): IProjectionStage<TFromType, TResultType> {
        this._mappings = this._mappings.push(mapping);
        return this;
    }

    override(props: {
        fromProperty: (from: TFromType) => any,
        toProperty: (to: TResultType) => any,
        use: (from: any) =>  any,
        when?: (from: any) => boolean
        [index: string]: any;
    } | {
        forProperty: (from: TFromType) => any,
        use: (from: any) =>  any,
        when?: (from: any) => boolean,
        [index: string]: any;
    }): IProjectionStage<TFromType, TResultType> {
        props;
        let {fromProperty, toProperty, forProperty, use, when} = props;
        let from = '';
        let to = '';
        if (fromProperty) {
            from = ProjectionStage.extractPropertyName(fromProperty);
            to = ProjectionStage.extractPropertyName(toProperty);
        } else if (forProperty) {
            from = to = ProjectionStage.extractPropertyName(forProperty);
        } else {
            throw "unsupported projection type";
        }
        this.overrideProperty(from, to, use, when);
        return this;
    }

    private overrideProperty(
        fromProperty: string,
        toProperty: string,
        use: (from: any) => any,
        when?: (from: any) => boolean) {
        let toMap = this._projections.get(fromProperty);
        if (!toMap) {
            toMap = Immutable.Map<string, Immutable.List<IConditionalFunction>>();
        }
        let projections = toMap.get(toProperty);
        if (!projections) {
            projections = Immutable.List<IConditionalFunction>();
        }
        projections = projections.push({when, use});
        toMap = toMap.set(toProperty, projections);
        this._projections = this._projections.set(fromProperty, toMap);
    }

    private static extractPropertyName(fromProperty: Function | string): string {
        if (!fromProperty) {
            return '';
        }
        if (typeof(fromProperty) === 'string') {
            const parts = fromProperty.split('.');
            return parts[parts.length - 1];
        }
        let serialized: string = fromProperty.toString();
        let isLambda = serialized.indexOf('=>') > -1;

        const rValue = isLambda
            ? serialized.split('=>')[1].trim()
            : serialized.split('return')[1].split(';')[0];
        return ProjectionStage.extractPropertyName(rValue);
    }

    build(): (from: TFromType | TFromType[] | Immutable.List<TFromType>) => TResultType | Immutable.List<TResultType> {
        var isMappable = function (toCheck: any) {
            return toCheck.constructor === Array || Immutable.Iterable.isIterable(toCheck);
        };

        var projectSingle = function (from: TFromType) {
            let result: { [key: string]: any } = (this.to({}) as any).toJS();
            let source: { [key: string]: any } = (this.from(from) as any).toJS();
            for (const fromProperty in source) {
                const registeredProjections = this._projections.get(fromProperty);
                let hasBeenProjected: boolean = false;

                var sourceProperty = source[fromProperty];

                // ### Attempt to find a specific projection definition:
                if (registeredProjections) {
                    registeredProjections.forEach((projections: Immutable.List<IConditionalFunction>, toProperty: string) => {
                        projections.forEach((projection: IConditionalFunction) => {
                            if (!hasBeenProjected && result.hasOwnProperty(toProperty)) {
                                if (!projection.when || (projection.when && projection.when(source))) {
                                    result[toProperty] = projection.use(sourceProperty);
                                    hasBeenProjected = true;
                                }
                            }
                        });
                    });
                }

                // ### Attempt pattern-based automapping:
                this._mappings.forEach((mapping: (x: string) => string) => {
                    const mappedProperty = mapping(fromProperty);
                    debugger;
                    if (!hasBeenProjected && result.hasOwnProperty(mappedProperty)) {
                        result[mappedProperty] = sourceProperty;
                    }
                });

                // ### Attempt direct mapping:
                if (!hasBeenProjected && result.hasOwnProperty(fromProperty)) {
                    result[fromProperty] = sourceProperty;
                }
            }
            return this.to(result);
        };
        return (from: TFromType | TFromType[] | Immutable.List<TFromType>): TResultType | Immutable.List<TResultType> => {
            return isMappable(from)
                ? Immutable.List<TResultType>((from as any).map((x: any) => projectSingle.call(this, x)))
                : projectSingle.call(this, from);
        };
    }
}

export class ProjectionBuilder {
    static defineProjection<TFromType, TResultType>(
        from: (o: any) => TFromType,
        to: (o: any) => TResultType): IProjectionStage<TFromType, TResultType> {
        return new ProjectionStage<TFromType, TResultType>(from, to);
    }
}