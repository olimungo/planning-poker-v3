import './pig.page.css';
import { useParams, useHistory } from 'react-router-dom';
import { WorkflowState, WorkflowBlock, EWorkflowState, getWorkflowStateFromString, ErrorMessage, Quote, AppTheme } from '../../components';
import { useCallback, useEffect, useState } from 'react';
import { AppHeaderHandler, CardsDeckHandler } from './handlers';
import { AppContext, PigType, OverviewHandler, ResultsHandler, workflowTypeInit, WorkflowType } from '../common';
import { createPig, checkPigExists, checkBoardExists, getPigRef, getWorkflowRef } from '../services';
import { AppFooterHandler, WorkflowActionsHandler } from '../board';

export function PigPage() {
    const { boardKey, key } = useParams<{ boardKey: string, key: string }>();
    const history = useHistory();
    const [state, setState] = useState(EWorkflowState.UNKNOWN);
    const [errorMessage, setErrorMessage] = useState('');
    const [pigs, setPigs] = useState<PigType>({});
    const [workflow, setWorkflow] = useState<WorkflowType>(workflowTypeInit);

    const initApp = useCallback(() => {
        if (!key) {
            const pigKey = createPig(boardKey);

            if (pigKey) {
                history.push(`/pig/${boardKey}/${pigKey}`);
            }
        } else {
            checkPigExists(boardKey, key).then(result => {
                if (!result) {
                    setErrorMessage('The pig specified in the URL doesn\'t exist');
                } else {
                    // Watch the database for the workflow
                    getWorkflowRef(boardKey).on('value', (value) => {
                        setState(getWorkflowStateFromString(value.child('state').val()));
                        setWorkflow(value.val());
                    });

                    // Watch the database for the current pig
                    getPigRef(boardKey, key).on('value', (value) => {
                        if (value.val()) {
                            setPigs((prev) => ({ ...prev, [key]: value.val() }));
                        } else {
                            setErrorMessage('You\'ve been removed from the session');
                        }
                    });
                }
            });
        }
    }, [boardKey, key, history]);

    useEffect(() => {
        // Check if the params in the URL for the board key and the pig key exist in the database
        checkBoardExists(boardKey).then(boardExists => {
            if (boardExists) {
                initApp();
            } else {
                setErrorMessage('The board specified in the URL doesn\'t exist');
            }
        });
    }, [boardKey, key, history, initApp]);

    return (
        <div className="pig">
            <AppContext.Provider value={{ pigs, workflow, boardKey, pigKey: key, theme: AppTheme.SECONDARY }}>
                <AppHeaderHandler />

                <Quote />

                <OverviewHandler />

                <WorkflowState />

                <WorkflowActionsHandler />

                <CardsDeckHandler />

                <WorkflowBlock state={state} displayState={EWorkflowState.FINAL_RESULTS}>
                    <ResultsHandler />
                </WorkflowBlock>

                <AppFooterHandler />

                <ErrorMessage message={errorMessage} />

                <div className="pig--spacer"></div>
            </AppContext.Provider>
        </div>
    );
}