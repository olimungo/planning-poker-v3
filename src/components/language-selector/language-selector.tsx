import './language-selector.css';
import { useTranslation } from 'react-i18next';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../pages';
import { AppTheme } from '../app-theme';

export const languagesMap = [
    { locale: 'en', value: 'English' },
    { locale: 'fr', value: 'français' }
];

type Props = { onLanguageSelected: Function, onCancel: Function };

export function LanguageSelector(props: Props) {
    const { onLanguageSelected, onCancel } = props;
    const appContext = useContext(AppContext);
    const { t } = useTranslation();
    const [border, setBorder] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {
        if (appContext.theme === AppTheme.PRIMARY) {
            setBorder('language-selector--border-primary');
            setColor('language-selector--color-primary');
        } else {
            setBorder('language-selector--border-secondary');
            setColor('language-selector--color-secondary');
        }
    }, [appContext.theme]);

    const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onCancel();
    };

    const handleClick = (locale: string) => onLanguageSelected(locale);

    return (
        <form className={`language-selector ${border}`}>
            <h1>{t('form:Select a language')}</h1>

            <ul>
                {
                    languagesMap.map((language) =>
                        <li key={language.locale} onClick={() => handleClick(language.locale)}>
                            {language.value}
                        </li>
                    )
                }

            </ul>

            <div className="language-selector--buttons">
                <button className={color} onClick={handleCancel}>/ {t('form:CANCEL')} /</button>
            </div>
        </form>
    );
}