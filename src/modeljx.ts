import * as Immutable from 'immutable';

import * as _ from 'lodash';

export interface ProjectionStage<TFromType, TResultType> {
    override(props: {
        fromProperty: (from: TFromType) => any,
        toProperty: (to: TResultType) => any,
        use: (from: any) => any,
        when?: (from: any) => boolean
    } | {
        forProperty: (from: TFromType) => any,
        use: (from: any) =>  any,
        when?: (from: any) => boolean
    }): ProjectionStage<TFromType, TResultType>,

    withMapping(mapping: (sourcePropertyName: string) => string): ProjectionStage<TFromType, TResultType>,

    build(): (from: TFromType | TFromType[] | Immutable.List<TFromType>) => TResultType | Immutable.List<TResultType>
}

interface ConditionalFunction {
    when?: (x: any) => boolean,
    use: (from: any) =>  any
}

class ProjectionStageImpl<TFromType, TResultType> implements ProjectionStage<TFromType, TResultType> {
    private from: (o: any) => TFromType;
    private to: (o: any) => TResultType;

    private _projections: Immutable.Map<string, Immutable.Map<string, Immutable.List<ConditionalFunction>>> =
        Immutable.Map<string, Immutable.Map<string, Immutable.List<ConditionalFunction>>>();

    private _mappings: Immutable.List<((x: string) => string)> =
        Immutable.List<((x: string) => string)>();

    constructor(
        from: (o: any) => TFromType,
        to: (o: any) => TResultType) {
        this.from = from;
        this.to = to;
    }

    withMapping(mapping: (sourcePropertyName: string) => string): ProjectionStage<TFromType, TResultType> {
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
    }): ProjectionStage<TFromType, TResultType> {
        props;
        let {fromProperty, toProperty, forProperty, use, when} = props;
        let from = '';
        let to = '';
        if (fromProperty) {
            from = ProjectionStageImpl.extractPropertyName(fromProperty);
            to = ProjectionStageImpl.extractPropertyName(toProperty);
        } else if (forProperty) {
            from = to = ProjectionStageImpl.extractPropertyName(forProperty);
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
            toMap = Immutable.Map<string, Immutable.List<ConditionalFunction>>();
        }
        let projections = toMap.get(toProperty);
        if (!projections) {
            projections = Immutable.List<ConditionalFunction>();
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
        return ProjectionStageImpl.extractPropertyName(rValue);
    }

    build(): (from: TFromType | TFromType[] | Immutable.List<TFromType>) => TResultType | Immutable.List<TResultType> {
        const HasBeenProjected = Symbol('short circuit Immutable forEach loops');

        var isMappable = function (toCheck: any) {
            return toCheck && (toCheck.constructor === Array || toCheck.toJS && toCheck.toJS().constructor === Array);
        };

        var projectSingle = function (from: TFromType) {
            let result: { [key: string]: any } = (this.to({}) as any).toJS();
            let source: { [key: string]: any } = _.clone((this.from(from) as any).toJS());
            for (const fromProperty in source) {
                const registeredProjections = this._projections.get(fromProperty);

                var sourceProperty = source[fromProperty];

                // ### Attempt to find a specific projection definition:
                try {
                    if (registeredProjections) {
                        registeredProjections.forEach((projections: Immutable.List<ConditionalFunction>, toProperty: string) => {
                            projections.forEach((projection: ConditionalFunction) => {
                                if (result.hasOwnProperty(toProperty)) {
                                    if (!projection.when || (projection.when && projection.when(source))) {
                                        result[toProperty] = sourceProperty == null? null: _.clone(projection.use(sourceProperty));
                                        throw HasBeenProjected;
                                    }
                                }
                            });
                        });
                    }

                    // ### Attempt pattern-based automapping:
                    this._mappings.forEach((mapping: (x: string) => string) => {
                        const mappedProperty = mapping(fromProperty);
                        if (result.hasOwnProperty(mappedProperty)) {
                            result[mappedProperty] = sourceProperty;
                            throw HasBeenProjected;
                        }
                    });

                    // ### Attempt direct mapping:
                    if (result.hasOwnProperty(fromProperty)) {
                        result[fromProperty] = sourceProperty;
                    }
                } catch (e) {
                    if (e !== HasBeenProjected) {
                        throw e;
                    }
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
        to: (o: any) => TResultType): ProjectionStage<TFromType, TResultType> {
        return new ProjectionStageImpl<TFromType, TResultType>(from, to);
    }
}