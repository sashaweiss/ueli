import { Field, Input, Slider, Switch } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { useSetting } from "../../Hooks";
import { Section } from "../Section";
import { SectionList } from "../SectionList";

export const SearchEngine = () => {
    const { t } = useTranslation();

    const { value: automaticRescanEnabled, updateValue: setAutomaticRescanEnabled } = useSetting(
        "searchEngine.automaticRescan",
        true,
    );
    const { value: rescanIntervalInSeconds, updateValue: setRescanIntervalInSeconds } = useSetting(
        "searchEngine.rescanIntervalInSeconds",
        60,
    );

    const { value: fuzziness, updateValue: setFuzziness } = useSetting("searchEngine.fuzziness", 0.6);

    return (
        <SectionList>
            <Section>
                <Field label={t("settingsSearchEngine.automaticRescan")}>
                    <Switch
                        aria-labelledby="searchEngine.automaticRescan"
                        checked={automaticRescanEnabled}
                        onChange={(_, { checked }) => setAutomaticRescanEnabled(checked)}
                    />
                </Field>
            </Section>
            <Section>
                <Field label={t("settingsSearchEngine.rescanIntervalInSeconds")} validationState="none">
                    <Input
                        value={`${rescanIntervalInSeconds}`}
                        onChange={(_, { value }) => setRescanIntervalInSeconds(Number(value))}
                        type="number"
                        disabled={!automaticRescanEnabled}
                    />
                </Field>
            </Section>
            <Section>
                <Field label={t("settingsSearchEngine.fuzziness")}>
                    <Slider
                        aria-labelledby="searchEngine.fuzziness"
                        value={fuzziness}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={(_, { value }) => setFuzziness(value)}
                    />
                </Field>
            </Section>
        </SectionList>
    );
};
