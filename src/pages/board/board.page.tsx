import './board.page.css';
import { useParams, useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/database';
import {
    AppHeader,
    OverviewStory,
    OverviewTime,
    QrCode,
    EWorkflowState,
    ErrorMessage,
    AppFooter,
    PigsList,
    WorkflowState,
    getWorkflowStateFromString
} from '../../components';
import { useEffect, useState } from 'react';
import { createBoardKey, getPigRef, getPigsRef } from './board.service';
import { checkBoardExists } from '..';
import { getScrumMasterRef, getWorkflowStateRef, transitionTo } from '../common.services';

export function BoardPage() {
    const { key } = useParams<{ key: string }>();
    const history = useHistory();
    const [currentState, setCurrentState] = useState(EWorkflowState.REGISTRATION);
    const [errorMessage, setErrorMessage] = useState('');
    const [allPigsHaveVoted, setAllPigsHaveVoted] = useState(false);
    const [pigsRef, setPigsRef] = useState<firebase.database.Reference[]>([]);
    const scrumMasterRef = getScrumMasterRef(key)

    // Initialise board
    useEffect(() => {
        if (!key) {
            const boardKey = createBoardKey();

            if (boardKey) {
                history.push(`/board/${boardKey}`);
            } else {
                setErrorMessage('A mystic error occured while creating a board')
            }
        } else {
            checkBoardExists(key).then(boardExists => {
                if (!boardExists) {
                    setErrorMessage('The board referenced in the URL doesn\'t exist.')
                }
            });
        }
    }, [key, history]);

    // Watch the database for the current state
    useEffect(() => {
        getWorkflowStateRef(key).on('value', (value) => setCurrentState(getWorkflowStateFromString(value.val())));
    }, [key]);

    // Watch pigs for their votes
    useEffect(() => {
        getPigsRef(key).on('value', (pigs) => {
            let allVoted = true;

            pigs.forEach(pig => allVoted = allVoted && pig.child('vote').val());

            if (allVoted) {
                setAllPigsHaveVoted(true);
            }
        });
    }, [key]);

    // If all pigs have voted
    useEffect(() => {
        if (currentState === EWorkflowState.VOTE && allPigsHaveVoted) {
            transitionTo(key, EWorkflowState.DISCUSSION_POST_VOTE);
        }
    }, [currentState, allPigsHaveVoted]);

    // While waiting for pigs to register
    useEffect(() => {
        if (key) {
            getPigsRef(key).on('child_added', (value) => {
                if (value && value.key) {
                    const pig = getPigRef(key, value.key);

                    if (pig) {
                        setPigsRef((prevState) => [...prevState, pig]);
                    }
                }
            });
        }
    }, [key]);

    return (
        <div className="board">
            <AppHeader hideBadge={true} />
            <OverviewStory story={1} round={1} />
            <OverviewTime start="11:13" end="14:26" duration="1:34" story="3" pause="0:36" />

            <WorkflowState value={currentState} />

            <div className="board--qrcode">
                <QrCode value={`${window.location.origin}/pig/${key}`} />
            </div>

            <PigsList pigsRef={pigsRef} scrumMasterRef={scrumMasterRef} onClick={() => { }} showVotes={allPigsHaveVoted} />

            <AppFooter hideToggle={true} />

            {
                errorMessage
                    ? <ErrorMessage message={errorMessage} />
                    : ''
            }

            <div className="board--spacer"></div>
        </div>
    );
}