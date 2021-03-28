import './pig.page.css';
import { useParams, useHistory } from 'react-router-dom';
import { WorkflowState, WorkflowBlock, EWorkflowState, getWorkflowStateFromString, ErrorMessage } from '../../components';
import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { AppHeaderHandler, CardsDeckHandler } from './handlers';
import { EResultTheme, OverviewHandler, ResultsHandler } from '../common';
import { getWorkflowStateRef, createPig, checkPigExists, checkBoardExists } from '../services';
import { AppFooterHandler, WorkflowActionsHandler } from '../board';

export function PigPage() {
    const { boardKey, key } = useParams<{ boardKey: string, key: string }>();
    const history = useHistory();
    const [currentState, setCurrentState] = useState(EWorkflowState.UNKNOWN);
    const [workflowStateRef, setWorkflowStateRef] = useState<firebase.database.Reference | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

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
    }, [boardKey, key, history]);

    // Watch the database for the current state
    useEffect(() => {
        if (workflowStateRef) {
            workflowStateRef.on('value', (value) => {
                setCurrentState(getWorkflowStateFromString(value.val()));
            });

            return () => {
                workflowStateRef.off();
            };
        }
    }, [workflowStateRef]);

    return (
        <div className="pig">
            <AppHeaderHandler boardKey={boardKey} pigKey={key} />
            <OverviewHandler boardKey={boardKey} />
            <WorkflowState state={currentState} />
            <WorkflowActionsHandler boardKey={boardKey} pigKey={key} currentState={currentState} />
            <CardsDeckHandler boardKey={boardKey} pigKey={key} currentState={currentState} />

            <WorkflowBlock currentState={currentState} displayState={EWorkflowState.FINAL_RESULTS}>
                <ResultsHandler boardKey={boardKey} theme={EResultTheme.SECONDARY} />
            </WorkflowBlock>

            <AppFooterHandler boardKey={boardKey} pigKey={key} />

            <ErrorMessage message={errorMessage} />

            <div className="pig--spacer"></div>
        </div>
    );
}