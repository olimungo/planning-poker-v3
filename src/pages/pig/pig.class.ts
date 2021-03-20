import { IPig } from './pig.interface';

export class Pig implements IPig {
    key: string = '';
    name: string = '';
    badge: string = '';
    email: string = '';
    hasVoted: boolean = false;
    isActive: boolean = false;
    dateCreated: number = NaN;

    constructor(source?: any) {
        this.setProps(source);
    }

    setProps(source?: any) {
        for (const prop of Object.keys(source)) {
            if (Object.getOwnPropertyDescriptor(this, prop)?.value !== undefined) {
                Object.defineProperty(this, prop, { value: source[prop] });
            }
        }

        if (source.$key) {
            this.key = source.$key;
        }
    }
}