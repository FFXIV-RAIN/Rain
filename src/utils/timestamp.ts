


export class Timestamp {
    static now() {
        return new Timestamp(); 
    }
    
    private _ms: number;

    constructor(ms?: number) {
        this._ms = ms ?? Date.now();
    }

    add(type: Timestamp.UnitTypes, value: number) {
        const unit = Timestamp.UNIT_TYPE_TO_UNIT[type];

        this._ms = this.ms + unit * value;

        return this;
    }

    remove(type: Timestamp.UnitTypes, value: number) {
        const unit = Timestamp.UNIT_TYPE_TO_UNIT[type];

        this._ms = this.ms - unit * value;

        return this;
    }

    round(type: Timestamp.UnitTypes) {
        const unit = Timestamp.UNIT_TYPE_TO_UNIT[type];

        this._ms = Math.round(this._ms / unit) * unit;

        return this;
    }

    floor(type: Timestamp.UnitTypes) {
        const unit = Timestamp.UNIT_TYPE_TO_UNIT[type];

        this._ms = Math.floor(this._ms / unit) * unit;

        return this;
    }

    ceil(type: Timestamp.UnitTypes) {
        const unit = Timestamp.UNIT_TYPE_TO_UNIT[type];

        this._ms = Math.ceil(this._ms / unit) * unit;

        return this;
    }
    
    get ms() {
        return this._ms;
    }
}

export namespace Timestamp {
    export enum UnitTypes {
        YEAR,
        WEEK,
        DAY,
        HOUR,
        MINUTE,
        SECOND,
        MILLISECOND
    }

    export const UNIT_TYPE_TO_UNIT: {
        [key in UnitTypes]: number;
    } = {
        [UnitTypes.YEAR]: 31536000000,
        [UnitTypes.WEEK]: 604800000,
        [UnitTypes.DAY]: 86400000,
        [UnitTypes.HOUR]: 3600000,
        [UnitTypes.MINUTE]: 60000,
        [UnitTypes.SECOND]: 1000,
        [UnitTypes.MILLISECOND]: 1
    };
}