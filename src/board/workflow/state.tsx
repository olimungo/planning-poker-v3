import './state.css';
import { EState } from './state-enum'

type Props = { value: EState };

export function State(props: Props) {
    const { value } = props;

    return (
        <div className="state">
            {value.toString()}
        </div>
    );
}