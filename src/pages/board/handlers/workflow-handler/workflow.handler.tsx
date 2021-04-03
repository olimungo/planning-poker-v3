import { useContext, useEffect } from "react";
import { EWorkflowState, getWorkflowStateFromString } from "../../../../components";
import { AppContext } from "../../../common";
import { transitionTo } from "../../../services";

type Props = { onAllPigsHaveVoted: Function };

export function WorkflowHandler(props: Props) {
    const { onAllPigsHaveVoted } = props;
    const appContext = useContext(AppContext);

    // Watch pigs for their votes
    useEffect(() => {
        if (appContext.pigs) {
            let allVoted = true;
            let keyCount = 0;

            for (let key in appContext.pigs) {
                keyCount++;
                allVoted = allVoted && Boolean(appContext.pigs[key].vote);
            }

            allVoted = keyCount > 0 && allVoted;

            if (allVoted && appContext.boardKey) {
                transitionTo(appContext.boardKey, EWorkflowState.FINAL_ESTIMATE);
            }
        }
    }, [appContext.boardKey, appContext.pigs]);

    // Watch for transitioning to next state
    useEffect(() => {
        if (appContext.workflow?.nextState && appContext.boardKey) {
            transitionTo(appContext.boardKey, getWorkflowStateFromString(appContext.workflow.nextState));
        }
    }, [appContext.boardKey, appContext.workflow?.nextState]);

    // Watch for the final estimate state so to notify to show the votes
    useEffect(() => {
        const state = getWorkflowStateFromString(appContext.workflow?.state || EWorkflowState.UNKNOWN);

        if (state === EWorkflowState.FINAL_ESTIMATE) {
            onAllPigsHaveVoted(true);
        }
    }, [appContext.workflow?.state, onAllPigsHaveVoted]);

    return (
        <div></div>
    );
}