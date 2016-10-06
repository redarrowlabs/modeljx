import * as Immutable from 'immutable';
class ProjectionStage {
    constructor(from, to) {
        this._projections = Immutable.Map();
        this.from = from;
        this.to = to;
    }
    overrideProperty(fromProperty, toProperty, use) {
        let toMap = this._projections.get(fromProperty);
        if (!toMap) {
            toMap = Immutable.Map();
        }
        toMap = toMap.set(toProperty, use);
        this._projections = this._projections.set(fromProperty, toMap);
    }
    override(props) {
        props;
        let { fromProperty, toProperty, forProperty, use } = props;
        let from = '';
        let to = '';
        if (fromProperty) {
            from = ProjectionStage.extractPropertyName(fromProperty);
            to = ProjectionStage.extractPropertyName(toProperty);
            this.overrideProperty(from, to, use);
        }
        else if (forProperty) {
            from = to = ProjectionStage.extractPropertyName(forProperty);
        }
        else {
            throw "unsupported projection type";
        }
        this.overrideProperty(from, to, use);
        return this;
    }
    // ~todo~ Add error checking and make this more safe.
    static extractPropertyName(fromProperty) {
        let serialized = fromProperty.toString();
        let isLambda = serialized.indexOf('=>') > -1;
        return isLambda
            ? serialized.split('=>')[1].trim().split('.').splice(-1, 1)[0]
            : serialized.split('return')[1].split(';')[0].split('.')[1].trim();
    }
    // ~todo~ This needs to handle collections.
    build() {
        return (from) => {
            let result = this.to({}).toJS();
            let source = this.from(from).toJS();
            for (const fromProperty in source) {
                //noinspection JSUnfilteredForInLoop
                const registeredProjections = this._projections.get(fromProperty);
                let projectionFound = false;
                // ### Attempt to find a specific projection definition:
                if (registeredProjections) {
                    registeredProjections.forEach((projection, toProperty) => {
                        if (result.hasOwnProperty(toProperty)) {
                            //noinspection JSUnfilteredForInLoop
                            result[toProperty] = projection(source[fromProperty]);
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
            return this.to(result);
        };
    }
}
export default class ProjectionBuilder {
    static defineProjection(from, to) {
        return new ProjectionStage(from, to);
    }
}
