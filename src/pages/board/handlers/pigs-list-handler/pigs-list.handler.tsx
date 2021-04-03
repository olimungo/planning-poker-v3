import './pigs-list.handler.css';
import { Badge } from '../../../../components';
import { useContext, useEffect, useState } from 'react';
import { AppContext, PigListType } from '../../../common';

type Props = { showVote?: boolean, isClickable?: boolean, };

export function PigsListHandler(props: Props) {
    const { showVote = false, isClickable = false } = props;
    const appContext = useContext(AppContext);
    const [pigs, setPigs] = useState<PigListType[]>([]);

    // Watch when pigs register and update the display
    useEffect(() => {
        if (appContext.pigs) {
            const pigs: PigListType[] = [];

            for (let key in appContext.pigs) {
                const dateCreated = appContext.pigs[key].dateCreated;
                const name = appContext.pigs[key].name;
                const email = appContext.pigs[key].email;
                const isScrumMaster = appContext.pigs[key].isScrumMaster;
                const vote = appContext.pigs[key].vote;
                pigs.push({ key, dateCreated, name, email, isScrumMaster, vote });
            }

            setPigs(pigs);
        }
    }, [appContext.pigs]);

    return (
        <div className="pigs-list">
            {
                pigs.map(pig =>
                    <Badge key={pig.key} name={pig.name} email={pig.email} vote={pig.vote} displayStar={pig.isScrumMaster} showVote={showVote}
                        isClickable={isClickable} theme={appContext.theme} />
                )
            }
        </div>
    );
};