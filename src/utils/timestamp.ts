


export class Timestamp {
    static now() {
        return new Timestamp(); 
    }
    
    private _ms: number;

    constructor(time?: number | Date) {
        if (!time) {
            this._ms = Date.now();
        } else if (time instanceof Date) {
            this._ms = time.getTime();
        } else {
            this._ms = time;
        }
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

    private timeOfUnit(unit: Timestamp.UnitTypes): number {
        return this.ms % Timestamp.UNIT_TYPE_TO_UNIT[unit];
    }

    timeOfDay(): number {
        return this.timeOfUnit(Timestamp.UnitTypes.DAY);
    }

    get isToday(): boolean {
        return new Date(this._ms).getUTCDay() === new Date().getUTCDay();
    }

    get isNotToday(): boolean {
        return !this.isToday;
    }
    
    dayOfWeek(): number;
    dayOfWeek(humanized: boolean): string;
    dayOfWeek(humanized?: boolean): number|string {
        const dayOfWeek = new Date(this._ms).getUTCDay();

        if (!humanized) {
            return dayOfWeek;
        }

        switch (dayOfWeek) {
            case 0: return 'sunday';
            case 1: return 'monday';
            case 2: return 'tuesday';
            case 3: return 'wednesday';
            case 4: return 'thursday';
            case 5: return 'friday';
            default: return 'saturday';
        }
    }
}

export namespace Timestamp {
    export enum RepeatUnits {
        DAY,
        WEEK,
        MONTH,
    }

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