import './pig.css';
import { useParams, useHistory } from 'react-router-dom';
import {
    AppHeader,
    AppFooter,
    ErrorMessage,
    WorkflowActions,
    WorkflowState,
    EWorkflowState,
    EBadgeTheme,
    OverviewStory,
    OverviewTime,
    getWorkflowStateFromString
} from '../../components';
import { useEffect, useState } from 'react';
import { createPig, checkPigExists, assignScrumMaster, unassignScrumMaster, setPig, transitionToDiscussion } from './pig.service';
import { checkBoardExists, getScrumMasterRef, getWorkflowStateRef } from '../common.services';

export function PigPage() {
    const { boardKey, key } = useParams<{ boardKey: string, key: string }>();
    const history = useHistory();
    const [workflowState, setWorkflowState] = useState(EWorkflowState.REGISTRATION);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isScrumMaster, setIsScrumMaster] = useState(false);
    const [hideToggle, setHideToggle] = useState(true);

    // Check if the params in the URL for the board key and the pig key exist in the database
    useEffect(() => {
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
                            setName(result.name);

                            if (result.email) {
                                setEmail(result.email);
                            }
                        }
                    });
                }
            } else {
                setErrorMessage('The board specified in the URL doesn\'t exist');
            }
        });
    }, [key, boardKey, history]);

    // Watch if a scrum master is assigned
    useEffect(() => {
        getScrumMasterRef(boardKey).on('value', (value) => {
            const scrumMaster = value.val();

            if (!scrumMaster || scrumMaster === key) {
                setHideToggle(false);

                if (scrumMaster === key && isScrumMaster === false) {
                    setIsScrumMaster(true);
                }
            } else {
                setHideToggle(true);
            }
        });
    }, [boardKey, key]);

    // Assign or unassign current pig as scrum master in the database
    useEffect(() => {
        isScrumMaster ? assignScrumMaster(boardKey, key) : !hideToggle && unassignScrumMaster(boardKey);
    }, [isScrumMaster, boardKey, key]);

    // Watch for the the state
    useEffect(() => {
        getWorkflowStateRef(boardKey)
            .on('value', (value) => setWorkflowState(getWorkflowStateFromString(value.val())));
    }, [boardKey])

    // Assign or unassign current pig as scrum master locally
    const handleToggleScrumMaster = (value: boolean) => setIsScrumMaster(value);

    // When the pig change his/her name or email address in the badge 
    const handlePigChange = (value: { name: string, email: string }) => {
        setPig(boardKey, key, value.name, value.email);
    };

    const handleAction = (state: EWorkflowState) => {
        switch (state) {
            case EWorkflowState.DISCUSSION:
                transitionToDiscussion(boardKey);
                break;
        }
    };

    return (
        <div className="pig">
            <AppHeader name={name} email={email} theme={EBadgeTheme.SECONDARY} onChange={handlePigChange} />
            <OverviewStory story={1} round={1} />
            <OverviewTime start="11:13" end="14:26" duration="1:34" story="3" pause="0:36" />
            <WorkflowState value={workflowState} />

            {
                isScrumMaster
                    ? <WorkflowActions currentState={workflowState} onAction={handleAction}></WorkflowActions>
                    : ''
            }

            <AppFooter hideToggle={hideToggle} toggleChecked={isScrumMaster} onToggleScrumMaster={handleToggleScrumMaster} />

            {
                errorMessage
                    ? <ErrorMessage message={errorMessage} />
                    : ''
            }
        </div>
    );
}