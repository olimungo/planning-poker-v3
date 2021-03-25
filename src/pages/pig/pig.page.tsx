import './pig.page.css';
import { useParams, useHistory } from 'react-router-dom';
import { WorkflowState, EWorkflowState, getWorkflowStateFromString } from '../../components';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { createPig, checkPigExists } from './pig.service';
import { checkBoardExists } from '../common.services';
import { AppHeaderManager } from './managers/app-header-manager';
import { OverviewHandler } from '../common';
import { getWorkflowStateRef } from '../services';
import { AppFooterHandler } from '../board';

export function PigPage() {
    const { boardKey, key } = useParams<{ boardKey: string, key: string }>();
    const history = useHistory();
    const [currentState, setCurrentState] = useState(EWorkflowState.UNKNOWN);
    const [workflowStateRef, setWorkflowStateRef] = useState<firebase.database.Reference | null>(null);
    // const [nextState, setNextState] = useState(EWorkflowState.UNKNOWN);
    const [errorMessage, setErrorMessage] = useState('');
    // const [vote, setVote] = useState('');
    // const [isScrumMaster, setIsScrumMaster] = useState(false);
    // const [hideToggle, setHideToggle] = useState(true);

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

    // // Watch the database for a scrum master to be assigned or unassigned
    // useEffect(() => {
    //     getScrumMasterRef(boardKey).on('value', (value) => {
    //         const scrumMaster = value.val();

    //         if (!scrumMaster || scrumMaster === key) {
    //             setHideToggle(false);

    //             if (scrumMaster === key && isScrumMaster === false) {
    //                 setIsScrumMaster(true);
    //             }
    //         } else {
    //             setHideToggle(true);
    //         }
    //     });
    // }, [boardKey, key, isScrumMaster]);

    // // Assign or unassign current pig as scrum master in the database
    // useEffect(() => {
    //     isScrumMaster ? assignScrumMaster(boardKey, key) : !hideToggle && unassignScrumMaster(boardKey);
    // }, [boardKey, key, isScrumMaster, hideToggle]);

    // // Transition to next state in the database
    // useEffect(() => {
    //     switch (nextState) {
    //         case EWorkflowState.DISCUSSION:
    //             transitionToDiscussion(boardKey);
    //             break;
    //         case EWorkflowState.VOTE:
    //             transitionTo(boardKey, EWorkflowState.VOTE);
    //             break;
    //     }
    // }, [boardKey, nextState])


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
    // const handleAction = (state: EWorkflowState) => setNextState(state);
    // // Set vote for the current pig (or scrum master)
    // const handleVote = (value: string) => setVote(value);

    return (
        <div className="pig">
            <AppHeaderManager boardKey={boardKey} pigKey={key} />
            <OverviewHandler boardKey={boardKey} />
            <WorkflowState value={currentState} />

            <AppFooterHandler boardKey={boardKey} pigKey={key} />
            {/* <AppFooterHa hideToggle={hideToggle} toggleChecked={isScrumMaster} onToggleScrumMaster={handleToggleScrumMaster} /> */}

            {/*

            {
                isScrumMaster
                    ? <WorkflowActions currentState={currentState} onAction={handleAction}></WorkflowActions>
                    : ''
            }

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