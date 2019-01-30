import Vue from "vue";
import { UserConfigOptions } from "../common/config/user-config-options";
import { VueEventChannels } from "./vue-event-channels";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { FileHelpers } from "../main/helpers/file-helpers";
import { defaultApplicationSearchOptions } from "../main/plugins/application-search-plugin/default-application-search-plugin-options";
import { SettingsNotificationType } from "./settings-notification-type";
import { cloneDeep } from "lodash";
import { Settings } from "./settings";

export const applicationSearchSettingsComponent = Vue.extend({
    data() {
        return {
            errorMessage: "",
            newApplicationFileExtension: "",
            newApplicationFolder: "",
            settingName: Settings.ApplicationSearch,
            visible: false,
        };
    },
    methods: {
        addApplicationFileExtension() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFileExtensions.push(this.newApplicationFileExtension);
            this.newApplicationFileExtension = "";
            this.updateConfig(true);
        },
        addApplicationFolder() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFolders.push(this.newApplicationFolder);
            this.newApplicationFolder = "";
            this.updateConfig(true);
        },
        onAddFileExtensionClick() {
            if (!this.newApplicationFileExtension.startsWith(".")) {
                this.handleError(`"${this.newApplicationFileExtension}" is not a valid file extension`);
            } else {
                this.addApplicationFileExtension();
            }
        },
        onAddFolderClick() {
            FileHelpers.fileExists(this.newApplicationFolder)
                .then((folderExists) => {
                    if (folderExists) {
                        FileHelpers.getStats(this.newApplicationFolder)
                            .then((stats) => {
                                if (stats.stats.isDirectory()) {
                                    this.addApplicationFolder();
                                } else {
                                    this.handleError(`"${this.newApplicationFolder}" is not a directory`);
                                }
                            });
                    } else {
                        this.handleError(`The directory "${this.newApplicationFolder}" does not exist`);
                    }
                });
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.enabled = !config.applicationSearchOptions.enabled;
            this.updateConfig(true);
        },
        removeApplicationFileExtension(applicationFileExtension: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.applicationSearchOptions.applicationFileExtensions.indexOf(applicationFileExtension);
            config.applicationSearchOptions.applicationFileExtensions.splice(indexToRemove, 1);
            this.updateConfig(true);
        },
        removeApplicationFolder(applicationFolder: string) {
            const config: UserConfigOptions = this.config;
            const indexToRemove = config.applicationSearchOptions.applicationFolders.indexOf(applicationFolder);
            config.applicationSearchOptions.applicationFolders.splice(indexToRemove, 1);
            this.updateConfig(true);
        },
        resetApplicationFoldersToDefault() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFolders = cloneDeep(defaultApplicationSearchOptions.applicationFolders);
            this.updateConfig(true);
        },
        resetApplicationFileExtensionsToDefault() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.applicationFileExtensions = cloneDeep(defaultApplicationSearchOptions.applicationFileExtensions);
            this.updateConfig(true);
        },
        resetApplicationSearchOptionsToDefault() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions = cloneDeep(defaultApplicationSearchOptions);
            this.updateConfig(true);
        },
        resetFallbackIconFilePathToDefault() {
            const config: UserConfigOptions = this.config;
            config.applicationSearchOptions.fallbackIconFilePath = defaultApplicationSearchOptions.fallbackIconFilePath;
            this.updateConfig(true);
        },
        updateConfig(needsIndexRefresh: boolean) {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config, needsIndexRefresh);
        },
        handleError(message: string) {
            vueEventDispatcher.$emit(VueEventChannels.pushNotification, message, SettingsNotificationType.Error);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (settingName === this.settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });
    },
    props: ["config"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    Application Search
                </span>
                <div>
                    <button class="button" :class="{ 'is-success' : config.applicationSearchOptions.enabled }" @click="toggleEnabled">
                        <span class="icon"><i class="fas fa-power-off"></i></span>
                    </button>
                    <button v-if="config.applicationSearchOptions.enabled" class="button" @click="resetApplicationSearchOptionsToDefault">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <div class="settings__setting-content">
                <div class="settings__setting-content-item box" v-if="config.applicationSearchOptions.enabled">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">Application folders</div>
                        <button class="button" @click="resetApplicationFoldersToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns is-vcentered" v-for="applicationFolder in config.applicationSearchOptions.applicationFolders">
                        <div class="column is-four-fifths">
                            <input readonly type="text" class="input" v-model="applicationFolder">
                        </div>
                        <div class="column">
                            <button class="button is-danger" @click="removeApplicationFolder(applicationFolder)">
                                <span class="icon">
                                    <i class="fas fa-minus"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-four-fifths">
                            <input type="text" class="input" v-model="newApplicationFolder">
                        </div>
                        <div class="column">
                            <button class="button is-success" @click="onAddFolderClick">
                                <span class="icon">
                                    <i class="fas fa-plus"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="settings__setting-content-item box" v-if="config.applicationSearchOptions.enabled">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">Application file extensions</div>
                        <button class="button" @click="resetApplicationFileExtensionsToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns" v-for="applicationFileExtension in config.applicationSearchOptions.applicationFileExtensions">
                        <div class="column is-four-fifths">
                            <input readonly type="text" class="input" v-model="applicationFileExtension">
                        </div>
                        <div class="column">
                            <button class="button is-danger" @click="removeApplicationFileExtension(applicationFileExtension)">
                                <span class="icon">
                                    <i class="fas fa-minus"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column is-four-fifths">
                            <input type="text" class="input" v-model="newApplicationFileExtension">
                        </div>
                        <div class="column">
                            <button class="button is-success" @click="onAddFileExtensionClick">
                                <span class="icon">
                                    <i class="fas fa-plus"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="settings__setting-content-item box" v-if="config.applicationSearchOptions.enabled">
                    <div class="settings__setting-content-item-title">
                        <div class="title is-5">Default app icon</div>
                        <button class="button" @click="resetFallbackIconFilePathToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                    </div>
                    <div class="columns is-vcentered">
                        <div class="column is-four-fifths">
                            <div class="field has-addons">
                                <div class="control is-expanded">
                                    <input type="text" class="input" v-model="config.applicationSearchOptions.fallbackIconFilePath">
                                </div>
                                <div class="control">
                                    <button class="button is-success" @click="updateConfig">
                                        <span class="icon">
                                            <i class="fas fa-check"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="image is-48x48">
                                <img :src="config.applicationSearchOptions.fallbackIconFilePath">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
