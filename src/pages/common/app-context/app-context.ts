import { createContext } from 'react';
import { AppTheme, EWorkflowState } from '../../../components'

export type PigType = {
    [key: string]: {
        dateCreated: number,
        name?: string,
        email?: string,
        isScrumMaster: boolean,
        vote?: string
    }
};

export type PigListType = {
    key: string,
    dateCreated: number,
    name?: string,
    email?: string,
    isScrumMaster: boolean,
    vote?: string
};

export type StoryType = {
    [key: number]: {
        dateStarted: number,
        dateEnded?: number,
        finalEstimate?: string
    };
};

export type WorkflowType = {
    dateCreated: number,
    state: string,
    nextState?: string,
    scrumMaster?: string,
    deckType?: number,
    step?: {
        story: number,
        round: number,
        pauses?: number,
        paused?: number
    },
    stories?: StoryType
};

export const workflowTypeInit: WorkflowType = {
    dateCreated: -1,
    state: EWorkflowState.UNKNOWN.toString(),
}

export type AppContextType = {
    boardKey?: string,
    pigKey?: string,
    pigs?: PigType,
    workflow?: WorkflowType,
    theme?: AppTheme
};

export const AppContextInit: AppContextType = {};

export const AppContext = createContext(AppContextInit);