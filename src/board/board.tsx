import './board.css';
import { OverviewStory, OverviewTime, State, EState } from './workflow';

export function Board() {
    return (
        <div className="board">
            <OverviewStory story={1} round={1} />
            <OverviewTime start="11:13" end="14:26" duration="1:34" story="3" pause="0:36" />
            <State value={EState.PRE_FINAL_RESULTS} />
        </div>
    );
}