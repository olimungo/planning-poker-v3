import './pig.css';
import { useParams, useHistory } from 'react-router-dom';
import { AppHeader, ErrorMessage, WorkflowState, EWorkflowState, EBadgeTheme } from '../../components';
import { useEffect, useState } from 'react';
import { checkBoardExists, checkPigExists, createPig } from './pig.service';

export function Pig() {
    const { boardKey, key } = useParams<{ boardKey: string, key: string }>();
    const history = useHistory();
    const [workflowState, setWorkflowState] = useState(EWorkflowState.REGISTRATION);
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

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

    return (
        <div className="pig">
            <AppHeader name={name} email={email} theme={EBadgeTheme.SECONDARY} />
            <WorkflowState value={workflowState} />

            {
                errorMessage
                    ? <ErrorMessage message={errorMessage} />
                    : ''
            }
        </div>
    );
}