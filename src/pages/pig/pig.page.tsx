import './pig.page.css';
import { useParams, useHistory } from 'react-router-dom';
import { WorkflowState, EWorkflowState, getWorkflowStateFromString } from '../../components';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { AppHeaderManager } from './managers/app-header-manager';
import { OverviewHandler } from '../common';
import { getWorkflowStateRef, transitionTo, transitionToDiscussion, createPig, checkPigExists, checkBoardExists } from '../services';
import { AppFooterHandler, WorkflowActionsHandler } from '../board';

export function PigPage() {
    const { boardKey, key } = useParams<{ boardKey: string, key: string }>();
    const history = useHistory();
    const [currentState, setCurrentState] = useState(EWorkflowState.UNKNOWN);
    const [workflowStateRef, setWorkflowStateRef] = useState<firebase.database.Reference | null>(null);
    const [nextState, setNextState] = useState(EWorkflowState.UNKNOWN);
    const [errorMessage, setErrorMessage] = useState('');
    // const [vote, setVote] = useState('');

    useEffect(() => {
        // Check if the params in the URL for the board key and the pig key exist in the database
        checkBoardExists(boardKey).then(boardExists => {
            if (boardExists) {
                if (!key) {
                    const pigKey = createPig(boardKey);

                    if (pigKey) {
                        history.push(`/pig/${boardKey}/${pigKey}`);
                    }
                } else {
                    checkPigExists(boardKey, key).then(result => {
                        if (!result.name) {
                            setErrorMessage('The pig specified in the URL doesn\'t exist');
                        } else {
                            setWorkflowStateRef(getWorkflowStateRef(boardKey));
                        }
                    });
                }
            } else {
                setErrorMessage('The board specified in the URL doesn\'t exist');
            }
        });

        // // Check if the pig is voting
        // getVote(boardKey, key).then((value) => {
        //     if (value) {
        //         setVote(value);
        //     }
        // })
    }, [key, boardKey, history]);

    // Watch the database for the current state
    useEffect(() => {
        if (workflowStateRef) {
            workflowStateRef.on('value', (value) => {
                setCurrentState(getWorkflowStateFromString(value.val()));
            });
        }

        // The return statement is executed on ComponentWillUnmount React event
        return () => {
            // Stop watching the workflow state when component is discarded
            if (workflowStateRef) {
                workflowStateRef.off();
            }
        };
    }, [workflowStateRef]);

    // // Transition to next state in the database
    useEffect(() => {
        switch (nextState) {
            case EWorkflowState.DISCUSSION:
                transitionToDiscussion(boardKey);
                break;
            case EWorkflowState.VOTE:
                transitionTo(boardKey, EWorkflowState.VOTE);
                break;
        }
    }, [boardKey, nextState])


    // // Save vote to the database
    // useEffect(() => {
    //     if (vote) {
    //         saveVote(boardKey, key, vote);
    //     }
    // }, [boardKey, key, vote])

    // // Assign or unassign current pig as scrum master locally
    // const handleToggleScrumMaster = (value: boolean) => setIsScrumMaster(value);
    // // When the pig change his/her name or email address in the badge 
    // // Transition workflow on actions from the scrum master
    // // Set vote for the current pig (or scrum master)
    // const handleVote = (value: string) => setVote(value);

    const handleAction = (state: EWorkflowState) => setNextState(state);

    return (
        <div className="pig">
            <AppHeaderManager boardKey={boardKey} pigKey={key} />
            <OverviewHandler boardKey={boardKey} />
            <WorkflowState value={currentState} />

            <WorkflowActionsHandler boardKey={boardKey} pigKey={key} currentState={currentState} onAction={handleAction} />

            <AppFooterHandler boardKey={boardKey} pigKey={key} />

            {/*

            {
                !vote
                    ? <WorkflowBlock currentState={currentState} displayState={EWorkflowState.VOTE}>
                        <div className="pig--cards-deck">
                            <CardsDeck onClick={handleVote} />
                        </div>
                    </WorkflowBlock>
                    : <div className="pig--vote-container"><div className="pig--vote">{vote}</div></div>
            }


            {
                errorMessage
                    ? <ErrorMessage message={errorMessage} />
                    : ''
            } */}
        </div>
    );
}