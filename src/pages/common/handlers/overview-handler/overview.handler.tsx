import './overview.handler.css';
import { useContext, useEffect, useState } from 'react';
import { EWorkflowState, getWorkflowStateFromString, OverviewStory, OverviewTime } from '../../../../components';
import { AppContext } from '../../../common';

export function OverviewHandler() {
    const appContext = useContext(AppContext);
    const [story, setStory] = useState<number | null>(null);
    const [stories, setStories] = useState<number | null>(null);
    const [round, setRound] = useState<number | null>(null);
    const [started, setStarted] = useState<string | null>(null);
    const [ended, setEnd] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);
    const [pauses, setPauses] = useState<string | null>(null);
    const [finalEstimate, setFinalEstimate] = useState(false);
    const [hideOverview, setHideOverview] = useState(true);
    const [storyStarted, setStoryStarted] = useState(false);

    // When context for the step changes
    useEffect(() => {
        if (appContext.workflow && appContext.workflow.step) {
            setStory(appContext.workflow.step.story);
            setRound(appContext.workflow.step.round);
        }
    }, [appContext.workflow]);

    // When context for the state changes
    useEffect(() => {
        if (appContext.workflow?.state) {
            const state = getWorkflowStateFromString(appContext.workflow.state);

            setHideOverview(state === EWorkflowState.REGISTRATION);

            if (state === EWorkflowState.FINAL_RESULTS) {
                setFinalEstimate(true);
            }

            if (state === EWorkflowState.DISCUSSION || state === EWorkflowState.VOTE ||
                state === EWorkflowState.FINAL_ESTIMATE) {
                setStoryStarted(true);
            }
        }
    }, [appContext.workflow?.state]);

    useEffect(() => {
        if (finalEstimate && story && appContext.workflow) {
            const lastStory = appContext.workflow.step ? appContext.workflow.step.story : 0;
            const started = appContext.workflow.stories ? appContext.workflow.stories[1].dateStarted : 0;
            const ended = appContext.workflow.stories ? appContext.workflow.stories[lastStory].dateStarted : 0;
            const pauses = appContext.workflow.step && appContext.workflow.step.pauses ? appContext.workflow.step.pauses : 0;

            setStories(story);
            setStarted(formatDate(started));
            setEnd(formatDate(ended));
            setDuration(formatDuration(ended - started));
            setPauses(formatDuration(pauses));
        }
    }, [finalEstimate, story, appContext.workflow]);

    useEffect(() => {
        if (storyStarted && appContext.workflow) {
            const story = appContext.workflow.step ? appContext.workflow.step.story : 0;
            const dateStarted = appContext.workflow.stories ? appContext.workflow.stories[story].dateStarted : 0;

            setStarted(formatDate(dateStarted));
            setStoryStarted(false);
        }
    }, [storyStarted, appContext.workflow]);

    const formatDuration = (duration: number): string => {
        const inSeconds = Math.floor(duration / 1000);
        let minutes = Math.floor(inSeconds / 60);
        const hours = Math.floor((minutes / 60));
        const seconds = inSeconds % 60;

        if (seconds > 0) {
            minutes += 1;
        }

        return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
    }

    const formatDate = (value: number): string => {
        const date = new Date(value);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
    }

    return (
        <div className={`overview-handler ${hideOverview ? 'overview-handler--hidden' : ''}`}>
            <OverviewStory story={story} round={round} stories={stories} />
            <OverviewTime start={started} end={ended} duration={duration} pauses={pauses} />
        </div>
    );
};