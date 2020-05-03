import React, { Component } from "react";

import ToDoForm from "./ToDoForm";

import { Item } from "../../types/to-do-types";

type Props = {};
type State = {
    items?: Item[];
};

class ToDoContainer extends Component<Props, State> {
    state: State = {
        items: [
            { isComplete: true, text: "Item 1" },
            { isComplete: false, text: "Item 2" },
            { isComplete: false, text: "Item 3" },
        ],
    };

    async componentDidMount() {
        await this.handleGetAllUserTodos();

        return;
    }

    handleGetAllUserTodos = async (): Promise<void> => {
        // TODO: Make sure this has authentication around it
        const fetchUserTodos = await fetch(`/api/users/todos`);
        const userTodos: {
            _id: string;
            author: string;
            isComplete: boolean;
            text: string;
        }[] = await fetchUserTodos.json();

        if (userTodos.length) {
            const todosToItems: Item[] = userTodos.map((todo) => {
                const item = {
                    _id: todo._id,
                    isComplete: todo.isComplete,
                    text: todo.text,
                } as Item;
                return item;
            });

            const stateItems = this.state.items ?? [];
            const newItems = [...stateItems, ...todosToItems];

            this.setState((prevState: State) => ({
                ...prevState,
                items: newItems,
            }));
        }

        return;
    };

    handleCreateOnClick = (inText: string): void => {
        const newItem: Item = {
            isComplete: false,
            text: inText,
        };

        let tempItems: Item[] = this.state.items ?? [];
        tempItems.push(newItem);

        this.setState((prevState: State) => ({
            ...prevState,
            items: tempItems,
        }));

        return;
    };

    handleIsCompleteChange = (index: number): void => {
        // there really must be items by this point else nothing would have been rendered and the button wouldn't show
        let tempItems: Item[] = this.state.items!;
        tempItems[index].isComplete = !tempItems[index].isComplete;

        this.setState((prevState: State) => ({
            ...prevState,
            items: tempItems,
        }));

        return;
    };

    handleDeleteOnClick = async (index: number): Promise<void> => {
        // there really must be items by this point else nothing would have been rendered and the button wouldn't show
        let tempItems: Item[] = this.state.items!;
        const currentItem: Item = this.state.items![index];

        try {
            if (currentItem._id) {
                const deleteRequest = await fetch(
                    `/api/users/todos/${currentItem._id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                        },
                    }
                );

                await deleteRequest
                    .json()
                    .then(() => this.handleGetAllUserTodos());
            }
        } catch (error) {
            console.error(error);
        } finally {
            tempItems.splice(index, 1);
            this.setState((prevState: State) => ({
                ...prevState,
                items: tempItems,
            }));
        }

        return;
    };

    render() {
        return (
            <div>
                This is the ToDoContainer
                <ToDoForm
                    items={this.state.items}
                    handleCreateOnClick={this.handleCreateOnClick}
                    handleIsCompleteChange={this.handleIsCompleteChange}
                    handleDeleteOnClick={this.handleDeleteOnClick}
                />
            </div>
        );
    }
}

export default ToDoContainer;
