import { useEffect, useState } from "react";
import { EWorkflowState, getWorkflowStateFromString } from "../../../../components";
import { getNextStateRef, getPigsRef, transitionTo } from "../../../services";

type Props = { boardKey: string, currentState: EWorkflowState, onAllPigsHaveVoted: Function };

export function WorkflowHandler(props: Props) {
    const { boardKey, currentState, onAllPigsHaveVoted } = props;
    const [allPigsHaveVoted, setAllPigsHaveVoted] = useState(false)

    // Watch pigs for their votes
    useEffect(() => {
        const pigsRef = getPigsRef(boardKey);
        const nextStateRef = getNextStateRef(boardKey);

        pigsRef.on('value', (pigs) => {
            let allVoted = true;

            pigs.forEach(pig => {
                allVoted = allVoted && Boolean(pig.child('vote').val())
            });

            if (allVoted) {
                setAllPigsHaveVoted(true);
            }
        });

        nextStateRef.on('value', (value) => {
            if (value.val()) {
                const nextState = getWorkflowStateFromString(value.val());

                transitionTo(boardKey, nextState);
                setAllPigsHaveVoted(false);
                onAllPigsHaveVoted(false)
            }
        });

        return () => {
            pigsRef.off()
            nextStateRef.off()
        };
    }, [boardKey, onAllPigsHaveVoted]);

    useEffect(() => {
        if (currentState === EWorkflowState.VOTE && allPigsHaveVoted) {
            onAllPigsHaveVoted(allPigsHaveVoted);
            setAllPigsHaveVoted(false);
            transitionTo(boardKey, EWorkflowState.FINAL_ESTIMATE);
        }

        // If not all the pigs have voted but the scrum master stopped the votes
        if (currentState === EWorkflowState.FINAL_ESTIMATE && !allPigsHaveVoted) {
            onAllPigsHaveVoted(true);
            setAllPigsHaveVoted(false);
        }
    }, [boardKey, currentState, allPigsHaveVoted, onAllPigsHaveVoted]);

    return (
        <div></div>
    );
}