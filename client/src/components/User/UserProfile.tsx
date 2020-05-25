import React from "react";

import EditableText from "./EditableText";

import { ApplicationState } from "../../types/application-state.types";
import { UpdateStateActions } from "../../types/state-action.types";
import { AvailableThemes } from "../../types/theme.types";

import styles from "./UserProfile.module.scss";

type Props = {
    applicationState: ApplicationState;
    handleAppStateUpdate: (
        newState: ApplicationState,
        actionToTake: UpdateStateActions
    ) => void;
};

const UserProfile = (props: Props) => {
    const handleOnClick = async (theme: AvailableThemes): Promise<void> => {
        if (props.applicationState.isAuthenticated) {
            const token = props.applicationState.user?.token as string;
            const payload = {
                theme: theme,
            };

            const request = await fetch(`/api/user/profile`, {
                method: "PATCH",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(payload),
            });

            const response = await request.json();
            console.log(response);
        }

        // update the theme locally as well, just in case we're not logged in
        let newState = props.applicationState;
        newState.theme = theme;

        props.handleAppStateUpdate(newState, "updateThemeState");
    };

    return (
        <div className={styles.grid}>
            <h1>This is the user page</h1>
            <p>The current theme is: {props.applicationState.theme}</p>
            <button onClick={() => handleOnClick("dark")}>
                Set dark theme
            </button>
            <button onClick={() => handleOnClick("light")}>
                Set light theme
            </button>
            <hr />
            <EditableText initialText={"Test"} />
        </div>
    );
};

export default UserProfile;
