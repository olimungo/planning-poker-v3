import './pig.css';
import { useParams, useHistory } from 'react-router-dom';
import { AppHeader, AppFooter, ErrorMessage, WorkflowState, EWorkflowState, EBadgeTheme } from '../../components';
import { useEffect, useState } from 'react';
import { createPig, checkPigExists, setScrumMaster, unsetScrumMaster, setPig } from './pig.service';
import { checkBoardExists, getScrumMasterRef } from '../common.services';

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
        isScrumMaster ? setScrumMaster(boardKey, key) : !hideToggle && unsetScrumMaster(boardKey);
    }, [isScrumMaster, boardKey, key]);

    // Assign or unassign current pig as scrum master locally
    const handleToggleScrumMaster = (value: boolean) => setIsScrumMaster(value);

    // When the pig change his/her name or email address in the badge 
    const handlePigChange = (value: { name: string, email: string }) => {
        setPig(boardKey, key, value.name, value.email);
    };

    return (
        <div className="pig">
            <AppHeader name={name} email={email} theme={EBadgeTheme.SECONDARY} onChange={handlePigChange} />
            <WorkflowState value={workflowState} />
            <AppFooter hideToggle={hideToggle} toggleChecked={isScrumMaster} onToggleScrumMaster={handleToggleScrumMaster} />

            {
                errorMessage
                    ? <ErrorMessage message={errorMessage} />
                    : ''
            }
        </div>
    );
}