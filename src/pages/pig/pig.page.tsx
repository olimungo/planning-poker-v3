import './pig.page.css';
import { useParams, useHistory } from 'react-router-dom';
import {
    AppHeader,
    AppFooter,
    ErrorMessage,
    WorkflowActions,
    WorkflowState,
    WorkflowBlock,
    EWorkflowState,
    EBadgeTheme,
    OverviewStory,
    OverviewTime,
    CardsDeck,
    getWorkflowStateFromString
} from '../../components';
import { useEffect, useState } from 'react';
import { createPig, checkPigExists, assignScrumMaster, unassignScrumMaster, savePig } from './pig.service';
import { checkBoardExists, getScrumMasterRef, getWorkflowStateRef, transitionToDiscussion, transitionTo, saveVote, getVote } from '../common.services';

export function PigPage() {
    const { boardKey, key } = useParams<{ boardKey: string, key: string }>();
    const history = useHistory();
    const [currentState, setCurrentState] = useState(EWorkflowState.UNKNOWN);
    const [nextState, setNextState] = useState(EWorkflowState.UNKNOWN);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isScrumMaster, setIsScrumMaster] = useState(false);
    const [hideToggle, setHideToggle] = useState(true);
    const [vote, setVote] = useState('');
    const [pigChanges, setPigChanges] = useState<{ name: string, email: string } | null>(null);

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

        // Check if the pig is voting
        getVote(boardKey, key).then((value) => {
            if (value) {
                setVote(value);
            }
        })
    }, [key, boardKey, history]);

    // Watch the database for a scrum master to be assigned or unassigned
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
    }, [boardKey, key, isScrumMaster]);

    // Assign or unassign current pig as scrum master in the database
    useEffect(() => {
        isScrumMaster ? assignScrumMaster(boardKey, key) : !hideToggle && unassignScrumMaster(boardKey);
    }, [boardKey, key, isScrumMaster, hideToggle]);

    // Watch the database for the current state
    useEffect(() => {
        getWorkflowStateRef(boardKey)
            .on('value', (value) => setCurrentState(getWorkflowStateFromString(value.val())));
    }, [boardKey])

    // Transition to next state in the database
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

    // Save any change in name or email to the database
    useEffect(() => {
        if (pigChanges && pigChanges.name) {
            savePig(boardKey, key, pigChanges.name, pigChanges.email);
        }
    }, [boardKey, key, pigChanges])

    // Save vote to the database
    useEffect(() => {
        if (vote) {
            saveVote(boardKey, key, vote);
        }
    }, [boardKey, key, vote])

    // Assign or unassign current pig as scrum master locally
    const handleToggleScrumMaster = (value: boolean) => setIsScrumMaster(value);
    // When the pig change his/her name or email address in the badge 
    const handlePigChanges = (value: { name: string, email: string }) => setPigChanges(value);
    // Transition workflow on actions from the scrum master
    const handleAction = (state: EWorkflowState) => setNextState(state);
    // Set vote for the current pig (or scrum master)
    const handleVote = (value: string) => setVote(value);

    return (
        <div className="pig">
            <AppHeader name={name} email={email} theme={EBadgeTheme.SECONDARY} onChange={handlePigChanges} />
            <OverviewStory story={1} round={1} />
            <OverviewTime start="11:13" end="14:26" duration="1:34" story="3" pause="0:36" />
            <WorkflowState value={currentState} />

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

            <AppFooter hideToggle={hideToggle} toggleChecked={isScrumMaster} onToggleScrumMaster={handleToggleScrumMaster} />

            {
                errorMessage
                    ? <ErrorMessage message={errorMessage} />
                    : ''
            }
        </div>
    );
}