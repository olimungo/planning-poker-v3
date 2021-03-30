import './overview.handler.css';
import { useEffect, useState } from 'react';
import { EWorkflowState, OverviewStory, OverviewTime } from '../../../../components';
import { getWorkflowRef } from '../../../services'

type Props = {
    boardKey: string
};

export function OverviewHandler(props: Props) {
    const { boardKey } = props;
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

    //Watch the workflow and update the display
    useEffect(() => {
        const workflowRef = getWorkflowRef(boardKey);

        workflowRef.child('step/story').on('value', (value) => setStory(value.val()));
        workflowRef.child('step/round').on('value', (value) => setRound(value.val()));

        workflowRef.child('state').on('value', (value) => {
            if (value.val() === EWorkflowState.FINAL_RESULTS) {
                setFinalEstimate(true);
            }

            setHideOverview(value.val() === EWorkflowState.REGISTRATION);

            if (value.val() === EWorkflowState.DISCUSSION) {
                setStoryStarted(true);
            }
        });
    }, [boardKey]);

    useEffect(() => {
        if (finalEstimate && story) {
            getWorkflowRef(boardKey).once('value', (value) => {
                const lastStory = value.child('step/story').val()
                const started = value.child(`stories/1/dateStarted`).val();
                const ended = value.child(`stories/${lastStory}/dateEnded`).val();
                const pauses = value.child(`step/pauses`).val();

                setStories(story);
                setStarted(formatDate(started));
                setEnd(formatDate(ended));
                setDuration(formatDuration(ended - started));
                setPauses(formatDuration(pauses));
            });
        }
    }, [boardKey, finalEstimate, story]);

    useEffect(() => {
        if (storyStarted) {
            getWorkflowRef(boardKey).once('value', (value) => {
                const story = value.child('step/story').val();
                const dateStarted = value.child(`stories/${story}/dateStarted`).val();

                setStarted(formatDate(dateStarted));
                setStoryStarted(false);
            })
        }
    }, [boardKey, storyStarted]);

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
        <div className={`overview-hanlder ${hideOverview ? 'overview-handler--hidden' : ''}`}>
            <OverviewStory story={story} round={round} stories={stories} />
            <OverviewTime start={started} end={ended} duration={duration} pauses={pauses} />
        </div>
    );
};