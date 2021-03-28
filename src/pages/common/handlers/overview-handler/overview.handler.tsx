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
    const [start, setStart] = useState<string | null>(null);
    const [end, setEnd] = useState<string | null>(null);
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

        return () => {
            workflowRef.child('step/story').off();
            workflowRef.child('step/round').off();
            workflowRef.child('state').off();
        };
    }, [boardKey]);

    useEffect(() => {
        if (finalEstimate && story) {
            setStories(story - 1);
        }
    }, [finalEstimate, story]);

    useEffect(() => {
        if (storyStarted) {
            getWorkflowRef(boardKey).once('value', (value) => {
                const story = value.child('step/story').val();
                const dateStarted = value.child(`stories/${story}/dateStarted`).val();

                console.log(story, dateStarted)
                setStart(formatDate(dateStarted));
                setStoryStarted(false);
            })
        }
    }, [boardKey, storyStarted]);

    const formatDuration = (duration: number): string => {
        const inMinutes = Math.floor(duration / 1000 / 60);
        const hours = Math.floor((inMinutes / 60));
        const minutes = inMinutes % 60;

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
            <OverviewTime start={start} end={end} duration={duration} pauses={pauses} />
        </div>
    );
};